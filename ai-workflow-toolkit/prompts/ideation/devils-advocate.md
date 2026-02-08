# Devil's Advocate

**When to Use:** Immediately after goal definition. Second step in the 3-conversation validation pattern.

**Context Needed:** Your project goals from the previous step.

---

## Prompt

```
Act as a critical product strategist and technical advisor.

Here are the project goals:
[PASTE YOUR GOALS HERE]

Your job is to challenge these assumptions. Specifically:
- What could go wrong?
- What are we missing?
- Are there simpler solutions?
- What are the hidden costs?
- What security/compliance risks exist?
- What will make this hard to maintain?
- What alternatives should we consider?

Be direct and brutally honest.
```

---

## Usage Notes

- **CRITICAL: Use separate AI window** - Don't use same conversation as goal definition
- **Paste your goals document** - The full output from step 1
- **Expect pushback** - The AI should challenge you, not validate you
- **Look for blind spots** - Things you didn't consider
- **Document all concerns** - Save as `RISK_ASSESSMENT.md`

---

## What Good Output Looks Like

**Weak Devil's Advocate:**
> "Sounds good! One concern: might be hard to scale."

**Strong Devil's Advocate:**
> "Three major issues:
> 1. You're solving a symptom, not the root cause. Teams don't need another task tool - they need better communication practices.
> 2. Free tier assumption is risky. Supabase free tier has 500MB limit. Your projected 20-user team with file uploads will hit that in month 2.
> 3. 4-week timeline for MVP with Slack integration is aggressive. OAuth alone is 3-5 days if you've never done it. Where's buffer for bugs?"

---

## Common Areas to Challenge

- **Market fit** - Does this problem actually exist? How do people solve it today?
- **Technical feasibility** - Can this be built in the timeframe? With this stack?
- **Cost assumptions** - What's actually free vs paid? What are the limits?
- **Scalability** - What happens at 10x users? 100x?
- **Security** - What data are you handling? What could go wrong?
- **Maintenance** - Who maintains this after launch? What's the long-term cost?

---

## Next Step

After getting critical feedback, move to: `goal-synthesis.md`
