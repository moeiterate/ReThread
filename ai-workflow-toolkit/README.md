# AI Workflow Toolkit

**A systematic approach to building production-ready software with AI assistance**

This repository contains battle-tested prompts, templates, and workflows for AI-assisted development. Built from real projects, refined through practice.

---

## 🎯 What This Is

A collection of **reusable prompts** and **structured workflows** that help you:
- Validate ideas before building (parallel AI conversations)
- Plan architecture systematically (Cursor planning mode)
- Implement with clear phases and acceptance criteria
- Polish design beyond generic AI aesthetics
- Audit security comprehensively
- Document and deploy professionally

**Not a framework. Not a tool. Just proven patterns you can copy-paste and customize.**

---

## 🚀 Quick Start

### 1. Starting a New Project

```bash
# Use the 3-conversation validation pattern
1. Goal Definition → prompts/ideation/goal-definition.md
2. Devil's Advocate → prompts/ideation/devils-advocate.md
3. Goal Synthesis → prompts/ideation/goal-synthesis.md
```

### 2. Planning Implementation

```bash
# Choose your template based on project complexity
- High control needed? → templates/step-by-step-implementation.md
- Balanced approach? → templates/phase-by-phase-implementation.md
```

### 3. Building

Follow your implementation plan, using phase-specific prompts:
- Architecture → `prompts/architecture/`
- Design → `prompts/design/`
- Security → `prompts/security/`

---

## 📁 Repository Structure

```
ai-workflow-toolkit/
├── README.md                          # This file
├── WORKFLOW.md                        # Complete process guide
├── prompts/                           # Copy-paste ready prompts
│   ├── ideation/
│   │   ├── goal-definition.md
│   │   ├── devils-advocate.md
│   │   └── goal-synthesis.md
│   ├── architecture/
│   │   └── architecture-planning.md
│   ├── implementation/
│   │   ├── step-by-step-template.md
│   │   └── phase-by-phase-template.md
│   ├── design/
│   │   └── ux-deai-ification.md
│   └── security/
│       └── security-audit-phase0.md
├── templates/                         # Full implementation templates
│   ├── step-by-step-implementation.md
│   └── phase-by-phase-implementation.md
├── examples/                          # Real project examples
│   ├── saas-app-example.md
│   └── mobile-app-example.md
└── docs/                              # Additional guides
    ├── common-pitfalls.md
    ├── adaptation-guide.md
    └── references.md
```

---

## 🎨 Key Concepts

### Parallel Validation
Use **separate AI conversations** to challenge your ideas:
1. **Goal Definition** - Define what you want to build
2. **Devil's Advocate** - Challenge every assumption
3. **Synthesis** - Merge both perspectives into a solid plan

**Why?** Catches fundamental flaws before you invest days/weeks.

### Structured Implementation
Choose your level of control:
- **Step-by-Step:** One substep at a time, lint after each, high control
- **Phase-by-Phase:** Complete phases at once, balanced speed/control

**Why?** Prevents scope creep, ensures completeness, maintains quality.

### Design Intentionally
Use the "UX De-AI-ification" prompt to move beyond generic AI aesthetics.

**Why?** Your product shouldn't look like every other AI-generated app.

### Security First
Built-in security audit process based on [this comprehensive methodology](https://gist.github.com/scragz/0a2f530abb40b9aec246cd8ea6ad72de).

**Why?** Retrofitting security is 10x harder than building it in.

---

## 📖 Full Documentation

- **[WORKFLOW.md](./WORKFLOW.md)** - Complete step-by-step process
- **[docs/common-pitfalls.md](./docs/common-pitfalls.md)** - Mistakes to avoid
- **[docs/adaptation-guide.md](./docs/adaptation-guide.md)** - Customize for your context
- **[docs/references.md](./docs/references.md)** - External resources

---

## 🛠️ How to Use

### For a New Project

1. **Ideation Phase** (Day 1)
   ```bash
   # Copy these prompts in order
   ./prompts/ideation/goal-definition.md
   ./prompts/ideation/devils-advocate.md
   ./prompts/ideation/goal-synthesis.md
   ```

2. **Architecture Phase** (Day 1-2)
   ```bash
   # Use Cursor planning mode with this
   ./prompts/architecture/architecture-planning.md
   ```

3. **Implementation** (Days 2-N)
   ```bash
   # Choose one based on complexity
   ./templates/step-by-step-implementation.md      # High control
   ./templates/phase-by-phase-implementation.md    # Balanced
   ```

4. **Design Polish** (Before launch)
   ```bash
   ./prompts/design/ux-deai-ification.md
   ```

5. **Security Audit** (Before production)
   ```bash
   ./prompts/security/security-audit-phase0.md
   ```

### For Existing Projects

Pick the prompts you need:
- Need to add a feature? → Use architecture planning prompt
- Design feels generic? → Use UX de-AI-ification prompt  
- Pre-launch security review? → Use security audit prompt

---

## 🤝 Contributing

Found a useful prompt pattern? Add it!

1. Fork this repo
2. Add your prompt to the appropriate directory
3. Follow the existing format (see any prompt file for structure)
4. Submit a PR with a brief description

**Prompt Format:**
```markdown
# [Prompt Name]

**When to Use:** [Brief description]

**Context Needed:** [What info to have ready]

## Prompt

[The actual prompt text, copy-paste ready]

## Usage Notes

- [Tip 1]
- [Tip 2]

## Example Output

[Optional: What good output looks like]
```

---

## 📚 Examples

See `examples/` directory for real projects built with this workflow:
- SaaS web app (Next.js + Supabase)
- Mobile app (React Native)
- Azure migration with HIPAA compliance

---

## 🎯 Philosophy

**This toolkit assumes:**
- You're working with AI (Claude, ChatGPT, etc.) to build software
- You want production-quality results, not just prototypes
- You value systematic processes over ad-hoc prompting
- You learn by doing, not by reading theory

**This toolkit provides:**
- **Prompts** - Copy-paste into AI conversations
- **Templates** - Starting points for implementation plans
- **Workflows** - Proven sequences of steps
- **Examples** - Real projects for reference

**This toolkit does NOT provide:**
- Frameworks or libraries to install
- Opinionated tech stack choices
- AI training or fine-tuning
- Magic solutions to hard problems

---

## 📜 License

MIT License - Use freely, share openly, attribute when you remember.

---

## 🙏 Credits

Built by practitioners who got tired of reinventing the wheel on every project.

Based on real work across:
- SaaS applications
- Healthcare compliance (HIPAA)
- Mobile apps
- Enterprise systems

Special thanks to:
- [scragz](https://gist.github.com/scragz) for the comprehensive security audit methodology

---

## 🔗 Links

- [Full Security Audit Process](https://gist.github.com/scragz/0a2f530abb40b9aec246cd8ea6ad72de)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [The Twelve-Factor App](https://12factor.net/)
- [Laws of UX](https://lawsofux.com/)

---

**Questions? Issues? Improvements?** Open an issue or PR. This is a living toolkit.
