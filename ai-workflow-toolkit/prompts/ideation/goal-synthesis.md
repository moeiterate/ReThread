# Goal Synthesis

**When to Use:** After completing both goal definition and devil's advocate. Final step in the 3-conversation validation pattern.

**Context Needed:** Your project goals AND the devil's advocate critique.

---

## Prompt

```
Given these project goals:
[PASTE YOUR GOAL DEFINITION HERE]

And these concerns/risks:
[PASTE YOUR DEVIL'S ADVOCATE CRITIQUE HERE]

Help me synthesize a balanced approach that:
1. Addresses the critical risks
2. Maintains core value proposition
3. Defines realistic MVP scope
4. Identifies must-have vs nice-to-have features
5. Acknowledges known trade-offs

Provide a final specification document that balances ambition with pragmatism.
```

---

## Usage Notes

- **Can use original goal conversation** - Or create a third window
- **Paste BOTH documents** - Goals and critique in full
- **Make decisions** - This is where you commit to scope
- **Document trade-offs** - Be explicit about what you're NOT doing and why
- **Output is your spec** - Save as `PROJECT_SPEC.md` and use for all future work

---

## What Good Output Looks Like

**Example Synthesis:**

> **MVP Scope (4 weeks):**
> - Basic task CRUD (must-have)
> - Slack notifications for @mentions only (must-have, scoped down from full integration)
> - Simple kanban view (must-have)
> 
> **Explicitly Out of Scope for MVP:**
> - File uploads (deferred to v2, addresses storage limit concern)
> - Advanced Slack OAuth (using webhook instead, simpler)
> - Mobile app (web-first, mobile-responsive)
> 
> **Known Trade-offs:**
> - Webhook approach means less rich Slack integration, but gets us to launch faster
> - No file uploads limits use cases, but avoids storage costs and complexity
> 
> **Risk Mitigation:**
> - Storage: Starting with local dev DB, moving to Supabase only after MVP validation
> - Timeline: Built-in 1-week buffer by removing file uploads
> - Market fit: Will validate with 5 beta users before broader launch

---

## Decision Framework

Good synthesis should answer:
- ✅ **What are we building?** (concrete scope)
- ✅ **What are we NOT building?** (explicit exclusions)
- ✅ **Why these choices?** (addressed concerns)
- ✅ **What could still go wrong?** (acknowledged risks)
- ✅ **How will we know if it's working?** (success metrics)

---

## Next Step

After finalizing spec, move to: `../architecture/architecture-planning.md`
