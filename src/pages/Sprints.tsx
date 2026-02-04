import { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  User, 
  Shield,
  X,
  Search,
  Share2,
  CheckSquare,
  Layout,
  Zap,
  Rocket,
  Briefcase
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
} 

// Phase data
const PHASES: Phase[] = [
  {
    id: 'p1',
    week: 'A',
    num: 1,
    title: 'Hypothesis Research',
    timebox: 'Days 1-2',
    purpose: 'Identify credible, specific SMB problems through research (data analysis, scraping, LLM tools, interviews) before committing to a direction.',
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
    title: 'Public Research Share',
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
    title: 'Validation',
    timebox: 'Days 4-5',
    purpose: 'Gather validation signal (data, conversations, or other); run an internal triage to decide: commit to one problem or kill.',
    ownerHint: 'Week Lead (Support: Challenger)',
    tags: ['validation', 'decision', 'triage'],
    outputs: [
      'Validation output (e.g. scraped/data, one operator conversation, or other)—notes or summary captured',
      'Internal triage conversation: review validation output and decide commit or kill',
      'Validated problem statement OR kill decision (if kill: document why + add to backlog)',
    ],
    exitCriteria: [
      'Internal triage completed (both cofounders)',
      'Decision Gate: pick ONE problem and proceed to Phase 4, OR kill (document 1–2 sentences why + add card to backlog)',
    ],
    checklist: [
      { id: 'c1', label: 'Validation output gathered (data, conversation(s), or other) and summarized' },
      { id: 'c2', label: 'Internal triage conversation held to review validation' },
      { id: 'c3', label: 'Decision: commit to one problem OR kill' },
      { id: 'c4', label: 'If kill: 1–2 sentence reason documented and card added to backlog (e.g. Trello)' },
    ],
  },
  {
    id: 'p4',
    week: 'B',
    num: 4,
    title: 'Problem Lock & Design',
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
    title: 'Build the Solution',
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
    title: 'Public Release',
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
    title: 'Commercial',
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
  {
    id: 'p8',
    week: 'B',
    num: 8,
    title: 'Knowledge Freeze',
    timebox: '30–45 min',
    purpose: 'Make the sprint compound by capturing what was learned; close the cycle and prepare for next iteration.',
    ownerHint: 'Both (joint reflection)',
    tags: ['reflection', 'learning', 'archive'],
    outputs: [
      '1-page reflection document',
      'Sprint notes archived',
      'Learned insights documented for future reference',
    ],
    exitCriteria: [
      'All key learnings documented',
      'Repo and notes archived',
      'Team agrees on what to test next cycle',
    ],
    checklist: [
      { id: 'c1', label: 'What was confirmed (validated assumptions)' },
      { id: 'c2', label: 'What was wrong (invalidated assumptions)' },
      { id: 'c3', label: 'What generalized (broader insights)' },
      { id: 'c4', label: 'What didn\'t (failed experiments / blockers)' },
      { id: 'c5', label: 'What to test next (prioritized experiments)' },
      { id: 'c6', label: 'Repo archived with tags' },
      { id: 'c7', label: 'Sprint notes consolidated and stored' },
      { id: 'c8', label: 'Team alignment: next sprint hypothesis ready' },
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
  const [showTemplates, setShowTemplates] = useState(false);

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
        <h1 className="font-serif text-4xl md:text-5xl mb-4">Sprint Cycle Navigator</h1>
        <p className="text-lg text-[var(--text-muted)] max-w-3xl">
          A structured 14-day cycle alternating between discovery validation (Week A) and execution (Week B). 
          Public-first approach with clear decision gates to kill bad ideas fast and double down on validated opportunities.
        </p>
      </div>

      {/* Visual Process Flow */}
      <div className="mb-8 border-2 border-[var(--line-color)] rounded-2xl p-8 bg-white">        
        {/* Week A & B Headers */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-transparent rounded-xl border-2 border-blue-200">
            <h3 className="font-bold text-lg mb-1">Week A: Discovery</h3>
            <p className="text-sm text-[var(--text-muted)]">Research → Validate → Decide</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-transparent rounded-xl border-2 border-green-200">
            <h3 className="font-bold text-lg mb-1">Week B: Execution</h3>
            <p className="text-sm text-[var(--text-muted)]">Design → Build → Release → Convert</p>
          </div>
        </div>

        {/* Phase Flow Visualization */}
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-300 via-purple-300 to-green-300 hidden md:block" 
               style={{ zIndex: 0 }}></div>
          
          {/* Phases */}
          <div className="grid grid-cols-2 md:grid-cols-7 gap-3 relative" style={{ zIndex: 1 }}>
            {PHASES.map((phase) => {
              const PhaseIcon = {
                1: Search,
                2: Share2,
                3: CheckSquare,
                4: Layout,
                5: Zap,
                6: Rocket,
                7: Briefcase
              }[phase.num] || Search;

              return (
                <div key={phase.id} className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all mb-2 ${
                      phase.week === 'A'
                        ? 'bg-blue-100 border-2 border-blue-300'
                        : 'bg-green-100 border-2 border-green-300'
                    }`}
                  >
                    <PhaseIcon className={`w-7 h-7 ${
                      phase.week === 'A' ? 'text-blue-600' : 'text-green-600'
                    }`} />
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] font-bold text-[var(--text-muted)] mb-1">
                      {`Phase ${phase.num}`}
                    </div>
                    <div className="text-xs font-medium leading-tight max-w-[140px] whitespace-normal break-words">
                      {phase.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-300"></div>
            <span className="text-[var(--text-muted)]">Week A: Discovery</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-100 border-2 border-green-300"></div>
            <span className="text-[var(--text-muted)]">Week B: Execution</span>
          </div>
        </div>
      </div>

      {/* Methodology Overview - Collapsible */}
      <details className="mb-8 border-2 border-[var(--primary)] rounded-xl overflow-hidden">
        <summary className="cursor-pointer bg-gradient-to-r from-blue-50 to-transparent p-5 font-bold text-lg flex items-center justify-between hover:bg-blue-100/50 transition-colors">
          <span className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-sm font-bold">?</span>
            Why This Process Works
          </span>
          <ChevronRight className="w-5 h-5 transform transition-transform" />
        </summary>
        <div className="p-6 bg-white space-y-4 border-t border-[var(--primary)]/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-bold text-[var(--primary)] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs">1</span>
                Public Research First (Days 1-3)
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Unlike traditional stealth mode, sharing early hypotheses publicly serves three purposes: (1) attracts corrections from practitioners who know the domain better, (2) generates inbound leads who self-identify with the problem, and (3) builds credibility as domain experts before pitching solutions.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-bold text-[var(--primary)] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs">2</span>
                Mandatory Decision Gate (Day 5)
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Week A ends with a binary choice: kill or commit. Validation output can be scraped data, one conversation, or something else—you run an internal triage (both cofounders) to decide. If you kill: document 1–2 sentences why and add a card to the backlog (e.g. Trello); next cycle starts at Phase 1. This gate prevents endless research.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-[var(--secondary)] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--secondary)] text-white flex items-center justify-center text-xs">3</span>
                Scope Freeze Before Build (Days 6-7)
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Phase 4 locks the problem spec and solution design. Once Week B starts, no new features are allowed. This constraint forces clarity: what's V1 vs. what's out of scope. The Challenger role enforces this boundary—if scope creeps, they can halt the sprint.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-bold text-[var(--secondary)] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[var(--secondary)] text-white flex items-center justify-center text-xs">4</span>
                Demo-First, Not Code-First (Days 8-13)
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                The goal is a working demo for one opinionated workflow—not a generic platform. Constraints are explicit in the README. This approach validates willingness to switch tools (not hypothetical interest). Feedback from this release seeds the next cycle's backlog.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-sm font-medium text-yellow-900 mb-2">🎯 Key Success Metric</p>
            <p className="text-sm text-yellow-800">
              The cycle succeeds if it produces <strong>one clear kill decision OR one validated product release every 2 weeks</strong>. 
              Failure mode: spending &gt;2 weeks on research without shipping or killing. Role rotation prevents one person's attachment from stalling progress.
            </p>
          </div>
        </div>
      </details>

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

      {/* Two-Column Layout: Phases List + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Left Column: All Phases */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl">All Phases</h2>
            <button
              onClick={() => setShowTemplates(true)}
              className="text-xs flex items-center gap-1 text-[var(--primary)] hover:underline"
            >
              <FileText className="w-3 h-3" />
              Templates
            </button>
          </div>
          
          {PHASES.map((phase) => {
            const isActive = phase.num === config.currentPhase;
            const phaseChecks = phase.checklist.length;
            const phaseCompleted = phase.checklist.filter(c => config.checklistState[phase.id]?.[c.id]).length;
            const phasePct = phaseChecks > 0 ? Math.round((phaseCompleted / phaseChecks) * 100) : 0;
            const isComplete = phasePct === 100;

            return (
              <button
                key={phase.id}
                onClick={() => setConfig({ ...config, currentPhase: phase.num })}
                className={`w-full text-left border-2 rounded-xl p-4 transition-all hover:shadow-md ${
                  isActive 
                    ? 'border-[var(--primary)] bg-blue-50/50 shadow-md' 
                    : isComplete
                    ? 'border-green-300 bg-green-50/30'
                    : 'border-[var(--line-color)] bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    isActive 
                      ? 'bg-[var(--primary)] text-white' 
                      : isComplete
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {isComplete ? <CheckCircle2 className="w-5 h-5" /> : phase.num}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-sm truncate">{phase.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        phase.week === 'A' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        Week {phase.week}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)]">{phase.timebox}</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          isComplete ? 'bg-green-500' : 'bg-[var(--primary)]'
                        }`}
                        style={{ width: `${phasePct}%` }}
                      />
                    </div>
                    
                    <div className="text-[10px] text-[var(--text-muted)]">
                      {phaseCompleted}/{phaseChecks} items • {phasePct}%
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Active Phase Details */}
        <div className="lg:col-span-8">
          {(() => {
            const phase = PHASES.find(p => p.num === config.currentPhase) || PHASES[0];
            const phaseChecks = phase.checklist.length;
            const phaseCompleted = phase.checklist.filter(c => config.checklistState[phase.id]?.[c.id]).length;
            const phasePct = phaseChecks > 0 ? Math.round((phaseCompleted / phaseChecks) * 100) : 0;

            return (
              <div className="border-2 border-[var(--primary)] rounded-2xl overflow-hidden bg-white">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-transparent p-6 border-b border-[var(--primary)]/20">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-[var(--primary)] text-white text-xs font-bold rounded-full">
                          PHASE {phase.num} of 7
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          phase.week === 'A' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          Week {phase.week} • {phase.timebox}
                        </span>
                      </div>
                      <h2 className="font-serif text-3xl mb-2">{phase.title}</h2>
                      <p className="text-base text-[var(--text-muted)] leading-relaxed">
                        {phase.purpose}
                      </p>
                    </div>
                  </div>

                  {/* Role Assignment */}
                  <div className="flex items-center gap-6 p-3 bg-white rounded-lg">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[var(--primary)]" />
                      <span className="text-sm font-medium">Lead:</span>
                      <span className="text-sm font-bold">
                        {phase.week === 'A' ? config.rotation.weekA.lead : config.rotation.weekB.lead}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[var(--secondary)]" />
                      <span className="text-sm font-medium">Challenger:</span>
                      <span className="text-sm font-bold">
                        {phase.week === 'A' ? config.rotation.weekA.challenger : config.rotation.weekB.challenger}
                      </span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Phase Progress</span>
                      <span className="text-sm font-bold">{phaseCompleted}/{phaseChecks} complete ({phasePct}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-[var(--primary)] h-3 rounded-full transition-all duration-300"
                        style={{ width: `${phasePct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Outputs & Exit Criteria */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold mb-3 text-sm uppercase tracking-wide text-[var(--text-muted)] flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />
                        Required Outputs
                      </h4>
                      <ul className="space-y-2">
                        {phase.outputs.map((output, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm pl-6">
                            <span className="text-[var(--primary)]">•</span>
                            <span>{output}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold mb-3 text-sm uppercase tracking-wide text-[var(--text-muted)] flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-[var(--secondary)]" />
                        Exit Criteria
                      </h4>
                      <ul className="space-y-2">
                        {phase.exitCriteria.map((criteria, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm pl-6">
                            <span className="text-[var(--secondary)]">→</span>
                            <span>{criteria}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Checklist */}
                  <div className="border-t pt-6">
                    <h4 className="font-bold mb-4 text-sm uppercase tracking-wide text-[var(--text-muted)]">
                      Phase Checklist
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {phase.checklist.map(item => (
                        <label
                          key={item.id}
                          className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={!!config.checklistState[phase.id]?.[item.id]}
                            onChange={() => {
                              setConfig({
                                ...config,
                                checklistState: {
                                  ...config.checklistState,
                                  [phase.id]: {
                                    ...(config.checklistState[phase.id] || {}),
                                    [item.id]: !config.checklistState[phase.id]?.[item.id],
                                  },
                                },
                              });
                            }}
                            className="mt-0.5 w-5 h-5 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                          />
                          <span className="flex-1 text-sm leading-snug">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>


                </div>
              </div>
            );
          })()}
        </div>
      </div>

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
