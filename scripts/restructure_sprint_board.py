#!/usr/bin/env python3
"""
Restructure existing ReThread Sprint Board to Option A:
  Backlog | Week A: Discovery | Week B: Execution | Blocked / Waiting | Done

REMAIN (moved into Option A lists):
- Idea Backlog → Backlog: TEMPLATE: Copy This Card, Draft Reservations Workflow Discovery Questions
- Current Sprint / Sprint Backlog → Week A: ARIZONA TRANSPORTATION COMPANIES, Research Geotab + Fleetio APIs,
  Scan Upwork/Fiverr for Transportation Automation Jobs, Research Platform Marketplaces (Limo Anywhere + Geotab)
- Active → Week B: MVP Polish + Google Maps/Mapbox Integration, Explore Make.com Integration Partner Program,
  QuickBooks API Proof of Concept
- Blocked / Waiting → Blocked / Waiting: Deep Dive on Cousin's Reservations Workflow
- Done → Done (unchanged)

REMOVE (archived):
- Camping checklist web app
- Vibe System Design Tool - IDE for Architecture Planning
- NetWorth Hub - Multi-Entity Financial Dashboard SaaS
- Open Source: Fitness on the Fly - Private LLM Personal Trainer
(Unrelated product ideas; do not map to ReThread Research Lab / transportation / content focus.)

Script also adds agreed-upon tasks from today with 2-day SLA.
Uses secrets.json (trello.api_key, trello.token) or TRELLO_* env. TRELLO_BOARD_SHORT_LINK or board name.
"""
import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

import requests

BASE = "https://api.trello.com/1"
SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
SECRETS_PATH = REPO_ROOT / "secrets.json"

# Option A list names (order)
OPTION_A_LISTS = [
    "Backlog",
    "Week A: Discovery",
    "Week B: Execution",
    "Blocked / Waiting",
    "Done",
]

# Old list name -> new list name (for moving cards)
OLD_TO_NEW_LIST = {
    "Idea Backlog": "Backlog",
    "Research (Pre-Sprint)": "Backlog",
    "Current Sprint": "Week A: Discovery",
    "Sprint Backlog": "Week A: Discovery",
    "Active": "Week B: Execution",
    "Blocked / Waiting": "Blocked / Waiting",
    "Done": "Done",
}

# Exact card names to archive (unrelated ideas; remove from board)
ARCHIVE_CARD_NAMES = {
    "Camping checklist web app",
    "Vibe System Design Tool - IDE for Architecture Planning",
    "NetWorth Hub - Multi-Entity Financial Dashboard SaaS",
    "Open Source: Fitness on the Fly - Private LLM Personal Trainer",
}

