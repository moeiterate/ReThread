# Goal Definition

**When to Use:** Starting a new project or feature. First step in the 3-conversation validation pattern.

**Context Needed:** General concept or problem you want to solve. Business constraints (budget, timeline).

---

## Prompt

```
I want to build [GENERAL CONCEPT]. Help me define:

1. The core problem this solves
2. Who the primary users are
3. What success looks like (measurable metrics)
4. Key technical requirements or constraints
5. Budget and timeline considerations

Be specific and challenge vague requirements.
```

---

## Usage Notes

- **Use in dedicated AI conversation** - Don't mix with other tasks
- **Be specific about constraints** - Budget, timeline, team size, tech limitations
- **Challenge vague requirements** - If you say "user-friendly", AI should ask what that means
- **Output should be concrete** - Save as `PROJECT_GOALS.md` for next step

---

## What Good Output Looks Like

**Bad (too vague):**
> "Build a task management app for teams"

**Good (specific):**
> "Build a task management app for remote teams of 5-20 people who struggle with async communication. Success = 80% of tasks have clear owners and deadlines within first week. Must integrate with Slack. Budget: $0 (using free tiers). Timeline: 4 weeks to MVP."

---

## Next Step

After getting clear goals, move to: `devils-advocate.md`
