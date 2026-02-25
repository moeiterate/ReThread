# Route Optimizer MVP — Test Plan

**App:** [Route Optimizer - Airport Shuttle Dispatch](https://routeoptimizer-production.up.railway.app/)  
**Purpose:** Find illogical groupings, wrong assignments, and edge-case bugs before wider use.  
**Last automated run:** 2026-02-08

---

## Update for Ahmad

**Tests completed so far:** All of section 1 (Setup & Load Data) — 11 cases: 1.1.1–1.1.3, 1.2.1–1.2.3, 1.3.1–1.3.5. Results are in the tables below.

**Ask (for 1.2 CSV upload tests):** Should I deconstruct the sample data from the app (what loads when you click Sample) into CSVs and use those, or do you have standard/test CSVs you used during development that I could use instead?

---

## How This Works

- Tests marked **PASS** or **BUG** were verified automatically via Playwright (`npm run test:e2e`).
- Tests marked **Manual** need a human to run and verify. Moaz — work through these and log issues using the template at the bottom.
- Screenshots from the automated run are in `e2e/run-screenshots/`.

---

## 1. Setup & Load Data

### 1.1 Sample Data Load

| # | Test | Status | What to check |
|---|------|--------|---------------|
| 1.1.1 | Load all samples | **PASS** | Click Sample for Riders, Drivers, Vehicles. All three show "Loaded". [screenshot](e2e/run-screenshots/111--load-all-sample-data.png) |
| 1.1.2 | Riders only | **PASS** — UX inconsistency | UX for next page isnt blurred, even though it doesnt let you proceed |
| 1.1.3 | Drivers only | **PASS** — UX inconsistency | Load only Drivers (no Riders). Same rule: can't proceed without Riders. But unlike Riders-only, the UI doesn't disable Validate or block progress as clearly. **Improvement:** Show an error toast (e.g. "Add Riders and Vehicles to continue") so users know they can't move forward, consistent with Riders-only behavior. |

### 1.2 CSV Upload Edge Cases

| # | Test | Status | What to check |
|---|------|--------|---------------|
| 1.2.1 | Valid Riders CSV | **FAIL** — Upload CSV button is moot without template or downloadable sample. | Upload a real CSV. Riders appear in summary, no parsing errors. |
| 1.2.2 | Bad/missing dates | **FAIL** — Upload CSV button is moot without template or downloadable sample. | Upload CSV with invalid flight dates. Review shows "Invalid Date" — no silent drops. |
| 1.2.3 | Wrong CSV format | **FAIL** — Upload CSV button is moot without template or downloadable sample. | Upload Drivers CSV as Riders. Should error or reject, not crash. |

### 1.3 Optimization Settings

| # | Test | Status | What to check |
|---|------|--------|---------------|
| 1.3.1 | Defaults are sensible | **PASS** | Buffer 120 min, Max Ride 90 min, Radius 15 mi, Max Stops 3. [screenshot](e2e/run-screenshots/131--default-settings-are-sensible.png) |
| 1.3.2 | Radius = 2 mi | FAILED - optimized route output was the exact same for both 15 and 2 mile radius with sample data | Set Max Cluster Radius to 2. More unassigned or many small routes. No far-apart groupings. |
| 1.3.3 | Radius = 50 mi | PASS | Set Max Cluster Radius to 50. No cross-city groupings when riders aren't time-compatible. |
| 1.3.4 | Max Stops = 1 | PASS | Set Max Stops per Van to 1. Every route has at most 1 stop. |
| 1.3.5 | Max Stops = 8 | PASS | Set Max Stops per Van to 8. No route exceeds 8 stops. |

---

## 2. Review & Confirm

| # | Test | Status | What to check |
|---|------|--------|---------------|
| 2.1.2 | Counts match | Manual | Compare Riders (D/A), Passengers, Bags with the table. Totals match. |
| 2.2.1 | Fleet assignments | Manual | Expand Fleet Assignments. Each driver maps to one van; count makes sense. |
| 2.3.2 | Edit Settings | Manual | Click Edit Settings, change a value, save. Summary updates before optimization. |

---

## 3. Results — Illogical Groupings & Unassigned

### 3.1 Unassigned Riders

| # | Test | Status | What to check |
|---|------|--------|---------------|
| 3.1.1 | Reason for each unassigned | Manual | Open Unassigned Riders. Every rider has a clear Reason (not blank, not "UNKNOWN"). |
| 3.1.2 | No "UNKNOWN" skip reasons | **BUG** | App returns "Skipped by optimizer: UNKNOWN" for some riders with sample data. See [screenshot](e2e/run-screenshots/312--no-unassigned-rider-has-reason-unknown.png). |
| 3.1.3 | Recommendation shown | Manual | Find a rider with a time conflict. "Recommended" suggests a fix (e.g. earlier shift). |
| 3.1.4 | Nobody disappears | Manual | Count: Assigned + Unassigned = total Riders from Review. No one lost. |

### 3.2 Route Logic

| # | Test | Status | What to check |
|---|------|--------|---------------|
| 3.2.1 | DEP vs ARR not mixed | Manual | Open Routes table. No route mixes departures and arrivals illogically. |
| 3.2.2 | Pickup order makes sense | Manual | Pick a DEP route with 2–3 stops. Pickups are geographically sensible. |
| 3.2.3 | Flight time math | Manual | For a DEP rider: Pickup + drive + buffer ≤ Flight time. No one arrives after their flight. |
| 3.2.5 | Cluster radius | Manual | Check addresses on one route. All riders within Max Cluster Radius of each other. |
| 3.2.6 | Max Stops honored | Manual | Check every route. No route has more stops than Max Stops per Van. |
| 3.2.7 | Van capacity | Manual | Compare Pax on each route to van capacity. No overloading. |

### 3.3 Metrics & UI

| # | Test | Status | What to check |
|---|------|--------|---------------|
| 3.3.1 | Metrics consistent | Manual | Note Passengers, Distance, Drive Time, Utilization. Numbers match route data. |
| 3.3.2 | Filters work | Manual | Use Show: All / Departures / Arrivals. Sort by different fields. No duplicates. |
| 3.3.3 | Timeline / Map | Manual | Open Timeline and Map views. Stops and times match Routes table. |

---

## 4. Regression / Sanity

| # | Test | Status | What to check |
|---|------|--------|---------------|
| 4.1 | Full flow reaches Review | **PASS** | Load samples → Validate → "Review & Confirm" appears. [screenshot](e2e/run-screenshots/41--full-flow-reaches-review-step.png) |
| 4.1+ | Full flow reaches Results | **PASS** | Load → Validate → Review → Run Optimization → Results page loads. [screenshot](e2e/run-screenshots/41--full-flow-reaches-results.png) |
| 4.2 | Re-optimize | Manual | From Results, go back, change a setting, run again. New results, no stale data. |
| 4.3 | Fresh reload | Manual | Reload page, same data, same settings. Same results (deterministic). |

---

## Known Bugs

### BUG: "Skipped by optimizer: UNKNOWN" (test 3.1.2)

**Found by:** Automated test  
**Data:** Sample data (default settings)  
**What happens:** After running optimization with sample data, some unassigned riders show "Reason: Skipped by optimizer: UNKNOWN" instead of a meaningful explanation.  
**Expected:** Every unassigned rider should have a specific reason (e.g. "Flight at 07:00 requires 03:36 AM pickup, but earliest driver shift starts at 05:00 AM").  
**Screenshot:** [screenshot](e2e/run-screenshots/312--no-unassigned-rider-has-reason-unknown.png)

---

## Issue Report Template

When you find a problem, include:

```
Test: [e.g. 3.2.3 Flight time math]
Steps: [what you did]
Expected: [what should happen]
Actual: [what happened]
Data: Sample data / custom CSV
Settings: Buffer 120, Max Ride 90, Radius 15, Max Stops 3
Screenshot: [attach if possible]
```

---

*End of test plan. Version 1.0 — Route Optimizer MVP.*
