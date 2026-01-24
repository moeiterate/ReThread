import requests
import json
import sys

def setup_trello_board():
    print("🚀 ReThread Trello Board Setup")
    print("--------------------------------")
    
    # 1. Get Credentials
    api_key = input("Enter your Trello API Key: ").strip()
    token = input("Enter your Trello Token: ").strip()
    
    if not api_key or not token:
        print("❌ Error: API Key and Token are required.")
        return

    base_url = "https://api.trello.com/1"
    auth_params = {
        'key': api_key,
        'token': token
    }

    # 1.5 Get Workspaces
    print("\nFetching your workspaces...")
    members_response = requests.get(f"{base_url}/members/me/organizations", params=auth_params)
    
    if members_response.status_code != 200:
        print(f"❌ Failed to fetch workspaces: {members_response.text}")
        return

    workspaces = members_response.json()
    print("\nSelect a Workspace:")
    for idx, ws in enumerate(workspaces):
        print(f"[{idx}] {ws['displayName']} (ID: {ws['id']})")
    
    ws_index = input("\nEnter workspace number (or press Enter for default): ").strip()
    
    organization_id = None
    if ws_index.isdigit() and int(ws_index) < len(workspaces):
        organization_id = workspaces[int(ws_index)]['id']
        print(f"✅ Selected: {workspaces[int(ws_index)]['displayName']}")
    else:
        print("⚠️ No workspace selected. Creating in default personal workspace.")

    # 2. Create Board
    board_name = "ReThread Sprint Board"
    print(f"\nCreating board '{board_name}'...")
    
    create_params = {**auth_params, 'name': board_name, 'defaultLists': 'false'}
    if organization_id:
        create_params['idOrganization'] = organization_id

    response = requests.post(
        f"{base_url}/boards/",
        params=create_params
    )
    
    if response.status_code != 200:
        print(f"❌ Failed to create board: {response.text}")
        return
        
    board_data = response.json()
    board_id = board_data['id']
    print(f"✅ Board created! (ID: {board_id})")

    # 3. Create Columns (Lists)
    columns = [
        "💡 Idea Backlog",
        "🔍 Research (Pre-Sprint)",
        "🏃 Current Sprint (Week 1: Build)",
        "📞 Outreach (Week 2: Sell)",
        "⛔ Blocked / Waiting",
        "✅ Done / Contracted"
    ]

    print("\nCreating columns...")
    for col_name in columns:
        requests.post(
            f"{base_url}/boards/{board_id}/lists",
            params={**auth_params, 'name': col_name, 'pos': 'bottom'}
        )
        print(f"  - Created: {col_name}")

    # 4. Create Labels
    labels = [
        {"name": "Transportation", "color": "green"},
        {"name": "Startups", "color": "blue"},
        {"name": "Research", "color": "purple"},
        {"name": "Mockup/Build", "color": "orange"},
        {"name": "High Priority", "color": "red"}
    ]

    print("\nCreating labels...")
    for label in labels:
        requests.post(
            f"{base_url}/boards/{board_id}/labels",
            params={**auth_params, 'name': label['name'], 'color': label['color']}
        )
        print(f"  - Label: {label['name']}")

    # 5. Create Template Card
    # Find the "Idea Backlog" list ID to put the template in
    lists_response = requests.get(f"{base_url}/boards/{board_id}/lists", params=auth_params)
    lists_data = lists_response.json()
    backlog_id = next((l['id'] for l in lists_data if "Backlog" in l['name']), None)

    if backlog_id:
        print("\nCreating template card...")
        
        # Updated Template from SPRINT_TEMPLATE.md
        card_desc = """### 🎯 Target Profile
**Company:** [Name]
**Contact:** [Name/Role] (e.g., Owner, Dispatch Manager)
**Source:** [Dad / Upwork / Cold Search]
**Legacy Tech:** [Hudson / Sheets / Unknown]

### 🧠 Research Insights (Link: [NotebookLM URL])
*   **Pain Point 1:** [e.g., "Drivers stealing gas"]
*   **Pain Point 2:** [e.g., "Dispatch takes 4hrs/day"]

### 🧪 Hypothesis
**Problem:** [Specific problem derived from research]
**Proposed Solution:** [e.g., "Custom Route Optimization Dashboard"]
**Est. Value:** [e.g., "Save $2k/mo in labor"]

### 🛠️ Execution Checklist
- [ ] **Research:** NotebookLM Brain created & sources added
- [ ] **Validation:** Confirmed legacy software usage
- [ ] **Asset:** Screenshot current site
- [ ] **Asset:** Build "ReThreaded" Mockup (Link: [Figma/HTML])
- [ ] **Outreach:** Draft cold email/script using Research Insights
- [ ] **Outreach:** Send message
- [ ] **Follow-up:** Day 3

### 📊 Results
**Response:** [Positive / Negative / Ghosted]
**Feedback:** [Notes from call]
**Outcome:** [Contract Signed / Pivot]"""

        requests.post(
            f"{base_url}/cards",
            params={
                **auth_params,
                'idList': backlog_id,
                'name': 'TEMPLATE: Copy This Card',
                'desc': card_desc,
                'pos': 'top'
            }
        )
        print("✅ Template card created in Backlog")

    print(f"\n🎉 Success! Your board is ready at: {board_data['url']}")

if __name__ == "__main__":
    setup_trello_board()