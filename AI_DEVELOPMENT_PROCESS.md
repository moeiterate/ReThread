# AI Development Process

**Internal Reference Guide for AI-Assisted Development Workflow**

This document outlines the systematic approach for building software projects with AI assistance, from initial concept to production deployment. Use this as a reference for maintaining consistency across projects.

---

## Overview

This process leverages multiple AI conversations in parallel, strategic planning tools, and structured implementation templates to build production-ready applications efficiently. The workflow emphasizes validation, security, and maintainability from the start.

---

## Phase 1: Ideation & Validation

### Step 1.1: Goal Definition Conversation
**Objective:** Establish clear project goals and requirements

- Open a dedicated AI conversation focused on goal definition
- Prompt: "I want to build [general concept]. Help me define the core problem, target users, and measurable success criteria."
- Document:
  - Core problem statement
  - Primary user personas
  - Key success metrics
  - Technical constraints
  - Budget/timeline considerations

**Output:** Initial requirements document (save as `PROJECT_GOALS.md`)

---

### Step 1.2: Devil's Advocate Challenge
**Objective:** Identify weaknesses, risks, and alternatives

- Open a **separate** AI conversation (different window/session)
- Prompt: "Act as a critical product strategist. Here are our project goals: [paste goals]. Challenge these assumptions, identify risks, suggest alternatives, and point out potential failures."
- Focus areas to challenge:
  - Market fit
  - Technical feasibility
  - Cost efficiency
  - Scalability concerns
  - Security/compliance risks
  - UX complexity

**Output:** Risk assessment document (`RISK_ASSESSMENT.md`)

---

### Step 1.3: Synthesis & Decision
**Objective:** Merge insights and finalize direction

- Review both documents side-by-side
- Create a third conversation (or use original goal conversation)
- Prompt: "Given these goals [paste] and these concerns [paste], help me synthesize a balanced approach that addresses the critical risks while maintaining core value."
- Make final decisions on:
  - MVP feature scope
  - Technology stack
  - Architecture patterns
  - Success criteria

**Output:** Final specification document (`PROJECT_SPEC.md`)

---

## Phase 2: Architecture & Planning

### Step 2.1: Architecture Planning (Cursor Planning Feature)
**Objective:** Design system architecture before coding

- Use Cursor's planning mode or equivalent
- Prompt: "Based on this specification [paste spec], design a system architecture for [stack/framework]. Consider: database schema, API structure, authentication, file storage, external integrations."
- Document:
  - System architecture diagram (text-based)
  - Database schema
  - API endpoint structure
  - Third-party service choices
  - Security considerations
  - Deployment strategy

**Output:** `ARCHITECTURE.md` and `SYSTEM_DESIGN.md`

---

### Step 2.2: Implementation Plan Selection
**Choose the appropriate implementation template based on project complexity:**

#### Option A: Step-by-Step (Detailed Control)
**Use when:**
- Learning new technology
- High complexity/risk
- Regulatory requirements (HIPAA, SOC2, etc.)
- Team collaboration needed

**Template Structure:**
```markdown
### Phase X — [Phase Name]
- [ ] 1. [Master Step Name]
  - [ ] 1.1. [Detailed substep]
  - [ ] 1.2. [Detailed substep]
  - [ ] 1.3. [Detailed substep]
- [ ] 2. [Master Step Name]
  - [ ] 2.1. [Detailed substep]

**Acceptance**
- [ ] Specific testable criteria
```

**Rules for this template:**
- One substep at a time
- Run linters after each substep
- Fix errors before proceeding
- Mark complete only when verified
- Wait for user confirmation at phase boundaries

---

#### Option B: Phase-by-Phase (Balanced Speed)
**Use when:**
- Familiar technology stack
- Medium complexity
- Quick iteration needed
- Clear requirements

**Template Structure:**
```markdown
### Phase X — [Phase Name]
- [ ] 1. [High-level milestone]
- [ ] 2. [High-level milestone]
- [ ] 3. [High-level milestone]

**Acceptance**
- [ ] Phase-level criteria
```

**Rules for this template:**
- Complete entire phase in one go
- Review code at phase completion
- Run comprehensive tests
- Single commit per phase

---

### Step 2.3: Create Implementation Plan
**Objective:** Generate phased development roadmap

- Prompt: "Using [template choice], create a detailed implementation plan for this project. Break into logical phases: Foundation, Core Features, Polish, Security, Deployment."
- Ensure plan includes:
  - Dependency order (e.g., auth before protected routes)
  - Testing checkpoints
  - Security review steps
  - Documentation tasks

**Output:** `IMPLEMENTATION_PLAN.md` (using chosen template)

---

## Phase 3: Implementation

