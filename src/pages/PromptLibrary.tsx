import { useState } from 'react';
import { 
  Copy, 
  Check, 
  FileText, 
  Code, 
  Shield, 
  Palette,
  GitBranch,
  Lightbulb,
  Edit3,
  Plus,
  ExternalLink,
  BookMarked
} from 'lucide-react';

type PromptTemplate = {
  id: string;
  title: string;
  category: string;
  icon: typeof FileText;
  description: string;
  prompt: string;
  usageNotes: string[];
  lastUpdated: string;
};

export const PromptLibrary = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddPrompt, setShowAddPrompt] = useState(false);
  const [newPrompt, setNewPrompt] = useState({
    title: '',
    category: 'ideation',
    description: '',
    prompt: '',
    usageNotes: '',
  });

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddPrompt = () => {
    // In a real implementation, this would save to a database or local storage
    console.log('New prompt to add:', newPrompt);
    alert('Prompt submitted! (In production, this would save to your prompt library)');
    setShowAddPrompt(false);
    setNewPrompt({
      title: '',
      category: 'ideation',
      description: '',
      prompt: '',
      usageNotes: '',
    });
  };

  const templates: PromptTemplate[] = [
    {
      id: 'goal-definition',
      title: 'Goal Definition',
      category: 'ideation',
      icon: Lightbulb,
      description: 'Establish clear project goals and requirements',
      lastUpdated: '2026-02-06',
      usageNotes: [
        'Use in a dedicated AI conversation',
        'Be specific about constraints and success metrics',
        'Challenge vague requirements',
      ],
      prompt: `I want to build [general concept]. Help me define:

1. The core problem this solves
2. Who the primary users are
3. What success looks like (measurable metrics)
4. Key technical requirements or constraints
5. Budget and timeline considerations

Be specific and challenge vague requirements.`,
    },
    {
      id: 'devils-advocate',
      title: "Devil's Advocate",
      category: 'ideation',
      icon: Lightbulb,
      description: 'Challenge assumptions and identify risks',
      lastUpdated: '2026-02-06',
      usageNotes: [
        'Open in SEPARATE AI window from goal definition',
        'Paste goals from first conversation',
        'Look for blind spots and hidden costs',
      ],
      prompt: `Act as a critical product strategist and technical advisor.

Here are the project goals:
[PASTE GOALS HERE]

Your job is to challenge these assumptions. Specifically:
- What could go wrong?
- What are we missing?
- Are there simpler solutions?
- What are the hidden costs?
- What security/compliance risks exist?
- What will make this hard to maintain?
- What alternatives should we consider?

Be direct and brutally honest.`,
    },
    {
      id: 'architecture-planning',
      title: 'Architecture Planning',
      category: 'architecture',
      icon: GitBranch,
      description: 'Design system architecture before coding',
      lastUpdated: '2026-02-06',
      usageNotes: [
        'Use in Cursor planning mode',
        'Reference final spec from ideation phase',
        'Document decisions for future reference',
      ],
      prompt: `Based on this specification:
[PASTE SPECIFICATION HERE]

Design a system architecture for [TECH STACK]. Include:

1. Database schema (tables, relationships, indexes)
2. API structure (endpoints, methods, auth)
3. Authentication/authorization strategy
4. File storage solution
5. External service integrations
6. Security considerations
7. Scalability considerations
8. Deployment strategy

Provide text-based diagrams where helpful.`,
    },
    {
      id: 'ux-deai',
      title: 'UX De-AI-ification',
      category: 'design',
      icon: Palette,
      description: 'Remove generic AI aesthetics from design',
      lastUpdated: '2026-02-06',
      usageNotes: [
        'Run after MVP is functional',
        'Focus on creating unique brand identity',
        'Maintain accessibility standards (WCAG 2.1 AA)',
        'Request specific CSS/Tailwind changes',
      ],
      prompt: `Take the role of a principal-level UX designer. Review this application built with [COMPONENT LIBRARY].

Your goal: Make the design system unrecognizable from standard [LIBRARY NAME] implementations.

Propose specific changes to:
1. Color palette (move away from defaults)
2. Typography (unique pairings, hierarchy)
3. Spacing system (break conventional patterns where it helps)
4. Component styling (buttons, inputs, cards, navigation)
5. Micro-interactions (hover, focus, loading states)
6. Layout patterns (grids, spacing, asymmetry)

Maintain accessibility standards (WCAG 2.1 AA minimum) and usability principles. Focus on creating a distinct brand identity without sacrificing function.

Provide specific CSS/Tailwind changes with before/after examples.`,
    },
    {
      id: 'security-audit-phase0',
      title: 'Security Audit (Phase 0)',
      category: 'security',
      icon: Shield,
      description: 'Initial security audit scoping',
      lastUpdated: '2026-02-06',
      usageNotes: [
        'Run before production deployment',
        'Provide specific context about your app',
        'Follow up with full audit process',
        'Reference: https://gist.github.com/scragz/0a2f530abb40b9aec246cd8ea6ad72de',
      ],
      prompt: `Act as an expert security researcher specializing in code auditing. You are tasked with conducting a thorough security audit of the provided codebase.

**Objective:** Identify, prioritize, and propose remediation strategies for high-priority security vulnerabilities that could lead to system compromise, data breaches, unauthorized access, denial of service, or other significant security incidents.

## Phase 0: Scoping & Context Gathering

Please ask clarifying questions about:
- Programming language(s) and framework(s)
- Application purpose and sensitivity level (e.g., internal tool, public app, handles PII)
- Key third-party dependencies
- Deployment environment (cloud provider, containerized, etc.)
- How the codebase will be provided

Define the threat model appropriate for this application.

---

After Phase 0, proceed with full audit following the structured process from: https://gist.github.com/scragz/0a2f530abb40b9aec246cd8ea6ad72de`,
    },
    {
      id: 'implementation-stepbystep',
      title: 'Implementation Plan (Step-by-Step)',
      category: 'implementation',
      icon: Code,
      description: 'Detailed implementation template for high-control projects',
      lastUpdated: '2026-02-06',
      usageNotes: [
        'Use for: Learning new tech, regulatory compliance, high complexity',
        'AI completes one substep at a time',
        'Requires user approval at phase boundaries',
        'Emphasizes linting and error fixing',
      ],
      prompt: `---
alwaysApply: false
description: [PROJECT NAME] — [BRIEF DESCRIPTION]
---

## [PROJECT NAME] — Implementation Plan

[Project overview and goals - 2-3 sentences]

## Rules
- Complete one substep at a time, no exceptions
- After finishing a substep, mark it as completed, then await explicit permission before starting the next
- Run linters after each substep (npm run lint, ReadLints tool)
- Fix errors before proceeding to next substep
- Wait for user confirmation at phase boundaries
- Keep changes surgically focused to current substep
- Document any deviations from plan

### Phase A — [FOUNDATION/SETUP]
- [ ] 1. [Master Step Name]
  - [ ] 1.1. [Specific deliverable with clear acceptance criteria]
  - [ ] 1.2. [Specific deliverable with clear acceptance criteria]
  - [ ] 1.3. [Specific deliverable with clear acceptance criteria]
- [ ] 2. [Master Step Name]
  - [ ] 2.1. [Specific deliverable]
  - [ ] 2.2. [Specific deliverable]

**Acceptance**
- [ ] Specific testable criteria
- [ ] Another testable criteria

### Phase B — [CORE FEATURES]
- [ ] 1. [Master Step Name]
  - [ ] 1.1. [Substep]
  - [ ] 1.2. [Substep]

**Acceptance**
- [ ] Phase-level success criteria

[Continue for all phases: Foundation, Core Features, Polish, Security, Deployment]

---

## Out of Scope (Future Enhancements)
- [Features intentionally deferred]
- [Nice-to-haves for v2]`,
    },
    {
      id: 'implementation-phase',
      title: 'Implementation Plan (Phase-by-Phase)',
      category: 'implementation',
      icon: Code,
      description: 'Balanced implementation template for medium complexity',
      lastUpdated: '2026-02-06',
      usageNotes: [
        'Use for: Familiar tech stack, medium complexity, quick iteration',
        'AI completes entire phase at once',
        'Single commit per phase',
        'Good balance of speed and control',
      ],
      prompt: `---
alwaysApply: false
description: [PROJECT NAME] — [BRIEF DESCRIPTION]
---

## [PROJECT NAME] — Implementation Plan

[Project overview and goals - 2-3 sentences]

## Rules
- Complete entire phase before moving forward
- Run comprehensive tests at phase completion
- Fix all errors before proceeding to next phase
- Single commit per phase with descriptive message
- Document any architectural decisions

### Phase A — [FOUNDATION]
- [ ] 1. [High-level milestone with clear deliverable]
- [ ] 2. [High-level milestone with clear deliverable]
- [ ] 3. [High-level milestone with clear deliverable]

**Acceptance**
- [ ] Phase-level success criteria
- [ ] Another phase-level criteria

### Phase B — [CORE FEATURES]
- [ ] 1. [High-level milestone]
- [ ] 2. [High-level milestone]
- [ ] 3. [High-level milestone]

**Acceptance**
- [ ] Core functionality working end-to-end
- [ ] Tests passing

[Continue for all phases]

---

## Technology Stack
- [List key technologies and versions]

## Architecture Decisions
- [Document key architectural choices]`,
    },
    {
      id: 'synthesis',
      title: 'Goal Synthesis',
      category: 'ideation',
      icon: Lightbulb,
      description: 'Merge goal definition and devil\'s advocate insights',
      lastUpdated: '2026-02-06',
      usageNotes: [
        'Use after completing both goal definition and devil\'s advocate',
        'Paste both documents for review',
        'Make final scope decisions',
      ],
      prompt: `Given these project goals:
[PASTE GOAL DEFINITION HERE]

And these concerns/risks:
[PASTE DEVIL'S ADVOCATE CRITIQUE HERE]

Help me synthesize a balanced approach that:
1. Addresses the critical risks
2. Maintains core value proposition
3. Defines realistic MVP scope
4. Identifies must-have vs nice-to-have features
5. Acknowledges known trade-offs

Provide a final specification document that balances ambition with pragmatism.`,
    },
  ];

  const categories = [
    { id: 'all', label: 'All Prompts', icon: FileText },
    { id: 'ideation', label: 'Ideation', icon: Lightbulb },
    { id: 'architecture', label: 'Architecture', icon: GitBranch },
    { id: 'implementation', label: 'Implementation', icon: Code },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const documentReferences = [
    {
      title: 'AI Development Process Documentation',
      description: 'Complete workflow guide from ideation to deployment',
      url: '/AI_DEVELOPMENT_PROCESS.md',
      type: 'Internal',
    },
    {
      title: 'Security Audit Prompt (Full Process)',
      description: 'Comprehensive security audit methodology by scragz',
      url: 'https://gist.github.com/scragz/0a2f530abb40b9aec246cd8ea6ad72de',
      type: 'External',
    },
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-main)] mb-2">
              Prompt Library
            </h1>
            <p className="text-[var(--text-muted)] text-lg">
              Reusable prompt templates for AI-assisted development workflow
            </p>
          </div>
          <button
            onClick={() => setShowAddPrompt(true)}
            className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Prompt
          </button>
        </div>

        {/* GitHub Link Callout */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <ExternalLink className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-[var(--text-main)] mb-1">
                Full Process on GitHub
              </h3>
              <p className="text-sm text-[var(--text-muted)] mb-2">
                View the complete AI Development Process documentation with all templates, examples, and references.
              </p>
              <a
                href="https://github.com/yourusername/ReThread/blob/main/AI_DEVELOPMENT_PROCESS.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-[var(--primary)] hover:underline font-medium inline-flex items-center gap-1"
              >
                View on GitHub
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  px-4 py-2 rounded-lg border transition-all flex items-center gap-2
                  ${selectedCategory === cat.id 
                    ? 'bg-[var(--primary)] text-white border-[var(--primary)]' 
                    : 'bg-white text-[var(--text-muted)] border-[var(--line-color)] hover:border-[var(--primary)]'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Add Prompt Modal */}
        {showAddPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6 border-b border-[var(--line-color)]">
                <h2 className="text-2xl font-bold text-[var(--text-main)]">
                  Add New Prompt
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
                    Prompt Title
                  </label>
                  <input
                    type="text"
                    value={newPrompt.title}
                    onChange={(e) => setNewPrompt({ ...newPrompt, title: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--line-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    placeholder="e.g., API Design Prompt"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
                    Category
                  </label>
                  <select
                    value={newPrompt.category}
                    onChange={(e) => setNewPrompt({ ...newPrompt, category: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--line-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  >
                    <option value="ideation">Ideation</option>
                    <option value="architecture">Architecture</option>
                    <option value="implementation">Implementation</option>
                    <option value="design">Design</option>
                    <option value="security">Security</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={newPrompt.description}
                    onChange={(e) => setNewPrompt({ ...newPrompt, description: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--line-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    placeholder="Brief description of what this prompt does"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
                    Prompt Template
                  </label>
                  <textarea
                    value={newPrompt.prompt}
                    onChange={(e) => setNewPrompt({ ...newPrompt, prompt: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--line-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-mono text-sm"
                    rows={10}
                    placeholder="Paste your prompt template here..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
                    Usage Notes (one per line)
                  </label>
                  <textarea
                    value={newPrompt.usageNotes}
                    onChange={(e) => setNewPrompt({ ...newPrompt, usageNotes: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--line-color)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm"
                    rows={4}
                    placeholder="When to use this prompt&#10;What to prepare beforehand&#10;Expected output format"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-[var(--line-color)] flex gap-3 justify-end">
                <button
                  onClick={() => setShowAddPrompt(false)}
                  className="px-4 py-2 border border-[var(--line-color)] rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPrompt}
                  className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Add Prompt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Prompts Grid */}
        <div className="space-y-6">
          {filteredTemplates.map((template) => {
            const Icon = template.icon;
            const isCopied = copiedId === template.id;

            return (
              <div 
                key={template.id}
                className="bg-white rounded-lg border border-[var(--line-color)] overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="p-6 border-b border-[var(--line-color)]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[var(--primary)]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[var(--text-main)] mb-1">
                          {template.title}
                        </h3>
                        <p className="text-sm text-[var(--text-muted)] mb-2">
                          {template.description}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">
                          Last updated: {template.lastUpdated}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(template.prompt, template.id)}
                      className="flex-shrink-0 px-4 py-2 rounded-lg bg-[var(--primary)] text-white hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="text-sm">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="text-sm">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Usage Notes */}
                <div className="p-6 bg-blue-50 border-b border-[var(--line-color)]">
                  <h4 className="text-sm font-semibold text-[var(--text-main)] mb-2">
                    Usage Notes
                  </h4>
                  <ul className="space-y-1">
                    {template.usageNotes.map((note, idx) => (
                      <li key={idx} className="text-sm text-[var(--text-muted)] flex items-start gap-2">
                        <span className="text-[var(--primary)] mt-0.5">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prompt */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-[var(--text-main)]">
                      Prompt Template
                    </h4>
                  </div>
                  <pre className="bg-gray-50 rounded-lg p-4 text-sm text-[var(--text-muted)] overflow-x-auto border border-gray-200">
                    <code>{template.prompt}</code>
                  </pre>
                </div>
              </div>
            );
          })}
        </div>

        {/* Customizing Prompts */}
        <div className="mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-6">
          <h2 className="text-xl font-semibold text-[var(--text-main)] mb-4 flex items-center gap-2">
            <Edit3 className="w-5 h-5" />
            Customizing Prompts
          </h2>
          <div className="space-y-3 text-sm text-[var(--text-muted)]">
            <p>
              These prompts are templates. Always customize them with your specific project details:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-[var(--primary)]">•</span>
                <span>Replace placeholders [IN BRACKETS] with actual values</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--primary)]">•</span>
                <span>Add project-specific constraints or requirements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--primary)]">•</span>
                <span>Adjust tone/detail level based on AI model being used</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--primary)]">•</span>
                <span>Document improvements back into this library for future projects</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Document References */}
        <div className="mt-8 bg-white rounded-lg border border-[var(--line-color)] p-6">
          <h2 className="text-xl font-semibold text-[var(--text-main)] mb-4 flex items-center gap-2">
            <BookMarked className="w-5 h-5" />
            Document References
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Additional resources and documentation for the AI development workflow
          </p>
          <div className="space-y-3">
            {documentReferences.map((doc) => (
              <div
                key={doc.url}
                className="flex items-start justify-between gap-4 p-4 border border-[var(--line-color)] rounded-lg hover:border-[var(--primary)] transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-[var(--text-main)]">
                      {doc.title}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-[var(--text-muted)]">
                      {doc.type}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-muted)]">
                    {doc.description}
                  </p>
                </div>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 text-[var(--primary)] hover:underline flex items-center gap-1 text-sm font-medium"
                >
                  View
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
