#!/usr/bin/env python3
"""
Create a ReThread Sprint Trello board from data/sprint_process.json.

- One list (column): Backlog (ideas + kill items), then one list per phase from the JSON (e.g. Phase 1 … Phase 8).
- In each phase list: a template card with that phase’s purpose, outputs, exit criteria,
  and checklist (mirroring the Sprints tab). Phase 1/4 get Problem Spec template;
  Phase 4 gets Solution Spec; Phase 6 gets Release Post template.
- Backlog list gets a short “Kill / ideas” template card.

Requires: TRELLO_API_KEY and TRELLO_TOKEN from env, or secrets.json (keys TRELLO_API_KEY, TRELLO_TOKEN), or prompts.
Optional: TRELLO_ORG_ID to create the board in a workspace.
Optional: TRELLO_BOARD_ID or TRELLO_BOARD_SHORT_LINK to add lists/cards to an existing board instead of creating one.
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


def load_secrets():
    """Load TRELLO_API_KEY and TRELLO_TOKEN from secrets.json if present."""
    if not SECRETS_PATH.exists():
        return {}
    try:
        with open(SECRETS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, OSError):
        return {}


def get_trello_credentials():
    """Get key and token from env, then secrets.json (trello.api_key / trello.token), then prompt."""
    key = os.environ.get("TRELLO_API_KEY", "").strip()
    token = os.environ.get("TRELLO_TOKEN", "").strip()
    if not key or not token:
        secrets = load_secrets()
        trello = secrets.get("trello") or {}
        key = key or trello.get("api_key") or secrets.get("TRELLO_API_KEY") or ""
        token = token or trello.get("token") or secrets.get("TRELLO_TOKEN") or ""
        if isinstance(key, str):
            key = key.strip()
        if isinstance(token, str):
            token = token.strip()
    if not key or not token:
        key = input("Trello API Key: ").strip()
        token = input("Trello Token: ").strip()
    return key, token


def load_sprint_data():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def build_phase_template_desc(phase, templates):
    """Build markdown description for the phase template card."""
    lines = [
        f"**Purpose:** {phase['purpose']}",
        "",
        "**Required outputs:**",
    ]
    for o in phase.get("outputs", []):
        lines.append(f"- {o}")
    lines.extend(["", "**Exit criteria:**"])
    for e in phase.get("exitCriteria", []):
        lines.append(f"- {e}")
    lines.append("")
    lines.append("**Checklist (use card checklist):**")
    for c in phase.get("checklist", []):
        label = c.get("label", c) if isinstance(c, dict) else c
        lines.append(f"- [ ] {label}")
    return "\n".join(lines)


def build_spec_card_desc(template):
    """Build description for a spec template card (problem, solution, release)."""
    lines = [
        template.get("description", ""),
        "",
        "**Fields:**",
    ]
    for f in template.get("fields", []):
        lines.append(f"- [ ] {f}")
    return "\n".join(lines)


def create_checklist_on_card(requests_params, card_id, items, checklist_name="Checklist"):
    key = requests_params["key"]
    token = requests_params["token"]
    params = {**requests_params, "idCard": card_id, "name": checklist_name}
    r = requests.post(f"{BASE}/checklists", params=params)
    if r.status_code != 200:
        return
    cl_id = r.json()["id"]
    for item in items:
        label = item.get("label", item) if isinstance(item, dict) else item
        requests.post(
            f"{BASE}/checklists/{cl_id}/checkItems",
            params={"key": key, "token": token},
            json={"name": label},
        )


def main():
    data = load_sprint_data()
    phases = data.get("phases", [])
    templates = data.get("templates", {})

    key, token = get_trello_credentials()
    if not key or not token:
        print("Need TRELLO_API_KEY and TRELLO_TOKEN (env, secrets.json, or prompt).", file=sys.stderr)
        return 1
    params = {"key": key, "token": token}

    org_id = os.environ.get("TRELLO_ORG_ID", "").strip()
    existing_board_id = os.environ.get("TRELLO_BOARD_ID", "").strip()
    existing_board_short = os.environ.get("TRELLO_BOARD_SHORT_LINK", "").strip()

    if existing_board_id or existing_board_short:
        # Use existing board (resolve short link to id if needed)
        if existing_board_id:
            board_id = existing_board_id
        else:
            r = requests.get(f"{BASE}/boards/{existing_board_short}", params=params)
            if r.status_code != 200:
                print(f"Board not found: {r.text}", file=sys.stderr)
                return 1
            board_id = r.json()["id"]
        r = requests.get(f"{BASE}/boards/{board_id}", params=params)
        if r.status_code != 200:
            print(f"Board not found: {r.text}", file=sys.stderr)
            return 1
        board = r.json()
        print(f"Using existing board: {board.get('shortUrl', board_id)}")
    else:
        # Create board
        board_name = "ReThread Sprint Board"
        create_params = {**params, "name": board_name, "defaultLists": "false"}
        if org_id:
            create_params["idOrganization"] = org_id
        r = requests.post(f"{BASE}/boards", params=create_params)
        if r.status_code != 200:
            print(f"Failed to create board: {r.text}", file=sys.stderr)
            return 1
        board = r.json()
        board_id = board["id"]
        print(f"Board created: {board['shortUrl']}")

    # Lists: Backlog first, then one per phase from JSON (e.g. 1..8)
    list_names = ["Backlog"]
    for p in phases:
        list_names.append(f"{p['num']}. {p['title']} ({p['timebox']})")

    list_ids = {}
    if existing_board_id or existing_board_short:
        r = requests.get(f"{BASE}/boards/{board_id}/lists", params=params)
        if r.status_code == 200:
            for lst in r.json():
                list_ids[lst["name"]] = lst["id"]
    for i, name in enumerate(list_names):
        if name in list_ids:
            print(f"  List (existing): {name}")
            continue
        pos = "bottom" if (existing_board_id or existing_board_short) else str(i + 1)
        r = requests.post(f"{BASE}/boards/{board_id}/lists", params={**params, "name": name, "pos": pos})
        if r.status_code != 200:
            print(f"Failed to create list '{name}': {r.text}", file=sys.stderr)
            continue
        list_ids[name] = r.json()["id"]
        print(f"  List: {name}")

    backlog_id = list_ids.get("Backlog")
    if backlog_id:
        backlog_desc = """**Use this list for:**
