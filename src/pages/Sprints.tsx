import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  User, 
  Shield,
  ArrowLeft,
  ArrowRight,
  X
} from 'lucide-react';

// Types
interface PhaseChecklist {
  id: string;
  label: string;
}

interface Phase {
  id: string;
  week: 'A' | 'B';
  num: number;
  title: string;
  timebox: string;
  purpose: string;
  ownerHint: string;
  tags: string[];
  outputs: string[];
  exitCriteria: string[];
  checklist: PhaseChecklist[];
}

interface RoleAssignment {
  lead: string;
  challenger: string;
}

interface SprintConfig {
  currentPhase: number;
  sprintStartDate: string;
  rotation: {
    weekA: RoleAssignment;
    weekB: RoleAssignment;
  };
  checklistState: { [phaseId: string]: { [checklistId: string]: boolean } };
  phaseNotes: { [phaseId: string]: string };
}

// Phase data
const PHASES: Phase[] = [
  {
    id: 'p1',
    week: 'A',
    num: 1,
    title: 'LLM Research & Problem Narrowing',
    timebox: 'Days 1-2',
    purpose: 'Identify credible, specific SMB problems using LLM research tools before talking to humans.',
    ownerHint: 'Week Lead (Support: Challenger)',
    tags: ['research', 'segmentation', 'hypotheses'],
    outputs: [
      'Defined SMB segment (industry + size + operational context)',
      '2-3 candidate problems (observable + operational)',
      'Initial root-cause hypotheses',
    ],
    exitCriteria: [
      'Problems are specific and testable (not abstract)',
      'Challenger agrees they are plausible',
    ],
    checklist: [
      { id: 'c1', label: 'Segment defined (industry/size/context)' },
      { id: 'c2', label: '3 candidate problems written as symptoms' },
      { id: 'c3', label: 'Hypotheses noted (why it happens)' },
      { id: 'c4', label: 'Scope guardrails stated (what we will not solve)' },
    ],
  },
  {
    id: 'p2',
    week: 'A',
    num: 2,
    title: 'Public Research Share (Hypothesis Stage)',
    timebox: 'Day 3',
    purpose: 'Publish a short hypothesis to invite correction, discussion, and early leads (no selling).',
    ownerHint: 'Week Lead (Support: Challenger as editor)',
    tags: ['publish', 'signal', 'feedback'],
    outputs: [
      'One public artifact (post, bullets, diagram, or short note)',
      'Explicit questions for practitioners',
      'Clear "we might be wrong" framing',
    ],
    exitCriteria: [
      'Artifact is understandable by practitioners',
      'No product claims, no CTA to hire',
    ],
    checklist: [
      { id: 'c1', label: '1-page public post drafted' },
      { id: 'c2', label: '3 questions included for feedback' },
      { id: 'c3', label: 'No selling language' },
      { id: 'c4', label: 'Distribution plan (3 places)' },
    ],
  },
  {
    id: 'p3',
    week: 'A',
    num: 3,
    title: 'Ground Truth Validation',
    timebox: 'Days 4-5',
    purpose: 'Confirm the problem exists with real operators; decide to kill or commit.',
    ownerHint: 'Week Lead (Support: Challenger)',
    tags: ['interviews', 'validation', 'decision'],
    outputs: [
      '1-3 operator conversations (notes captured)',
      'Validated problem statement OR kill decision',
      'Top blockers + language used by operators',
    ],
    exitCriteria: [
      'At least one credible operator confirms the pain',
      'Decision Gate: pick ONE problem or kill',
    ],
    checklist: [
      { id: 'c1', label: '2 conversations scheduled' },
      { id: 'c2', label: 'Interview notes captured' },
      { id: 'c3', label: 'Problem statement rewritten in operator language' },
      { id: 'c4', label: 'Decision Gate completed (kill or pick one)' },
    ],
  },
  {
    id: 'p4',
    week: 'B',
    num: 4,
    title: 'Problem Lock & Solution Design',
    timebox: 'Days 6-7',
    purpose: 'Define exactly what will be built and what will not be built; freeze scope.',
    ownerHint: 'Week Lead (Challenger enforces scope)',
    tags: ['spec', 'design', 'freeze'],
    outputs: [
      'Final Problem Spec (1 page)',
      'Solution Spec (1 page) with workflow + data model',
      '"V1 is done when..." checklist',
    ],
    exitCriteria: [
      'Specs approved by both',
      'Scope frozen (no new features in Week B)',
    ],
    checklist: [
      { id: 'c1', label: 'Problem Spec complete' },
      { id: 'c2', label: 'Solution Spec complete' },
      { id: 'c3', label: 'Non-goals explicit' },
      { id: 'c4', label: 'Scope freeze declared' },
    ],
  },
  {
    id: 'p5',
    week: 'B',
    num: 5,
    title: 'Build the Opinionated Product',
    timebox: 'Days 8-11',
    purpose: 'Ship a real reference product for one workflow. Must demo end-to-end.',
    ownerHint: 'Week Lead (Support: Challenger)',
    tags: ['build', 'open-source', 'reference'],
    outputs: [
      'Working end-to-end system (happy path)',
      'Seed/demo data',
      'Setup instructions + README (who it is for / not for)',
    ],
    exitCriteria: [
      'Demoable in <30 minutes',
      'README clearly states boundaries',
    ],
    checklist: [
      { id: 'c1', label: 'Happy path implemented' },
      { id: 'c2', label: 'Seed data + demo script' },
      { id: 'c3', label: 'Setup steps documented' },
      { id: 'c4', label: 'README includes limits + non-goals' },
    ],
  },
  {
    id: 'p6',
    week: 'B',
    num: 6,
    title: 'Public Release & Solution Validation',
    timebox: 'Days 12-13',
    purpose: 'Validate whether operators would switch; collect blockers for next cycle.',
    ownerHint: 'Week Lead (Support: Challenger)',
    tags: ['release', 'feedback', 'iterate'],
    outputs: [
      '3-6 minute demo video',
      'Release post explaining problem, solution, limitations',
      'Structured feedback captured (blockers)',
    ],
    exitCriteria: [
      'At least 5 practitioner reactions (comments/DMs) or 2 deep threads',
      'Blockers list produced',
    ],
    checklist: [
      { id: 'c1', label: 'Demo video recorded' },
      { id: 'c2', label: 'Repo published with tags/releases' },
      { id: 'c3', label: 'Release post published' },
      { id: 'c4', label: 'Feedback captured in a log' },
    ],
  },
  {
    id: 'p7',
    week: 'B',
    num: 7,
    title: 'Commercial Engagements',
    timebox: 'Day 14',
    purpose: 'Convert engaged interest into paid setup/customization/ops without cold pitching.',
    ownerHint: 'Week Lead (Support: Challenger)',
    tags: ['offer', 'setup', 'pilots'],
    outputs: [
      'Pick ONE offer type: Setup OR Customization OR Ops',
      'Follow-ups only to engaged leads',
      'Pilot criteria + next steps',
    ],
    exitCriteria: [
      'Offer selected and messaged consistently',
      'At least 3 qualified conversations scheduled or 1 pilot agreed',
    ],
    checklist: [
      { id: 'c1', label: 'Offer type selected' },
      { id: 'c2', label: 'Message template finalized' },
      { id: 'c3', label: 'Engaged leads list created' },
      { id: 'c4', label: 'Calls scheduled / pilot defined' },
    ],
  },
];