### Step 3.1: Setup Development Environment
- Initialize repository
- Configure tooling (linters, formatters, type checkers)
- Set up environment variables (`.env.example`)
- Create initial architecture docs

---

### Step 3.2: Iterative Development
**Following your implementation plan:**

#### For Step-by-Step Template:
1. Start at substep X.1
2. Implement the change
3. Run `npm run lint` (or equivalent)
4. Use `ReadLints` tool on modified files
5. Fix any errors
6. Mark substep complete
7. Proceed to X.2 (auto-advance within phase)
8. At phase boundary, STOP and verify acceptance criteria

#### For Phase-by-Phase Template:
1. Implement all milestones in phase
2. Run comprehensive tests
3. Review code quality
4. Verify acceptance criteria
5. Commit with descriptive message
6. Proceed to next phase

---

### Step 3.3: Continuous Validation
**At each phase completion:**
- Verify acceptance criteria
- Run full test suite
- Check linter/type errors
- Review security implications
- Document any deviations from plan

---

## Phase 4: Design Polish

### Step 4.1: UX De-AI-ification
**Objective:** Remove generic AI aesthetics

**Problem:** AI tools default to overused component libraries (shadcn, Material UI, etc.) with predictable patterns.

**Solution Prompt:**
```
Take the role of a principal-level UX designer. Review this application and propose changes to make the design system unrecognizable from standard [component library] implementations. Focus on:

1. Color palette - move away from blue/purple defaults
2. Typography - unique font pairings and hierarchies
3. Spacing - break the 8px grid pattern where appropriate
4. Component shapes - unique border radius, shadows, borders
5. Interactions - custom animations and micro-interactions
6. Layout - unconventional grid/flex patterns

Maintain accessibility and usability while creating a distinct visual identity.
```

**Review areas:**
- Button styles (shape, size, hover states)
- Form inputs (visual treatment)
- Card components (elevation, borders, spacing)
- Navigation patterns (position, behavior)
- Color application (not just brand colors on default gray)
- Animation/transitions (timing, easing, effects)

**Output:** Design system documentation and component updates

---

### Step 4.2: Implement Design Changes
- Update CSS variables/Tailwind config
- Modify component library overrides
- Create custom components where needed
- Test across devices/browsers

---

## Phase 5: Security Audit

### Step 5.1: Security Review (Critical)
**Objective:** Identify and fix security vulnerabilities