- New ideas (to triage into the sprint)
- Kill decisions: when you kill an idea in Phase 3, add a card here with 1–2 sentences on why and what you learned."""
        r = requests.post(
            f"{BASE}/cards",
            params={
                **params,
                "idList": backlog_id,
                "name": "📋 Backlog / Kill — Copy for new ideas or kill notes",
                "desc": backlog_desc,
                "pos": "top",
            },
        )
        if r.status_code == 200:
            print("  Backlog template card created.")

    # Phase list id by phase num (e.g. "1. LLM Research (Days 1-2)")
    def list_id_for_phase(phase):
        name = f"{phase['num']}. {phase['title']} ({phase['timebox']})"
        return list_ids.get(name)

    for phase in phases:
        list_id = list_id_for_phase(phase)
        if not list_id:
            continue
        lid = phase["id"]
        title = phase["title"]

        # 1) Phase template card (purpose, outputs, exit criteria, checklist)
        desc = build_phase_template_desc(phase, templates)
        card_name = f"Template: {title}"
        r = requests.post(
            f"{BASE}/cards",
            params={
                **params,
                "idList": list_id,
                "name": card_name,
                "desc": desc,
                "pos": "top",
            },
        )
        if r.status_code != 200:
            print(f"  Failed phase card '{card_name}': {r.text}", file=sys.stderr)
            continue
        card_id = r.json()["id"]
        checklist_items = phase.get("checklist", [])
        if checklist_items:
            create_checklist_on_card(params, card_id, checklist_items, checklist_name="Phase checklist")
        print(f"  Phase {phase['num']}: {card_name}")

        # 2) Attach spec templates where relevant
        if phase["num"] == 1 or phase["num"] == 4:
            t = templates.get("problemSpec")
            if t:
                spec_desc = build_spec_card_desc(t)
                r2 = requests.post(
                    f"{BASE}/cards",
                    params={
                        **params,
                        "idList": list_id,
                        "name": f"📄 {t['title']}",
                        "desc": spec_desc,
                        "pos": "bottom",
                    },
                )
                if r2.status_code == 200:
                    print(f"    + {t['title']}")
        if phase["num"] == 4:
            t = templates.get("solutionSpec")
            if t:
                spec_desc = build_spec_card_desc(t)
                r2 = requests.post(
                    f"{BASE}/cards",
                    params={
                        **params,
                        "idList": list_id,
                        "name": f"📄 {t['title']}",
                        "desc": spec_desc,
                        "pos": "bottom",
                    },
                )
                if r2.status_code == 200:
                    print(f"    + {t['title']}")
        if phase["num"] == 6:
            t = templates.get("releasePost")
            if t:
                spec_desc = build_spec_card_desc(t)
                r2 = requests.post(
                    f"{BASE}/cards",
                    params={
                        **params,
                        "idList": list_id,
                        "name": f"📄 {t['title']}",
                        "desc": spec_desc,
                        "pos": "bottom",
                    },
                )
                if r2.status_code == 200:
                    print(f"    + {t['title']}")

    print(f"\nDone. Board URL: {board.get('url', board['shortUrl'])}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
