import requests
import sys
import os

def setup_slack():
    print("🚀 ReThread Slack Setup")
    print("-----------------------")

    # Get token from environment variable or user input
    token = os.getenv("SLACK_TOKEN") or input("Enter your Slack token: ").strip()
    
    base_url = "https://slack.com/api"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    # Channels to create with topics
    channels = [
        {"name": "standup", "topic": "Daily: Yesterday, Today, Blockers. Keep it async."},
        {"name": "leads", "topic": "Target tracking, cold outreach results, and pipeline updates."},
        {"name": "sprint-planning", "topic": "Bi-weekly prioritization, validation gates, and retro."},
        {"name": "research", "topic": "NotebookLM insights, market data, and industry reports."}
    ]

    for ch in channels:
        print(f"\nCreating #{ch['name']}...")
        
        # 1. Create Channel
        create_resp = requests.post(
            f"{base_url}/conversations.create",
            headers=headers,
            json={"name": ch['name']}
        )
        
        create_data = create_resp.json()
        
        if not create_data.get("ok"):
            error = create_data.get("error")
            if error == "name_taken":
                print(f"  ⚠️ Channel #{ch['name']} already exists. Updating topic...")
                # We need the ID if it exists, but create doesn't return it on error.
                # Simplification: We'll skip topic update if it exists for this script version
                # or we'd need to list channels to find it.
                continue
            else:
                print(f"  ❌ Error: {error}")
                continue
        
        channel_id = create_data["channel"]["id"]
        print(f"  ✅ Created! (ID: {channel_id})")

        # 2. Set Topic
        topic_resp = requests.post(
            f"{base_url}/conversations.setTopic",
            headers=headers,
            json={"channel": channel_id, "topic": ch['topic']}
        )
        
        if topic_resp.json().get("ok"):
            print(f"  ✅ Topic set: '{ch['topic']}'")
        else:
            print(f"  ⚠️ Failed to set topic: {topic_resp.json().get('error')}")

    print("\n🎉 Slack setup complete!")

if __name__ == "__main__":
    setup_slack()