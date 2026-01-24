# Pre-Sprint Action Plan
## Focus: Define Org & Sprint Strategy (Before Monday)

---

## 🎯 TIER 1: ORG FOUNDATION (Completed)

### 1. Branding & Identity
- [x] **Decide on company name**
  - [x] Rethread is confirmed
  - [x] Check for conflicts (Assumed clean for now)
  
- [x] **Write mission statement**
  - [x] "We identify fragmented workflows in mid-market organizations and re-thread them into seamless, data-driven systems."
  - [x] Refined for Enterprise audience

- [x] **Create ONE landing page**
  - [x] `internal_plan.html` created as the strategy document/landing page hybrid
  - [x] Defined "Weaving Strategy Into Software" messaging
  - [x] Implemented "No-Card" Enterprise aesthetic

### 2. Positioning & Pricing
- [x] **Define service tiers**
  - [x] Enterprise consulting focus ($200-300/hr equivalent impact)
  - [x] Mid-market focus ($1M+ revenue)
  
- [x] **Value proposition**
  - [x] "Consulting, Not Coding"
  - [x] "Validate, Then Build"
  - [x] "Data Over Intuition"

---

## 📋 TIER 2: SPRINT PROCESS (In Progress)

### 3. Sprint Cadence Definition
- [x] **Define 2-Week Cycle**
  - [x] Week 1: Target & Build
  - [x] Week 2: Outreach & Execution
  - [x] Friday Wk 2: Retro & Pivot Decision

### 4. Communication System Setup
- [x] **Create Trello board setup script**
  - [x] Script created: `setup_trello.py`
  - [x] Uses structure from `SPRINT_TEMPLATE.md`
  - [ ] **ACTION NEEDED:** Run `python setup_trello.py` to create board
  
- [x] **Create Sprint Item Template**
  - [x] Created `SPRINT_TEMPLATE.md` with Card structure
  - [x] Includes: Target Profile, Hypothesis, Checklist, Results

- [x] **Define Daily Standup Format**
  - [x] Setup script created: `setup_slack.py`
  - [x] Channel structure defined: `#standup`, `#leads`, `#sprint-planning`, `#research`
  - [ ] **ACTION NEEDED:** Run `python setup_slack.py` to create channels

### 5. Workflow Rules
- [x] **Document "No Build Until Paid"**
  - [x] Added to Internal Plan tenets
  
- [x] **Define Validation Process**
  - [x] Intake -> Research -> Build -> Outreach -> Review logic documented

---

## 🔍 TIER 3: TRANSPORTATION RESEARCH (Next Up)

### 6. Market Segmentation
- [x] **Map three verticals** (Table created)
  - [x] NEMT (High complexity, Deep knowledge)
  - [x] Airport Shuttles (Medium complexity, Medium knowledge)
  - [x] Fixed Route (Low complexity, Low knowledge)

| Vertical | Complexity | Your Knowledge | Key Players | Software Used |
|---------|-----------|----------------|-------------|---------------|
| **NEMT** | High | Deep (Routo) | Access providers | Custom/Access |
| **Airport Shuttles** | Medium | Medium (Dad) | Groom, AZ Shuttle | Hudson |
| **Fixed Route** | Low | Low (Cousin) | Ahmad's Cousin | Hudson |

### 7. Research Questions to Answer
- [ ] **Identify Market Size**
  - [ ] How many transportation companies in Pima County?
- [ ] **Software Intelligence**
  - [ ] Confirm Hudson usage & pain points
  - [ ] Identify other legacy competitors
- [ ] **Pain Point Mapping**
  - [ ] Route optimization costs (hours/$$)
  - [ ] Dispatch coordination friction
  - [ ] Gas card/spend management
  - [ ] Claim denials (NEMT)

### 8. Research Tools Setup
- [ ] **Create NotebookLM notebook**
  - [ ] "Transportation Industry Research"
  - [ ] Ingest industry reports/articles
  
- [ ] **Build/adapt scraper** (Optional)
  - [ ] Identify Hudson client list via URL patterns?

### 9. Target List (Goal: 10 companies)
- [ ] NEMT companies
- [ ] Airport shuttle services
- [ ] Fixed route operators
- [ ] Medical couriers

---

## 🎯 TIER 4: WARM LEADS (Sunday)

### 10. Immediate Contacts
- [ ] **Contact Your Dad**
  - [ ] Ask about Groom (Arizona Shuttle) contact
  - [ ] Ask about NEMT WhatsApp group struggles
  
- [ ] **Contact Roger (Therapist)**
  - [ ] Pitch book app idea?
  - [ ] Pitch therapy homework app?
  
- [ ] **Ahmad Contacts Cousin**
  - [ ] Get details on Hudson software pain points

---

## 🛠️ TIER 5: ASSETS PREPARATION (Sunday)

### 11. Routo Generalization
- [ ] **Assess Codebase**
  - [ ] Identify reusable modules (Trip tracking, Dispatch)
  - [ ] Strip NEMT-specific logic for generic demo
  
### 12. Demo Factory Process
- [ ] **Create 3 Transportation Mockups**
  - [ ] Airport Shuttle (Route Opt focus)
  - [ ] Fixed Route (Dispatch focus)
  - [ ] Generic Dashboard

---

## ⏰ TIME ALLOCATION (Now → Monday)

- **Completed:** Tier 1 (Org Foundation) & Tier 2 Strategy
- **Saturday Focus:** Tier 3 (Research) & Tier 2 (Trello Setup)
- **Sunday Focus:** Tier 4 (Leads) & Tier 5 (Assets)
- **Monday AM:** Sprint 1 Kickoff with Ahmad

---

## 📊 SUCCESS METRICS (By Monday)

- [x] Company name & Brand defined
- [x] Strategy/Plan page live
- [x] Sprint process documented
- [ ] **Trello board operational** (Script ready, needs execution)
- [ ] **Slack channels operational** (Script ready, needs execution)
- [ ] 10 transportation companies identified
- [ ] 3 mockups ready
- [ ] 2 warm leads contacted
