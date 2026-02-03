#!/usr/bin/env python3
"""
Add ReThread Week of Feb 3 cards to an existing Trello board.
Uses Trello API; requires TRELLO_API_KEY and TRELLO_TOKEN (or prompts).
Board: ReThread Sprint Board (shortLink m47dQixP).
Target list: To Do (override with TRELLO_LIST_NAME if your list has another name).
"""
import os
import requests

BASE = "https://api.trello.com/1"
BOARD_SHORT_ID = "m47dQixP"
TARGET_LIST_NAME = os.environ.get("TRELLO_LIST_NAME", "To Do")

# Card title (no numbers), labels, description, checklist name -> items
CARDS = [
    {
        "name": "Demo Route Optimizer to Cousin",
        "labels": ["Ahmad", "High Priority"],
        "desc": """Schedule 30-min screen share with cousin
Use his actual booking data (get sample CSV beforehand)
Capture feedback: What's missing? What's confusing? What would make him use this daily?
Document his tech stack specifics (Geotab, Hudson, Fleetio, +1 more)""",
        "checklist": [
            "Schedule call",
            "Get sample CSV from cousin",
            "Run demo",
            "Write up feedback notes in Trello comments",
        ],
    },
    {
        "name": "MVP Polish + Google Maps Integration",
        "labels": ["Moaz", "High Priority"],
        "desc": """Implement "Open in Google Maps" button with optimized waypoints
Add "Copy Link" for sending to drivers
Test full flow on mobile (link → Google Maps app → navigation)
Deploy to Vercel with shareable URL""",
        "checklist": [
            "Google Maps URL generation working",
            "Copy link + toast working",
            "Tested on mobile",
            "Deployed to Vercel",
            "Share link with Ahmad",
        ],
    },
    {
        "name": "Research Geotab + Fleetio APIs",
        "labels": ["Ahmad", "Research"],
        "desc": """Cousin's company uses Geotab, Hudson, Fleetio — none talk to each other
Investigate API access and what data we can pull
Check if there's a marketplace/partner program opportunity""",
        "checklist": [
            "Geotab developer signup + API docs review",
            "Fleetio API docs review",
            "Hudson — find out what this actually is (dispatch software?)",
            "Write up: what can we connect, level of effort, marketplace opportunity?",
        ],
    },
    {
        "name": "Explore Make.com Integration Partner Program",
        "labels": ["Moaz", "Research"],
        "desc": """Make.com has virtually zero transportation connectors — potential gap
Research their partner/creator program requirements
Identify 2-3 transportation platforms with APIs but no Make connector""",
        "checklist": [
            "Review Make.com partner docs",
            "List transportation platforms with APIs (Limo Anywhere, Tobi Cloud, Samsara, etc.)",
            "Check which ones already have Make connectors",
            "Draft one-pager on opportunity",
        ],
    },
    {
        "name": "Scan Upwork/Fiverr for Transportation Automation Jobs",
        "labels": ["Moaz", "Research"],
        "desc": """Find what people are actually paying for today
Search terms: "QuickBooks transportation", "fleet automation", "route optimization", "dispatch software integration"
Document patterns in buyer language and budgets""",
        "checklist": [
            "Find 10-15 relevant job postings",
            "Log in spreadsheet: job title, description snippet, budget, platform",
            "Identify top 3 patterns/themes",
            "Share findings in Slack",
        ],
    },
    {
        "name": "Draft Reservations Workflow Discovery Questions",
        "labels": ["Ahmad", "Discovery"],
        "desc": """Cousin said reservations + dispatch multitasking is the #1 bleed area
Before building anything, we need to understand the current workflow
Prep questions for next call with cousin""",
        "checklist": [
            "How do bookings come in? (phone, email, web, broker?)",
            "What system are they entered into?",
            "What's the handoff from reservation to dispatch?",
            "Where do things fall through the cracks?",
            'What does "losing bookings" look like?',
        ],
    },
    {
        "name": "Weekly Sync - Wed/Thu",
        "labels": ["Moaz", "Ahmad", "Recurring"],
        "desc": """Mid-week check-in to share progress and unblock
15-30 min max""",
        "checklist": ["Schedule time"],
    },
    {
        "name": "QuickBooks API Proof of Concept",
        "labels": ["Moaz", "Build", "High Priority"],
        "desc": """Build minimal POC proving we can read/write to QuickBooks Online.
Unlocks accounting integration play across all verticals.""",
        "checklist": [
            "QB Developer account + sandbox",
            "Create app + OAuth credentials",
            "Pull customers list",
            "Pull invoices list",
            "Create test invoice from trip data",
            "Document flow + gotchas",
            "Estimate LOE for full integration",
        ],
    },
]

