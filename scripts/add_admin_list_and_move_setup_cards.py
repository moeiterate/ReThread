#!/usr/bin/env python3
"""
Add an "Admin / Setup" list to the ReThread Sprint Board and move setup/operational
cards out of Week A and Week B so those columns are phase work only.

Board layout after run:
  Backlog | Admin / Setup | Week A: Discovery | Week B: Execution | Blocked / Waiting | Done

- Week A / Week B = phase deliverables only (Hypothesis Research → Validation; Problem Lock → Knowledge Freeze).
- Admin / Setup = landing page, social media, content pipeline, case studies, website, etc.
- Convention: top card in Week A (and Week B) = in progress; or use label "In progress" on 1–2 cards.

Uses secrets.json or TRELLO_* env. TRELLO_BOARD_SHORT_LINK or board name "ReThread Sprint Board".
"""
import json
import os
import sys
from pathlib import Path

import requests

BASE = "https://api.trello.com/1"
SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
SECRETS_PATH = REPO_ROOT / "secrets.json"

ADMIN_LIST_NAME = "Admin / Setup"
LIST_ORDER = [
    "Backlog",
    ADMIN_LIST_NAME,
    "Week A: Discovery",
    "Week B: Execution",
    "Blocked / Waiting",
    "Done",
]

# Card name substrings: if a card in Week A or Week B contains any of these, move to Admin / Setup
ADMIN_CARD_SUBSTRINGS = [
    "Social media (LinkedIn, Instagram)",
    "Content publishing",
    "Landing page",
    "Client-facing website",
    "Case studies / portfolio",
    "Publish Upwork automation analysis",
    "Publish Upwork automation",
    "Add research-as-a-service to backlog",
    "research-as-a-service",
]


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


def is_admin_card(card_name):
    return any(s in card_name for s in ADMIN_CARD_SUBSTRINGS)


def main():
    key, token = get_trello_credentials()
    if not key or not token:
        print("Need Trello API key and token.", file=sys.stderr)
        return 1
    params = {"key": key, "token": token}

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

    # Create Admin / Setup if missing (insert after Backlog)
    if ADMIN_LIST_NAME not in list_by_name:
        r = requests.post(
            f"{BASE}/boards/{board_id}/lists",
            params={**params, "name": ADMIN_LIST_NAME, "pos": "2"},
        )
        if r.status_code != 200:
            print(f"Failed to create list '{ADMIN_LIST_NAME}': {r.text}", file=sys.stderr)
            return 1
        list_by_name[ADMIN_LIST_NAME] = r.json()
        print(f"Created list: {ADMIN_LIST_NAME}")

    admin_list_id = list_by_name[ADMIN_LIST_NAME]["id"]
    week_a_id = list_by_name.get("Week A: Discovery", {}).get("id")
    week_b_id = list_by_name.get("Week B: Execution", {}).get("id")

    r = requests.get(f"{BASE}/boards/{board_id}/cards", params=params)
    if r.status_code != 200:
        print(f"Cards fetch failed: {r.text}", file=sys.stderr)
        return 1
    cards = r.json()

    moved = 0
    for card in cards:
        name = card.get("name", "")
        id_list = card.get("idList")
        if id_list not in (week_a_id, week_b_id):
            continue
        if not is_admin_card(name):
            continue
        r = requests.put(
            f"{BASE}/cards/{card['id']}",
            params=params,
            json={"idList": admin_list_id},
        )
        if r.status_code == 200:
            print(f"  Moved to Admin / Setup: {name[:55]}...")
            moved += 1
        else:
            print(f"  Failed to move '{name[:40]}': {r.text}", file=sys.stderr)

    print(f"\nDone. Moved {moved} card(s) to Admin / Setup.")
    print("Board: Backlog | Admin / Setup | Week A: Discovery | Week B: Execution | Blocked / Waiting | Done")
    print("Use Week A / Week B for phase work only; top card = in progress (or add label 'In progress').")
    return 0


if __name__ == "__main__":
    sys.exit(main())
