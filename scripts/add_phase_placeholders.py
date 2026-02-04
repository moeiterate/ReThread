#!/usr/bin/env python3
"""
Add phase placeholder cards to Week A: Discovery and Week B: Execution on the
ReThread Sprint Board. Each card gets the phase title, purpose, outputs, exit criteria,
and the same checklist as the Sprints tab (from data/sprint_process.json).
Assigns the lead: Week A (phases 1–3) = Moaz, Week B (phases 4–8) = Ahmad.

Requires Trello usernames for assignment. In secrets.json under "trello":
  "member_username_moaz": "moazelhag",   // or your Trello username
  "member_username_ahmad": "ahmadtaleb"

Uses same board resolution as other scripts (TRELLO_BOARD_SHORT_LINK or board name).
"""
import json
import os
import sys
from pathlib import Path

import requests

BASE = "https://api.trello.com/1"
SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
DATA_PATH = REPO_ROOT / "data" / "sprint_process.json"
SECRETS_PATH = REPO_ROOT / "secrets.json"

WEEK_A_LIST = "Week A: Discovery"
WEEK_B_LIST = "Week B: Execution"

# Lead by week: phases 1–3 = Moaz, phases 4–8 = Ahmad
LEAD_BY_WEEK = {"A": "moaz", "B": "ahmad"}


def load_secrets():
    if not SECRETS_PATH.exists():
        return {}
    try:
        with open(SECRETS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return {}


def get_trello_credentials():
    key = os.environ.get("TRELLO_API_KEY", "").strip()
    token = os.environ.get("TRELLO_TOKEN", "").strip()
    if not key or not token:
        secrets = load_secrets()
        trello = secrets.get("trello") or {}
        key = key or trello.get("api_key") or ""
        token = token or trello.get("token") or ""
        if isinstance(key, str):
            key = key.strip()
        if isinstance(token, str):
            token = token.strip()
    if not key or not token:
        key = input("Trello API Key: ").strip()
        token = input("Trello Token: ").strip()
    return key, token


def get_board_id(params):
    board_id = os.environ.get("TRELLO_BOARD_ID", "").strip()
    short = os.environ.get("TRELLO_BOARD_SHORT_LINK", "").strip()
    if board_id:
        r = requests.get(f"{BASE}/boards/{board_id}", params=params)
        if r.status_code == 200:
            return r.json()["id"]
    if short:
        r = requests.get(f"{BASE}/boards/{short}", params=params)
        if r.status_code == 200:
            return r.json()["id"]
    r = requests.get(f"{BASE}/members/me/boards", params=params)
    if r.status_code != 200:
        return None
    for b in r.json():
        if b.get("name") == "ReThread Sprint Board":
            return b["id"]
    return None


def get_member_ids(board_id, params):
    """Resolve Moaz and Ahmad Trello usernames to member IDs. Reads secrets.json trello.member_username_moaz, member_username_ahmad."""
    r = requests.get(f"{BASE}/boards/{board_id}/members", params=params)
    if r.status_code != 200:
        return None, None
    members = r.json()
    secrets = load_secrets()
    trello = secrets.get("trello") or {}
    username_moaz = (trello.get("member_username_moaz") or os.environ.get("TRELLO_USERNAME_MOAZ") or "moazelhag").strip().lower()
    username_ahmad = (trello.get("member_username_ahmad") or os.environ.get("TRELLO_USERNAME_AHMAD") or "ahmadtaleb").strip().lower()
    moaz_id = None
    ahmad_id = None
    for m in members:
        un = (m.get("username") or "").lower()
        fn = (m.get("fullName") or "").lower()
        if un == username_moaz:
            moaz_id = m["id"]
        elif not moaz_id and ("moaz" in fn or "moaz" in un):
            moaz_id = m["id"]
        if un == username_ahmad:
            ahmad_id = m["id"]
        elif not ahmad_id and ("ahmad" in fn or un == "ahmadtaleb"):
            ahmad_id = m["id"]
    return moaz_id, ahmad_id


def build_card_desc(phase):
    lines = [f"**Purpose:** {phase['purpose']}", "", "**Outputs:**"]
    for o in phase.get("outputs", []):
        lines.append(f"- {o}")
    lines.extend(["", "**Exit criteria:**"])
    for e in phase.get("exitCriteria", []):
        lines.append(f"- {e}")
    return "\n".join(lines)


def add_checklist_to_card(params, card_id, phase):
    name = f"Phase {phase['num']} checklist"
    r = requests.post(f"{BASE}/checklists", params={**params, "idCard": card_id, "name": name})
    if r.status_code != 200:
        return
    cl_id = r.json()["id"]
    for item in phase.get("checklist", []):
        label = item.get("label", item) if isinstance(item, dict) else item
        requests.post(
            f"{BASE}/checklists/{cl_id}/checkItems",
            params={"key": params["key"], "token": params["token"]},
            json={"name": label},
        )


def main():
    key, token = get_trello_credentials()
    if not key or not token:
        print("Need Trello API key and token.", file=sys.stderr)
        return 1
    params = {"key": key, "token": token}

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    phases = data.get("phases", [])

    board_id = get_board_id(params)
    if not board_id:
        print("Board not found.", file=sys.stderr)
        return 1

    r = requests.get(f"{BASE}/boards/{board_id}/lists", params=params)
    if r.status_code != 200:
        print(f"Lists fetch failed: {r.text}", file=sys.stderr)
        return 1
    lists = r.json()
    list_by_name = {lst["name"]: lst for lst in lists}
    week_a = list_by_name.get(WEEK_A_LIST)
    week_b = list_by_name.get(WEEK_B_LIST)
    if not week_a or not week_b:
        print(f"Need lists '{WEEK_A_LIST}' and '{WEEK_B_LIST}'. Create them first or run restructure_sprint_board.py.", file=sys.stderr)
        return 1

    moaz_id, ahmad_id = get_member_ids(board_id, params)
    if not moaz_id:
        print("Warning: Could not resolve Moaz (Week A lead). Add trello.member_username_moaz to secrets.json.", file=sys.stderr)
    if not ahmad_id:
        print("Warning: Could not resolve Ahmad (Week B lead). Add trello.member_username_ahmad to secrets.json (e.g. ahmadtaleb).", file=sys.stderr)

    for phase in phases:
        week = phase.get("week", "A")
        num = phase["num"]
        title = phase["title"]
        timebox = phase.get("timebox", "")
        list_obj = week_a if week == "A" else week_b
        lead_id = moaz_id if week == "A" else ahmad_id
        card_name = f"{num}. {title} ({timebox})"
        desc = build_card_desc(phase)
        r = requests.post(
            f"{BASE}/cards",
            params={
                **params,
                "idList": list_obj["id"],
                "name": card_name,
                "desc": desc + f"\n\n**Lead:** {LEAD_BY_WEEK[week].capitalize()}",
                "pos": "bottom",
            },
        )
        if r.status_code != 200:
            print(f"Failed to create card '{card_name}': {r.text}", file=sys.stderr)
            continue
        card_id = r.json()["id"]
        add_checklist_to_card(params, card_id, phase)
        if lead_id:
            rm = requests.post(
                f"{BASE}/cards/{card_id}/idMembers",
                params={**params, "value": lead_id},
            )
            if rm.status_code == 200:
                print(f"  Created + assigned lead: {card_name}")
            else:
                print(f"  Created (assign lead manually): {card_name}")
        else:
            print(f"  Created (assign lead manually): {card_name}")

    print("\nDone. Phase placeholders are in Week A (lead Moaz) and Week B (lead Ahmad) with checklists from the Sprints tab.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
