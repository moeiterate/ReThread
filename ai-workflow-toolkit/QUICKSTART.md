# Quick Setup Guide

Get started with the AI Workflow Toolkit in 5 minutes.

---

## 🎯 What You'll Learn

How to use this toolkit to:
1. Validate ideas before building (save days of wasted work)
2. Plan systematically (prevent scope creep)
3. Implement with quality checks (ship faster with fewer bugs)

---

## 📋 Prerequisites

- An AI assistant (Claude, ChatGPT, Gemini, etc.)
- A code editor (Cursor recommended for planning mode)
- A project idea

---

## 🚀 5-Minute Start

### Step 1: Clone or Download

```bash
# Clone the repo
git clone https://github.com/yourusername/ai-workflow-toolkit.git

# Or just browse on GitHub and copy-paste prompts as needed
```

### Step 2: Start a New Project

Open three AI conversation windows:

**Window 1: Goal Definition**
```
Copy prompt from: prompts/ideation/goal-definition.md
Paste into AI, fill in your project idea
Save output as PROJECT_GOALS.md
```

**Window 2: Devil's Advocate**
```
Copy prompt from: prompts/ideation/devils-advocate.md
Paste your goals from Window 1
Save critique as RISK_ASSESSMENT.md
```

**Window 3: Synthesis**
```
Copy prompt from: prompts/ideation/goal-synthesis.md
Paste both goals AND critique
Save final spec as PROJECT_SPEC.md
```

### Step 3: Plan Architecture

```
Copy prompt from: prompts/architecture/architecture-planning.md
Use in Cursor planning mode (or regular AI conversation)
Save output as ARCHITECTURE.md
```

### Step 4: Choose Implementation Template

Based on your project complexity:

**High control needed? (new tech, compliance, high risk)**
```
Copy: templates/step-by-step-implementation.md
Customize with your phases
One substep at a time, lint after each
```

**Balanced approach? (familiar tech, medium complexity)**
```
Copy: templates/phase-by-phase-implementation.md
Customize with your phases
Complete phases at once, test after each
```

### Step 5: Build

Follow your implementation plan. Use phase-specific prompts as needed:
- Design polish → `prompts/design/ux-deai-ification.md`
- Security audit → `prompts/security/security-audit-phase0.md`

---

## 📂 Typical Project Structure

After going through the workflow, you'll have:

```
your-project/
├── PROJECT_GOALS.md           # From goal definition
├── RISK_ASSESSMENT.md         # From devil's advocate
├── PROJECT_SPEC.md            # From synthesis
├── ARCHITECTURE.md            # From architecture planning
├── IMPLEMENTATION_PLAN.md     # Customized from template
├── src/                       # Your code
└── SECURITY.md                # From security audit
```

---

## 🎓 Real Example

Let's say you want to build a "Habit Tracker App":

### 1. Goal Definition (5 min)
```
Output: "Build habit tracker for people who've failed with other apps.
Core problem: Existing apps are overwhelming (too many features).
Success: 60% of users track 1+ habit for 30 days.
MVP: Track 3 habits max, simple checkbox interface, streak counter.
Timeline: 3 weeks. Budget: $0 (free tiers)."
```

### 2. Devil's Advocate (5 min)
```
Output: "Why another habit tracker? Market is saturated.
Main concern: Free tier limitations (Supabase 500MB, Vercel 100GB bandwidth).
Risk: You're assuming people fail because apps are complex. Maybe they fail because habits are hard?
Alternative: Start with paper prototype, validate before coding."
```

### 3. Synthesis (5 min)
```
Output: "MVP revised: 1 habit only (not 3), manual logging (no notifications),
7-day streak focus (not 30-day). Addresses complexity concern, avoids notification infra.
Validate with 10 users on paper first (addresses motivation concern).
If validated, then build web app."
```

**Result:** Saved 1-2 weeks by validating on paper first. Scope cut from 3 habits to 1. Clear success criteria.

---

## 💡 Tips for Success

### Do's
✅ **Follow the order** - Don't skip devil's advocate
✅ **Use separate windows** - Prevents confirmation bias
✅ **Be specific** - "Next.js 14" not "web app"
✅ **Document everything** - You'll forget your reasoning in 2 weeks
✅ **Customize prompts** - Replace [PLACEHOLDERS] with your specifics

### Don'ts
❌ **Don't skip validation** - You'll build the wrong thing
❌ **Don't use same AI window** - Devil's advocate needs fresh context
❌ **Don't over-engineer** - Start simple, add complexity only when needed
❌ **Don't ignore the critique** - Devil's advocate is supposed to challenge you
❌ **Don't launch without security audit** - Especially if handling user data

---

## 🆘 Troubleshooting

**Q: AI isn't being critical enough in devil's advocate**
A: Add to prompt: "Be brutally honest. Assume I'm wrong. What would make this fail?"

**Q: Getting overwhelmed by all the prompts**
A: Start with just the 3-conversation pattern (ideation). Skip the rest until you need them.

**Q: My project is different, these prompts don't apply**
A: All prompts are templates. Customize them. Remove what doesn't apply. Add what's missing.

**Q: Do I need to use all the prompts?**
A: No. Use what helps. Skip what doesn't. The 3-conversation pattern is the core value.

---

## 🔄 What's Next

After your first project:
1. Note what worked / didn't work
2. Customize prompts for your workflow
3. Add your own prompts to the toolkit
4. Share back via PR (optional but appreciated)

---

## 📚 Further Reading

- `WORKFLOW.md` - Detailed process explanation
- `docs/common-pitfalls.md` - Mistakes we've made so you don't have to
- `docs/adaptation-guide.md` - Customize for your team/context
- `examples/` - Real projects built with this workflow

---

**Ready to start?** Pick a project idea and open `prompts/ideation/goal-definition.md` 🚀