**Use the security audit prompt:** ([Reference](https://gist.github.com/scragz/0a2f530abb40b9aec246cd8ea6ad72de))

**Prompt structure:**
```
Act as an expert security researcher specializing in code auditing. Conduct a thorough security audit of this codebase.

## Phase 0: Scoping & Context Gathering
- Programming language(s): [specify]
- Application type: [web app, API, etc.]
- Sensitivity level: [public, internal, handles PII, etc.]
- Key dependencies: [list critical libraries]
- Deployment environment: [cloud provider, containerized, etc.]

## Phase 1: Analysis & Vulnerability Identification
Focus on:
- Authentication & Session Management
- Authorization & Access Control
- Input Validation & Sanitization
- Data Handling & Storage
- API Security
- Secrets Management
- Dependency Vulnerabilities
- Error Handling & Logging
- Security Configuration
- Cryptography

For each issue found:
- Assign severity (Critical, High, Medium, Low)
- Provide file path and line numbers
- Classify vulnerability type (SQLi, XSS, etc.)
- Reference CWE or OWASP Top 10

## Phase 2: Remediation Planning
For High/Critical issues:
- Explain the risk
- Provide attack scenario
- Propose specific fix with code examples
- Explain how fix mitigates risk

## Phase 3: Implementation Proposal
- Provide before/after code
- Suggest verification tests
- Confirm no new vulnerabilities introduced
```

**Key focus areas:**
- Injection flaws (SQL, NoSQL, Command, XSS)
- Broken authentication/authorization
- Sensitive data exposure
- Security misconfiguration
- Vulnerable dependencies
- Insufficient logging
- CSRF/SSRF vulnerabilities

---

### Step 5.2: Fix Security Issues
- Address Critical and High severity issues immediately
- Document Medium/Low issues for future sprints
- Re-run security audit after fixes
- Update security documentation

---

### Step 5.3: Security Documentation
Create `SECURITY.md` including:
- Threat model
- Security controls implemented
- Known limitations
- Reporting procedures
- Compliance status (if applicable)

---

## Phase 6: Testing & Deployment

### Step 6.1: Testing
- Unit tests for critical logic
- Integration tests for APIs
- E2E tests for user flows
- Performance testing
- Security testing (OWASP ZAP, etc.)
- Accessibility testing

---

### Step 6.2: Deployment Preparation
- Environment configuration
- CI/CD pipeline setup
- Monitoring/logging configuration
- Backup procedures
- Rollback plan

---

### Step 6.3: Production Deployment
- Deploy to staging first
- Run smoke tests
- Monitor error rates
- Deploy to production
- Post-deployment verification

---

## Phase 7: Documentation & Handoff

### Step 7.1: Technical Documentation
Create/update:
- `README.md` - setup instructions
- `ARCHITECTURE.md` - system design
- `API.md` - API documentation (if applicable)
- `DEPLOYMENT.md` - deployment procedures
- `RUNBOOK.md` - operational procedures

---

### Step 7.2: User Documentation
- User guides
- Admin documentation
- FAQ
- Troubleshooting guides

---

## Key Principles

### 1. Parallel Validation
Use separate AI conversations to challenge ideas before committing resources. This catches issues early.

### 2. Structured Implementation
Follow a phased plan with clear acceptance criteria. Prevents scope creep and ensures completeness.

### 3. Continuous Quality Checks
Run linters and tests frequently. Fix issues immediately rather than accumulating technical debt.

### 4. Security First
Don't treat security as an afterthought. Build it into the architecture and validate before launch.

### 5. Design Intentionally
Generic AI-generated designs hurt credibility. Invest time in creating a unique visual identity.

### 6. Document Everything
Your future self (and team) will thank you. Documentation is part of the deliverable.

---

## Templates & References

### Implementation Plan Templates

#### Step-by-Step Template (High Control)
```markdown
---
alwaysApply: false
description: [Project Name] — [Brief Description]
---

## [Project Name] — Implementation Plan

[Project overview and goals]

## Rules
- Complete one substep at a time, no exceptions
- Run linters after each substep
- Fix errors before proceeding
- Mark substep complete only when verified
- Wait for user confirmation at phase boundaries
- Keep changes focused to current substep

### Phase A — [Foundation]
- [ ] 1. [Master Step]
  - [ ] 1.1. [Substep with specific deliverable]
  - [ ] 1.2. [Substep with specific deliverable]
  - [ ] 1.3. [Substep with specific deliverable]
- [ ] 2. [Master Step]
  - [ ] 2.1. [Substep]

**Acceptance**
- [ ] Specific testable criteria
- [ ] Another testable criteria

### Phase B — [Core Features]
[Repeat structure]

---

[Continue for all phases]
```

#### Phase-by-Phase Template (Balanced)
```markdown
---
alwaysApply: false
description: [Project Name] — [Brief Description]
---

## [Project Name] — Implementation Plan

[Project overview and goals]

## Rules
- Complete entire phase before moving forward
- Run comprehensive tests at phase completion
- Fix all errors before proceeding to next phase
- Single commit per phase with descriptive message

### Phase A — [Foundation]
- [ ] 1. [High-level milestone with clear deliverable]
- [ ] 2. [High-level milestone with clear deliverable]
- [ ] 3. [High-level milestone with clear deliverable]

**Acceptance**
- [ ] Phase-level success criteria
- [ ] Another phase-level criteria

### Phase B — [Core Features]
[Repeat structure]

---

[Continue for all phases]
```

---

### Prompt Library

#### 1. Goal Definition Prompt
```
I want to build [general concept]. Help me define:
1. The core problem this solves
2. Who the primary users are
3. What success looks like (measurable metrics)
4. Key technical requirements or constraints
5. Budget and timeline considerations

Be specific and challenge vague requirements.
```

#### 2. Devil's Advocate Prompt
```
Act as a critical product strategist and technical advisor. 

Here are the project goals:
[Paste goals]

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

#### 3. Architecture Planning Prompt
```
Based on this specification:
[Paste spec]

Design a system architecture for [tech stack]. Include:
1. Database schema (tables, relationships, indexes)
2. API structure (endpoints, methods, auth)
3. Authentication/authorization strategy
4. File storage solution
5. External service integrations
6. Security considerations
7. Scalability considerations
8. Deployment strategy

Provide text-based diagrams where helpful.
```

#### 4. UX De-AI-ification Prompt
```
Take the role of a principal-level UX designer. Review this application built with [component library].

Your goal: Make the design system unrecognizable from standard [library name] implementations.

Propose specific changes to:
1. Color palette (move away from defaults)
2. Typography (unique pairings, hierarchy)
3. Spacing system (break conventional patterns where it helps)
4. Component styling (buttons, inputs, cards, navigation)
5. Micro-interactions (hover, focus, loading states)
6. Layout patterns (grids, spacing, asymmetry)

Maintain accessibility standards (WCAG 2.1 AA minimum) and usability principles. Focus on creating a distinct brand identity without sacrificing function.

Provide specific CSS/Tailwind changes with before/after examples.
```

#### 5. Security Audit Prompt (Phase 0 Start)
```
Act as an expert security researcher specializing in code auditing. You are tasked with conducting a thorough security audit of the provided codebase.

**Objective:** Identify, prioritize, and propose remediation strategies for high-priority security vulnerabilities that could lead to system compromise, data breaches, unauthorized access, denial of service, or other significant security incidents.

## Phase 0: Scoping & Context Gathering

Please ask clarifying questions about:
- Programming language(s) and framework(s)
- Application purpose and sensitivity level
- Key third-party dependencies
- Deployment environment
- How the codebase will be provided

Define the threat model appropriate for this application.

[Continue with full audit process from reference]
```

---

### Reference Links

#### Security
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25 Most Dangerous Software Weaknesses](https://cwe.mitre.org/top25/archive/2023/2023_top25_list.html)
- [Security Audit Prompt (Gist)](https://gist.github.com/scragz/0a2f530abb40b9aec246cd8ea6ad72de)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

#### Architecture & Design
- [The Twelve-Factor App](https://12factor.net/)
- [Clean Architecture Principles](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [System Design Primer](https://github.com/donnemartin/system-design-primer)

#### UX/UI Design
- [Laws of UX](https://lawsofux.com/)
- [Material Design Principles](https://m3.material.io/foundations) (to understand then deviate from)
- [Refactoring UI](https://www.refactoringui.com/)

#### Testing
- [Testing Trophy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [Test Desiderata](https://kentbeck.github.io/TestDesiderata/)

#### DevOps & Deployment
- [DevOps Roadmap](https://roadmap.sh/devops)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

## Tooling Recommendations

### Development
- **Cursor IDE** - AI-assisted coding with planning mode
- **GitHub Copilot** - Code completion
- **ESLint/Prettier** - Code quality
- **TypeScript** - Type safety

### Testing
- **Vitest/Jest** - Unit testing
- **Playwright** - E2E testing
- **React Testing Library** - Component testing

### Security
- **OWASP ZAP** - Security scanning
- **npm audit** - Dependency vulnerabilities
- **Snyk** - Continuous security monitoring

### Deployment
- **Vercel/Netlify** - Frontend hosting
- **Railway/Render** - Backend hosting
- **Supabase/Firebase** - Backend-as-a-service
- **Azure/AWS/GCP** - Full infrastructure control

---

## Adaptation Guide

This process is a framework, not a rigid prescription. Adapt based on:

### Project Size
- **Small (< 1 week):** Skip devil's advocate, use phase-by-phase template
- **Medium (1-4 weeks):** Full process, phase-by-phase template
- **Large (> 4 weeks):** Full process, step-by-step template, multiple security reviews

### Team Size
- **Solo:** Focus on documentation for future you
- **Small team (2-5):** Emphasize architecture documentation and runbooks
- **Larger team:** Add code review checkpoints, ADR (Architecture Decision Records)

### Risk Level
- **Low stakes (internal tools, experiments):** Lighter security review
- **Medium stakes (business apps):** Standard process
- **High stakes (handles PII, financial data, healthcare):** Enhanced security review, compliance checklist, legal review

### Technology Familiarity
- **New stack:** Use step-by-step template, more research/validation phases
- **Familiar stack:** Use phase-by-phase template, faster iteration

---

## Common Pitfalls

### 1. Skipping the Devil's Advocate Phase
**Why it's tempting:** Feels like extra work when you're excited about an idea.
**Why it matters:** Catches fundamental flaws before you invest days/weeks.

### 2. Ignoring Security Until the End
**Why it's tempting:** Security feels like a blocker to shipping.
**Why it matters:** Retrofitting security is 10x harder than building it in.

### 3. Accepting Default AI Designs
**Why it's tempting:** AI-generated UI "looks fine" initially.
**Why it matters:** Your product blends into the sea of generic SaaS apps.

### 4. Inconsistent Linting/Testing
**Why it's tempting:** "I'll fix it later" when moving fast.
**Why it matters:** Technical debt compounds exponentially.

### 5. Poor Documentation
**Why it's tempting:** Code is "self-documenting" (it's not).
**Why it matters:** You'll forget your own decisions in 3 months.

---

## Success Metrics

Track these to improve your process over time:

### Velocity
- Time from idea to MVP
- Time from MVP to production
- Rework percentage (features rebuilt due to poor planning)

### Quality
- Post-launch bug count
- Security issues found in production
- Test coverage percentage

### Maintainability
- Time to onboard new developer (if team project)
- Time to add new feature
- Technical debt ratio

---

## Version History

- **v1.0** - Initial documentation based on Azure Migration & Goal Journal projects
- Document created: February 6, 2026

---

## Contributing

This is a living document. As you discover improvements to the process:
1. Document what changed and why
2. Update this guide
3. Update templates accordingly
4. Share learnings with team

---

*This process is internal to ReThread operations. Adapt and improve based on real-world results.*
