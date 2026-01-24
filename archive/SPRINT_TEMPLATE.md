# ReThread Sprint & Trello Template

Use this structure to set up your Trello board. This ensures every idea follows the "Validation First" process.

---

## 📋 Board Structure (Columns)

1.  **💡 Idea Backlog** (Raw ideas, random thoughts)
2.  **🔍 Research (Pre-Sprint)** (Deep dive phase - **NotebookLM required**)
3.  **🏃 Current Sprint (Week 1: Build)** (Building assets for 1 vertical)
4.  **📞 Outreach (Week 2: Sell)** (Active selling)
5.  **⛔ Blocked / Waiting**
6.  **✅ Done / Contracted**

---

## 🔬 Research Protocol (The "ReThread Method")

**Before moving a card from Backlog to Research, create a NotebookLM project.**

### Step 1: Create the "Research Brain" (NotebookLM)
*   **Action:** Create a new Notebook in Google NotebookLM titled `[Vertical] Research` (e.g., "NEMT AZ Research").
*   **Inputs:** Upload 5-10 sources:
    *   Industry Reports (PDFs)
    *   Competitor Pricing Pages (Hudson, etc.)
    *   Regulatory Docs (Access/HIPAA requirements)
    *   Reddit threads from industry operators (r/NEMT, r/smallbusiness)
*   **Output:** Ask NotebookLM: *"What are the top 3 bleeding neck pain points for operators in this space?"* -> Paste result into Trello Card.

### Step 2: AI Lead Identification
*   **Action:** Use AI (Perplexity/ChatGPT) to generate a qualified hit list.
*   **Prompt:** *"Find 20 [Vertical] companies in [Location] that have a website copyright older than 2023 or look outdated. List their names and URLs."*
*   **Validation:** Check for "Hudson" or legacy portal login links on their sites.

### Step 3: The "Legacy Check"
*   Does the target use **Hudson**, **Google Sheets**, or **Paper**?
*   If YES -> **High Priority Target**.
*   If NO (Modern Stack) -> **Archive/Deprioritize**.

---

## 📝 Card Template: "Target Company"

Copy this into the "Description" field of every card in the **Current Sprint** column.

```markdown
### 🎯 Target Profile
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
**Outcome:** [Contract Signed / Pivot]
```

---

## 🏷️ Label System

*   🟢 **Transportation** (Vertical)
*   🔵 **Startups** (Vertical)
*   🟣 **Research** (Task Type)
*   🟠 **Mockup/Build** (Task Type)
*   🔴 **High Priority**

---

## 🔄 Sprint Rituals

### Sprint Planning (Every 2 Weeks - Monday)
1.  Review **Backlog**.
2.  Move top idea to **Research**.
3.  **Validation Gate:** Does the NotebookLM research confirm a "bleeding neck" problem?
    *   **YES:** Move to **Current Sprint**.
    *   **NO:** Archive card.

### Sprint Review (Every 2 Weeks - Friday)
1.  Review **Outreach** column results.
2.  **Decision:**
    *   **Pivot:** If 0 traction, pick new vertical from Backlog.
    *   **Persevere:** If warm leads exist, extend sprint for closing.
