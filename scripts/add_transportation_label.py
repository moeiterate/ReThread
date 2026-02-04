#!/usr/bin/env python3
"""
Add a "Transportation" label to every card on the ReThread Sprint Board that is
NOT in the Admin / Setup list. Use this to color-code sprint/transportation work;
admin tasks stay without this label.

Creates the Transportation label on the board if it doesn't exist (green).
Uses secrets.json or TRELLO_* env. TRELLO_BOARD_SHORT_LINK or board name.
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
LABEL_NAME = "Transportation"
LABEL_COLOR = "green"


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

    # Get lists to know which list id is Admin / Setup
    r = requests.get(f"{BASE}/boards/{board_id}/lists", params=params)
    if r.status_code != 200:
        print(f"Lists fetch failed: {r.text}", file=sys.stderr)
        return 1
    lists = r.json()
    admin_list_ids = {lst["id"] for lst in lists if lst.get("name") == ADMIN_LIST_NAME}

    # Get or create Transportation label
    r = requests.get(f"{BASE}/boards/{board_id}/labels", params=params)
    if r.status_code != 200:
        print(f"Labels fetch failed: {r.text}", file=sys.stderr)
        return 1
    labels = r.json()
    transport_label = next((lb for lb in labels if (lb.get("name") or "").strip() == LABEL_NAME), None)
    if not transport_label:
        r = requests.post(
            f"{BASE}/labels",
            params={**params, "name": LABEL_NAME, "color": LABEL_COLOR, "idBoard": board_id},
        )
        if r.status_code != 200:
            print(f"Failed to create label '{LABEL_NAME}': {r.text}", file=sys.stderr)
            return 1
        transport_label = r.json()
        print(f"Created label: {LABEL_NAME} ({LABEL_COLOR})")
    label_id = transport_label["id"]

    # Get all cards (with idList and idLabels)
    r = requests.get(f"{BASE}/boards/{board_id}/cards", params={**params, "fields": "id,name,idList,idLabels"})
    if r.status_code != 200:
        print(f"Cards fetch failed: {r.text}", file=sys.stderr)
        return 1
    cards = r.json()

    added = 0
    for card in cards:
        id_list = card.get("idList")
        if id_list in admin_list_ids:
            continue
        id_labels = card.get("idLabels") or []
        if label_id in id_labels:
            continue
        r = requests.post(
            f"{BASE}/cards/{card['id']}/idLabels",
            params={**params, "value": label_id},
        )
        if r.status_code == 200:
            print(f"  + {LABEL_NAME}: {card.get('name', '')[:50]}...")
            added += 1
        else:
            print(f"  Failed: {card.get('name', '')[:40]} – {r.text}", file=sys.stderr)

    print(f"\nDone. Added '{LABEL_NAME}' to {added} card(s). Cards in Admin / Setup were left untagged.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
