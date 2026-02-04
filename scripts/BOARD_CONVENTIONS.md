# ReThread Sprint Board – Conventions

## What this does for your existing board

1. **Admin tasks in their own vertical** – Run `add_admin_list_and_move_setup_cards.py` once. It creates the **Admin / Setup** list and moves setup-style cards (landing page, social, content pipeline, case studies, website, etc.) out of Week A and Week B into that column. Everything left in Week A / Week B is phase or discovery/execution work.

2. **Placeholder tasks** – Run `add_phase_placeholders.py` to add the 8 phase cards (1. Hypothesis Research … 8. Knowledge Freeze) into Week A and Week B with the same checklists as the Sprints tab and leads assigned. You then mark those placeholders complete or not as you go.

3. **Color-code by focus (e.g. Transportation)** – Run `add_transportation_label.py` to create a **Transportation** label (if missing) and add it to every card that is **not** in Admin / Setup. So: Backlog, Week A, Week B, Blocked, and Done cards get the Transportation tag; Admin / Setup cards stay untagged (or use other labels). Lets you filter and see sprint/transportation work at a glance.

## List layout

| List | Purpose |
|------|--------|
| **Backlog** | Ideas, kill items (with 1–2 sentence doc), and work not yet pulled into this cycle. |
| **Admin / Setup** | Operational tasks: landing page, social media, content pipeline, case studies, website, branding. Not phase deliverables. |
| **Week A: Discovery** | Phase 1–3 work only: Hypothesis Research, Public Research Share, Validation (and decision gate). |
| **Week B: Execution** | Phase 4–8 work only: Problem Lock & Design → Build → Release → Commercial → Knowledge Freeze. |
| **Blocked / Waiting** | Anything blocked or waiting on someone else. |
| **Done** | Completed this cycle. |

## What goes where

- **Week A / Week B** = work that is part of the 8-phase sprint (discovery then execution). One problem/idea per cycle; cards here are phase deliverables.
- **Admin / Setup** = tasks you need to track but that aren’t “Phase 2” or “Phase 5”. Run `add_admin_list_and_move_setup_cards.py` once to create the list and move existing setup-style cards.

## Handling Admin / Setup in the immediate

Admin tasks (client-facing website, case studies/portfolio, landing page, social media, content pipeline, etc.) are **real work with owners and due dates**—not “someday” items.

**How to run them:**

1. **Assign an owner** to every Admin / Setup card. One person is responsible for that task.
2. **Set a due date** on each card (e.g. 1–2 day SLA from when it’s pulled, or a fixed date like “by Friday”). Use Trello’s due date so it’s visible and you can track slippage.
3. **Work on them in parallel with phase work.** Phase work (Week A / Week B) is the sprint; Admin / Setup is operational. In the same cycle, e.g. Ahmad might own “Validation” in Week A while Moaz owns “Landing page” and “Social media setup” in Admin / Setup. Both get done in the same 2 weeks.
4. **Treat Admin / Setup like active work:** top card(s) or an **In progress** label so it’s clear what’s being worked on now. When a task is done, move it to **Done**.
5. **Priority rule:** Phase work (Week A/B) takes precedence for the *sprint* outcome, but admin tasks have due dates so they don’t slip. If someone has capacity, they pull from Admin / Setup; if phase work is blocked, use that time for admin.

**Example for this cycle:**  
“Client-facing website” (Ahmad, due Feb 7), “Case studies/portfolio” (Moaz/Ahmad, due Feb 8), “Landing page” (Ahmad, due Feb 6), “Social media” (Moaz, due Feb 5). Assign and date them; move to Done when complete. No need to put them in Week A or Week B—they live in Admin / Setup until done.

## In progress

- **Convention:** Top card in Week A = current discovery focus; top card in Week B = current execution focus. Move the active card to the top.
- **Optional:** Create a label **In progress** and put it on 1–2 cards so it’s obvious what’s active.

## Next cycle (same board)

1. When the cycle ends, leave completed work in **Done** (or archive the list / cards if you want a clean slate).
2. **Refill Week A** from Backlog: create or move cards for the next cycle’s Phase 1–3 (e.g. “Hypothesis Research: [segment]”, “Validation: triage for [problem]”). Assign owners.
3. **Week B** gets Phase 4–8 work once you’ve locked the problem (or add placeholders and fill as you go).
4. No new board; same board, new cards from Backlog. Optionally use a cycle-prep script to create phase cards from templates.

## Scripts

- `add_admin_list_and_move_setup_cards.py` – Adds **Admin / Setup** and moves setup-style cards out of Week A/B.
- `add_phase_placeholders.py` – Creates phase placeholder cards in Week A and Week B with the same checklists as the Sprints tab; assigns **Week A lead (Moaz)** to phases 1–3 and **Week B lead (Ahmad)** to phases 4–8. Add to `secrets.json` under `trello`: `"member_username_moaz": "your_trello_username"`, `"member_username_ahmad": "ahmadtaleb"`.
- `add_transportation_label.py` – Creates a **Transportation** label (green) if missing and adds it to every card **not** in Admin / Setup so you can color-code sprint/transportation work.
- `restructure_sprint_board.py` – One-time restructure to Option A + agreed tasks.
- `create_sprint_board.py` – Creates a new board from `sprint_process.json` (playbook-style).