# Agreed tasks from today: (name, desc, list, sla_days)
AGREED_TASKS = [
    ("Ahmad: Publish branch for internal process", "Publish branch for our internal process.", "Week A: Discovery", 2),
    ("Moaz: Scrutinize and provide feedback", "Scrutinize and provide feedback on internal process.", "Week A: Discovery", 2),
    ("Moaz: Create board for new process in Trello", "Create board for new process in Trello.", "Week A: Discovery", 2),
    ("Ahmad: Client-facing website for ReThread Research Lab", "Create client-facing website for ReThread Research Lab.", "Week B: Execution", 2),
    ("Moaz/Ahmad: Case studies / portfolio", "Include case studies/portfolio: Microsoft, Tripadvisor, Japan Airlines, Alma Transport, Clearcasa.", "Week B: Execution", 2),
    ("Ahmad: Landing page – process and who you've worked with", "Landing page explaining process and who you've worked with.", "Week B: Execution", 2),
    ("Moaz: Social media (LinkedIn, Instagram) – ReThread brand", "Set up social media accounts (LinkedIn, Instagram) under ReThread brand. Research lab positioning: we're figuring out how to help SMBs.", "Week B: Execution", 2),
    ("Moaz: Publish Upwork automation analysis as first public content", "Publish the Upwork automation analysis you already built as first public content piece.", "Week B: Execution", 2),
    ("Moaz: Content publishing pipeline", "Create content publishing pipeline – automate posting across Substack, Instagram, Facebook, LinkedIn from single source.", "Week B: Execution", 2),
    ("Ahmad/Moaz: Transportation research/content – organize and publish", "Add research/content from transportation; organize research and publish it.", "Week B: Execution", 2),
    ("Ahmad: Fix errors – route optimizer MVP/POC", "Fix errors on route optimizer MVP/POC.", "Week B: Execution", 2),
    ("Moaz: Add research-as-a-service to backlog for next sprint", "Add research as a service item to our backlog for next sprint.", "Week A: Discovery", 2),
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
    # Find by name
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
        print("Board not found. Set TRELLO_BOARD_SHORT_LINK or TRELLO_BOARD_ID, or ensure a board named 'ReThread Sprint Board' exists.", file=sys.stderr)
        return 1
    print("Using ReThread Sprint Board")

    # Get lists
    r = requests.get(f"{BASE}/boards/{board_id}/lists", params=params)
    if r.status_code != 200:
        print(f"Lists fetch failed: {r.text}", file=sys.stderr)
        return 1
    lists = r.json()
    list_by_name = {lst["name"]: lst for lst in lists}

    # Ensure Option A lists exist (create if missing)
    for i, list_name in enumerate(OPTION_A_LISTS):
        if list_name in list_by_name:
            print(f"  List exists: {list_name}")
            continue
        r = requests.post(
            f"{BASE}/boards/{board_id}/lists",
            params={**params, "name": list_name, "pos": str(i + 1)},
        )
        if r.status_code != 200:
            print(f"  Failed to create list '{list_name}': {r.text}", file=sys.stderr)
            continue
        new_list = r.json()
        list_by_name[list_name] = new_list
        print(f"  Created list: {list_name}")

    # Get all cards on the board
    r = requests.get(f"{BASE}/boards/{board_id}/cards", params=params)
    if r.status_code != 200:
        print(f"Cards fetch failed: {r.text}", file=sys.stderr)
        return 1
    cards = r.json()
    list_id_to_name = {lst["id"]: lst["name"] for lst in lists}

    # Due date for new tasks (2-day SLA)
    due_date = (datetime.utcnow() + timedelta(days=2)).strftime("%Y-%m-%dT%H:%M:%S.000Z")

    # Process each card
    for card in cards:
        name = card.get("name", "")
        id_list = card.get("idList")
        current_list_name = list_id_to_name.get(id_list, "")

        if name in ARCHIVE_CARD_NAMES:
            r = requests.put(
                f"{BASE}/cards/{card['id']}",
                params=params,
                json={"closed": True},
            )
            if r.status_code == 200:
                print(f"  Archived: {name}")
            else:
                print(f"  Failed to archive '{name}': {r.text}", file=sys.stderr)
            continue

        new_list_name = OLD_TO_NEW_LIST.get(current_list_name)
        if not new_list_name:
            # Unknown list -> Backlog
            new_list_name = "Backlog"
        new_list = list_by_name.get(new_list_name)
        if not new_list or new_list["id"] == id_list:
            continue
        r = requests.put(
            f"{BASE}/cards/{card['id']}",
            params=params,
            json={"idList": new_list["id"]},
        )
        if r.status_code == 200:
            print(f"  Moved to {new_list_name}: {name[:50]}...")
        else:
            print(f"  Failed to move '{name[:40]}': {r.text}", file=sys.stderr)

    # Add agreed-upon task cards (skip if card with same name already exists)
    existing_names = {c.get("name") for c in cards}
    for name, desc, list_name, sla_days in AGREED_TASKS:
        if name in existing_names:
            continue
        target = list_by_name.get(list_name)
        if not target:
            continue
        due = (datetime.utcnow() + timedelta(days=sla_days)).strftime("%Y-%m-%dT%H:%M:%S.000Z")
        r = requests.post(
            f"{BASE}/cards",
            params={
                **params,
                "idList": target["id"],
                "name": name,
                "desc": desc + f"\n\nSLA: {sla_days} day(s). Due: {due[:10]}.",
                "due": due,
                "pos": "bottom",
            },
        )
        if r.status_code == 200:
            print(f"  Added ({list_name}): {name[:50]}...")
        else:
            print(f"  Failed to add '{name[:40]}': {r.text}", file=sys.stderr)

    print("\nDone. Option A lists: Backlog | Week A: Discovery | Week B: Execution | Blocked / Waiting | Done")
    print("If you still see old empty lists (e.g. Idea Backlog, Research, Current Sprint), archive them in Trello.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