const DEFAULT_SPRINT_CONFIG: SprintConfig = {
  currentPhase: 1,
  sprintStartDate: new Date().toISOString().split('T')[0],
  rotation: {
    weekA: { lead: 'Moaz', challenger: 'Ahmad' },
    weekB: { lead: 'Ahmad', challenger: 'Moaz' },
  },
  checklistState: {},
  phaseNotes: {},
};

const TEMPLATES = {
  problemSpec: {
    title: 'Problem Spec (1 page)',
    description: 'Used in Phase 1 (draft) and Phase 4 (final).',
    fields: [
      'Segment (industry + size + context)',
      'Persona (role + responsibilities)',
      'Observable symptoms (what is happening)',
      'Current workaround/tools',
      'Why it hurts (money/time/risk)',
      'Success criteria (measurable)',
      'Non-goals (explicitly out of scope)',
    ],
  },
  solutionSpec: {
    title: 'Solution Spec (1 page)',
    description: 'Used in Phase 4 to freeze scope.',
    fields: [
      'Opinionated workflow (happy path steps)',
      'Minimal data model (entities)',
      'UX surfaces (screens/pages)',
      'Automations/integrations (if any)',
      'Constraints (what we refuse to build in V1)',
      'V1 done-when checklist',
    ],
  },
  releasePost: {
    title: 'Release Post Outline',
    description: 'Used in Phase 6.',
    fields: [
      'The problem in operator language',
      'What fails with current tools',
      'What the product does (one workflow)',
      'What it does NOT do',
      'Demo link + repo link',
      'The validation question: "What would stop you from using this?"',
    ],
  },
};