# Label name -> Trello color (for creating missing labels)
LABEL_COLORS = {
    "Ahmad": "blue",
    "Moaz": "sky",
    "High Priority": "red",
    "Research": "purple",
    "Recurring": "green",
    "Discovery": "lime",
    "Build": "orange",
}


def main():
    key = os.environ.get("TRELLO_API_KEY", "").strip() or input("Trello API Key: ").strip()
    token = os.environ.get("TRELLO_TOKEN", "").strip() or input("Trello Token: ").strip()
    if not key or not token:
        print("Need TRELLO_API_KEY and TRELLO_TOKEN.")
        return 1
    params = {"key": key, "token": token}

    # Resolve board
    r = requests.get(f"{BASE}/boards/{BOARD_SHORT_ID}", params=params)
    if r.status_code != 200:
        print(f"Board not found: {r.text}")
        return 1
    board_id = r.json()["id"]

    # Get lists, find To Do
    r = requests.get(f"{BASE}/boards/{board_id}/lists", params=params)
    if r.status_code != 200:
        print(f"Lists failed: {r.text}")
        return 1
    lists = r.json()
    todo_list = next((lst for lst in lists if lst["name"].strip() == TARGET_LIST_NAME), None)
    if not todo_list:
        names = [lst["name"] for lst in lists]
        print(f"No list named '{TARGET_LIST_NAME}'. Existing: {names}")
        return 1
    list_id = todo_list["id"]

    # Get or create labels
    r = requests.get(f"{BASE}/boards/{board_id}/labels", params=params)
    if r.status_code != 200:
        print(f"Labels failed: {r.text}")
        return 1
    by_name = {lb["name"]: lb["id"] for lb in r.json() if lb.get("name")}
    needed = set()
    for card in CARDS:
        needed.update(card["labels"])
    for name in needed:
        if name in by_name:
            continue
        color = LABEL_COLORS.get(name, "gray")
        cr = requests.post(
            f"{BASE}/boards/{board_id}/labels",
            params={**params, "name": name, "color": color},
        )
        if cr.status_code == 200:
            by_name[name] = cr.json()["id"]
        else:
            print(f"Warning: could not create label '{name}': {cr.text}")

    # Create cards
    for card in CARDS:
        id_labels = [by_name[l] for l in card["labels"] if l in by_name]
        card_params = {
            **params,
            "idList": list_id,
            "name": card["name"],
            "desc": card["desc"],
            "pos": "bottom",
        }
        if id_labels:
            card_params["idLabels"] = ",".join(id_labels)
        cr = requests.post(f"{BASE}/cards", params=card_params)
        if cr.status_code != 200:
            print(f"Failed to create card '{card['name']}': {cr.text}")
            continue
        card_id = cr.json()["id"]
        if card.get("checklist"):
            cl = requests.post(
                f"{BASE}/checklists",
                params={**params, "idCard": card_id, "name": "Checklist"},
            )
            if cl.status_code == 200:
                cl_id = cl.json()["id"]
                for item in card["checklist"]:
                    requests.post(
                        f"{BASE}/checklists/{cl_id}/checkItems",
                        params=params,
                        json={"name": item},
                    )
        print(f"  Created: {card['name']}")
    print("Done.")
    return 0


if __name__ == "__main__":
    exit(main())