export const Sprints = () => {
  const [config, setConfig] = useState<SprintConfig>(DEFAULT_SPRINT_CONFIG);
  const [showPhaseDetail, setShowPhaseDetail] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [localChecklistState, setLocalChecklistState] = useState<{ [key: string]: boolean }>({});
  const [phaseNote, setPhaseNote] = useState('');

  // Load config from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sprint-config');
    if (saved) {
      try {
        setConfig(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse sprint config', e);
      }
    }
  }, []);

  // Save config to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sprint-config', JSON.stringify(config));
  }, [config]);

  const currentPhase = PHASES.find(p => p.num === config.currentPhase) || PHASES[0];
  const currentWeek = currentPhase.week;
  const currentRoles = currentWeek === 'A' ? config.rotation.weekA : config.rotation.weekB;

  // Calculate completion percentage
  const totalChecks = currentPhase.checklist.length;
  const completedChecks = currentPhase.checklist.filter(
    c => config.checklistState[currentPhase.id]?.[c.id]
  ).length;
  const completionPct = totalChecks > 0 ? Math.round((completedChecks / totalChecks) * 100) : 0;

  // Get week A and B phases for progress bars
  const weekAPhases = PHASES.filter(p => p.week === 'A');
  const weekBPhases = PHASES.filter(p => p.week === 'B');

  const calculateWeekProgress = (phases: Phase[]) => {
    const total = phases.reduce((acc, p) => acc + p.checklist.length, 0);
    const completed = phases.reduce((acc, p) => {
      const done = p.checklist.filter(c => config.checklistState[p.id]?.[c.id]).length;
      return acc + done;
    }, 0);
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const weekAProgress = calculateWeekProgress(weekAPhases);
  const weekBProgress = calculateWeekProgress(weekBPhases);

  const handlePhaseChange = (direction: 'prev' | 'next') => {
    const newPhaseNum = direction === 'next' 
      ? Math.min(config.currentPhase + 1, 7)
      : Math.max(config.currentPhase - 1, 1);
    
    setConfig({ ...config, currentPhase: newPhaseNum });
  };

  const handleOpenPhaseDetail = () => {
    setShowPhaseDetail(true);
    setLocalChecklistState(config.checklistState[currentPhase.id] || {});
    setPhaseNote(config.phaseNotes[currentPhase.id] || '');
  };

  const handleSavePhaseDetail = () => {
    setConfig({
      ...config,
      checklistState: {
        ...config.checklistState,
        [currentPhase.id]: localChecklistState,
      },
      phaseNotes: {
        ...config.phaseNotes,
        [currentPhase.id]: phaseNote,
      },
    });
    setShowPhaseDetail(false);
  };

  const handleClosePhaseDetail = () => {
    setShowPhaseDetail(false);
  };

  const toggleChecklistItem = (checkId: string) => {
    setLocalChecklistState({
      ...localChecklistState,
      [checkId]: !localChecklistState[checkId],
    });
  };

  return (
    <div className="min-h-[80vh] animate-in fade-in duration-500">
      {/* Header */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1 w-12 bg-[var(--primary)]"></div>
          <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">
            2-Week Operating Cycle
          </span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl mb-4">Active Sprint</h1>
        <p className="text-lg text-[var(--text-muted)] max-w-2xl">
          Navigate phases one at a time. Each phase has clear outputs, exit criteria, and checklists to keep momentum focused.
        </p>
      </div>

      {/* Week Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Week A */}
        <div className={`border rounded-xl p-5 transition-all ${
          currentWeek === 'A' 
            ? 'border-[var(--primary)] bg-gradient-to-br from-blue-50/50 to-transparent' 
            : 'border-[var(--line-color)] bg-white'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg">Week A: Discovery</h3>
            {currentWeek === 'A' && (
              <span className="px-3 py-1 bg-[var(--primary)] text-white text-xs font-bold rounded-full">
                CURRENT
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Research → Public Share → Validation → Decision Gate
          </p>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-[var(--text-muted)]">Progress</span>
            <span className="text-xs font-bold ml-auto">{weekAProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[var(--primary)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${weekAProgress}%` }}
            />
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-sm">
            <div>
              <div className="text-xs text-[var(--text-muted)]">Lead</div>
              <div className="font-medium">{config.rotation.weekA.lead}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[var(--text-muted)]">Challenger</div>
              <div className="font-medium">{config.rotation.weekA.challenger}</div>
            </div>
          </div>
        </div>

        {/* Week B */}
        <div className={`border rounded-xl p-5 transition-all ${
          currentWeek === 'B' 
            ? 'border-[var(--secondary)] bg-gradient-to-br from-green-50/50 to-transparent' 
            : 'border-[var(--line-color)] bg-white'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-lg">Week B: Build & Release</h3>
            {currentWeek === 'B' && (
              <span className="px-3 py-1 bg-[var(--secondary)] text-white text-xs font-bold rounded-full">
                CURRENT
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Design Freeze → Build → Release → Commercial
          </p>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-[var(--text-muted)]">Progress</span>
            <span className="text-xs font-bold ml-auto">{weekBProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[var(--secondary)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${weekBProgress}%` }}
            />
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-sm">
            <div>
              <div className="text-xs text-[var(--text-muted)]">Lead</div>
              <div className="font-medium">{config.rotation.weekB.lead}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-[var(--text-muted)]">Challenger</div>
              <div className="font-medium">{config.rotation.weekB.challenger}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Phase Card */}
      <div className="border-2 border-[var(--text-main)] rounded-2xl p-6 md:p-8 mb-6 bg-white shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-gray-100 text-[var(--text-main)] text-xs font-bold rounded-full">
                PHASE {currentPhase.num} of 7
              </span>
              <span className="text-xs text-[var(--text-muted)]">{currentPhase.timebox}</span>
            </div>
            <h2 className="font-serif text-3xl mb-3">{currentPhase.title}</h2>
            <p className="text-lg text-[var(--text-muted)] leading-relaxed max-w-3xl">
              {currentPhase.purpose}
            </p>
          </div>
        </div>

        {/* Role assignment */}
        <div className="flex items-center gap-6 mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-sm font-medium">Lead:</span>
            <span className="text-sm font-bold">{currentRoles.lead}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[var(--secondary)]" />
            <span className="text-sm font-medium">Challenger:</span>
            <span className="text-sm font-bold">{currentRoles.challenger}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Phase Progress</span>
            <span className="text-sm font-bold">{completedChecks}/{totalChecks} complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-[var(--primary)] h-3 rounded-full transition-all duration-300 flex items-center justify-end pr-2"
              style={{ width: `${completionPct}%` }}
            >
              {completionPct > 10 && (
                <span className="text-[10px] font-bold text-white">{completionPct}%</span>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleOpenPhaseDetail}
            className="flex-1 min-w-[200px] bg-[var(--primary)] text-white px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            Enter Phase Details
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowTemplates(true)}
            className="border-2 border-[var(--text-main)] text-[var(--text-main)] px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-5 h-5" />
            Templates
          </button>
        </div>
      </div>

      {/* Phase Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => handlePhaseChange('prev')}
          disabled={config.currentPhase === 1}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--line-color)] hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Previous Phase</span>
        </button>
        
        <div className="flex gap-2">
          {PHASES.map(p => (
            <button
              key={p.id}
              onClick={() => setConfig({ ...config, currentPhase: p.num })}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                p.num === config.currentPhase
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={p.title}
            >
              {p.num}
            </button>
          ))}
        </div>

        <button
          onClick={() => handlePhaseChange('next')}
          disabled={config.currentPhase === 7}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--line-color)] hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span className="text-sm font-medium">Next Phase</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Phase Detail Modal */}
      {showPhaseDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleClosePhaseDetail}>
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  Phase {currentPhase.num} • {currentPhase.timebox}
                </div>
                <h3 className="font-serif text-2xl">{currentPhase.title}</h3>
              </div>
              <button
                onClick={handleClosePhaseDetail}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Purpose */}
              <div className="p-4 bg-blue-50 border-l-4 border-[var(--primary)] rounded">
                <div className="text-xs font-bold text-[var(--primary)] uppercase tracking-wider mb-1">
                  Purpose
                </div>
                <p className="text-sm leading-relaxed">{currentPhase.purpose}</p>
              </div>

              {/* Owner Hint */}
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Ownership
                </div>
                <p className="text-sm">{currentPhase.ownerHint}</p>
              </div>

              {/* Two columns: Outputs & Exit Criteria */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Outputs */}
                <div className="border border-[var(--line-color)] rounded-xl p-5">
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                    Required Outputs
                  </h4>
                  <ul className="space-y-2">
                    {currentPhase.outputs.map((output, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-[var(--primary)] mt-1">•</span>
                        <span className="flex-1">{output}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exit Criteria */}
                <div className="border border-[var(--line-color)] rounded-xl p-5">
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-[var(--secondary)]" />
                    Exit Criteria
                  </h4>
                  <ul className="space-y-2">
                    {currentPhase.exitCriteria.map((criteria, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-[var(--secondary)] mt-1">→</span>
                        <span className="flex-1">{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Checklist */}
              <div className="border-2 border-[var(--text-main)] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold">Phase Checklist</h4>
                  <span className="text-sm text-[var(--text-muted)]">
                    {Object.values(localChecklistState).filter(Boolean).length}/{currentPhase.checklist.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {currentPhase.checklist.map(item => (
                    <label
                      key={item.id}
                      className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={!!localChecklistState[item.id]}
                        onChange={() => toggleChecklistItem(item.id)}
                        className="mt-0.5 w-5 h-5 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                      />
                      <span className="flex-1 text-sm leading-snug">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Phase Notes */}
              <div className="border border-[var(--line-color)] rounded-xl p-5">
                <h4 className="font-bold mb-3">Phase Notes</h4>
                <p className="text-xs text-[var(--text-muted)] mb-3">
                  Track decisions, links, blockers, and follow-ups for this phase.
                </p>
                <textarea
                  value={phaseNote}
                  onChange={(e) => setPhaseNote(e.target.value)}
                  placeholder="e.g., Decision: Target airport transfer operators 10-20 fleet size&#10;Blockers: OTA integration, payment processing&#10;Links: [research doc]"
                  className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex items-center justify-between gap-4">
              <button
                onClick={handleClosePhaseDetail}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePhaseDetail}
                className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowTemplates(false)}>
          <div 
            className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl">Phase Templates</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  Standard formats to keep outputs consistent and prevent scope drift
                </p>
              </div>
              <button
                onClick={() => setShowTemplates(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Template Cards */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.values(TEMPLATES).map((template, idx) => (
                <div key={idx} className="border border-[var(--line-color)] rounded-xl p-5">
                  <h4 className="font-bold mb-2">{template.title}</h4>
                  <p className="text-xs text-[var(--text-muted)] mb-4">{template.description}</p>
                  <ul className="space-y-2">
                    {template.fields.map((field, fieldIdx) => (
                      <li key={fieldIdx} className="flex items-start gap-2 text-sm">
                        <span className="text-[var(--primary)] mt-0.5">→</span>
                        <span className="flex-1 text-xs">{field}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex justify-end">
              <button
                onClick={() => setShowTemplates(false)}
                className="px-6 py-2 bg-[var(--primary)] text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
