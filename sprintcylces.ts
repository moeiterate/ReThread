import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Compass,
  FileText,
  Flame,
  Github,
  HelpCircle,
  LayoutGrid,
  Lock,
  Megaphone,
  MessageSquare,
  Shield,
  Sparkles,
  Timer,
  Users,
  Wrench,
} from "lucide-react";

/**
 * Rethread Operating Cycle UI
 * - Interactive, low-overload navigation
 * - Week-based role rotation
 * - Phase drill-down with outputs, exit criteria, and checklists
 */

const weeks = {
  A: {
    key: "A",
    name: "Week A",
    subtitle: "Discovery & Public Research",
    gradient: "from-indigo-500/20 via-sky-500/10 to-transparent",
    icon: Compass,
  },
  B: {
    key: "B",
    name: "Week B",
    subtitle: "Solution, Product, Release",
    gradient: "from-emerald-500/20 via-lime-500/10 to-transparent",
    icon: Wrench,
  },
};

const phaseDefs = [
  {
    id: "p1",
    week: "A",
    num: 1,
    title: "LLM Research & Problem Narrowing",
    timebox: "Days 1–2",
    purpose:
      "Identify credible, specific SMB problems using LLM research tools before talking to humans.",
    ownerHint: "Week Lead (Support: Challenger)",
    tags: ["research", "segmentation", "hypotheses"],
    icon: Sparkles,
    outputs: [
      "Defined SMB segment (industry + size + operational context)",
      "2–3 candidate problems (observable + operational)",
      "Initial root-cause hypotheses",
    ],
    exitCriteria: [
      "Problems are specific and testable (not abstract)",
      "Challenger agrees they’re plausible",
    ],
    checklist: [
      { id: "c1", label: "Segment defined (industry/size/context)" },
      { id: "c2", label: "3 candidate problems written as symptoms" },
      { id: "c3", label: "Hypotheses noted (why it happens)" },
      { id: "c4", label: "Scope guardrails stated (what we won’t solve)" },
    ],
  },
  {
    id: "p2",
    week: "A",
    num: 2,
    title: "Public Research Share (Hypothesis Stage)",
    timebox: "Day 3",
    purpose:
      "Publish a short hypothesis to invite correction, discussion, and early leads (no selling).",
    ownerHint: "Week Lead (Support: Challenger as editor)",
    tags: ["publish", "signal", "feedback"],
    icon: Megaphone,
    outputs: [
      "One public artifact (post, bullets, diagram, or short note)",
      "Explicit questions for practitioners",
      "Clear ‘we might be wrong’ framing",
    ],
    exitCriteria: [
      "Artifact is understandable by practitioners",
      "No product claims, no CTA to hire",
    ],
    checklist: [
      { id: "c1", label: "1-page public post drafted" },
      { id: "c2", label: "3 questions included for feedback" },
      { id: "c3", label: "No selling language" },
      { id: "c4", label: "Distribution plan (3 places)" },
    ],
  },
  {
    id: "p3",
    week: "A",
    num: 3,
    title: "Ground Truth Validation",
    timebox: "Days 4–5",
    purpose:
      "Confirm the problem exists with real operators; decide to kill or commit.",
    ownerHint: "Week Lead (Support: Challenger)",
    tags: ["interviews", "validation", "decision"],
    icon: Users,
    outputs: [
      "1–3 operator conversations (notes captured)",
      "Validated problem statement OR kill decision",
      "Top blockers + language used by operators",
    ],
    exitCriteria: [
      "At least one credible operator confirms the pain",
      "Decision Gate: pick ONE problem or kill",
    ],
    checklist: [
      { id: "c1", label: "2 conversations scheduled" },
      { id: "c2", label: "Interview notes captured" },
      { id: "c3", label: "Problem statement rewritten in operator language" },
      { id: "c4", label: "Decision Gate completed (kill or pick one)" },
    ],
  },
  {
    id: "p4",
    week: "B",
    num: 4,
    title: "Problem Lock & Solution Design",
    timebox: "Days 6–7",
    purpose:
      "Define exactly what will be built and what will not be built; freeze scope.",
    ownerHint: "Week Lead (Challenger enforces scope)",
    tags: ["spec", "design", "freeze"],
    icon: FileText,
    outputs: [
      "Final Problem Spec (1 page)",
      "Solution Spec (1 page) with workflow + data model",
      "‘V1 is done when…’ checklist",
    ],
    exitCriteria: [
      "Specs approved by both",
      "Scope frozen (no new features in Week B)",
    ],
    checklist: [
      { id: "c1", label: "Problem Spec complete" },
      { id: "c2", label: "Solution Spec complete" },
      { id: "c3", label: "Non-goals explicit" },
      { id: "c4", label: "Scope freeze declared" },
    ],
  },
  {
    id: "p5",
    week: "B",
    num: 5,
    title: "Build the Opinionated Product",
    timebox: "Days 8–11",
    purpose:
      "Ship a real reference product for one workflow. Must demo end-to-end.",
    ownerHint: "Week Lead (Support: Challenger)",
    tags: ["build", "open-source", "reference"],
    icon: Github,
    outputs: [
      "Working end-to-end system (happy path)",
      "Seed/demo data",
      "Setup instructions + README (who it’s for / not for)",
    ],
    exitCriteria: [
      "Demoable in <30 minutes",
      "README clearly states boundaries",
    ],
    checklist: [
      { id: "c1", label: "Happy path implemented" },
      { id: "c2", label: "Seed data + demo script" },
      { id: "c3", label: "Setup steps documented" },
      { id: "c4", label: "README includes limits + non-goals" },
    ],
  },
  {
    id: "p6",
    week: "B",
    num: 6,
    title: "Public Release & Solution Validation",
    timebox: "Days 12–13",
    purpose:
      "Validate whether operators would switch; collect blockers for next cycle.",
    ownerHint: "Week Lead (Support: Challenger)",
    tags: ["release", "feedback", "iterate"],
    icon: MessageSquare,
    outputs: [
      "3–6 minute demo video",
      "Release post explaining problem, solution, limitations",
      "Structured feedback captured (blockers)",
    ],
    exitCriteria: [
      "At least 5 practitioner reactions (comments/DMs) or 2 deep threads",
      "Blockers list produced",
    ],
    checklist: [
      { id: "c1", label: "Demo video recorded" },
      { id: "c2", label: "Repo published with tags/releases" },
      { id: "c3", label: "Release post published" },
      { id: "c4", label: "Feedback captured in a log" },
    ],
  },
  {
    id: "p7",
    week: "B",
    num: 7,
    title: "Commercial Engagements",
    timebox: "Day 14",
    purpose:
      "Convert engaged interest into paid setup/customization/ops without cold pitching.",
    ownerHint: "Week Lead (Support: Challenger)",
    tags: ["offer", "setup", "pilots"],
    icon: ClipboardList,
    outputs: [
      "Pick ONE offer type: Setup OR Customization OR Ops",
      "Follow-ups only to engaged leads",
      "Pilot criteria + next steps",
    ],
    exitCriteria: [
      "Offer selected and messaged consistently",
      "At least 3 qualified conversations scheduled or 1 pilot agreed",
    ],
    checklist: [
      { id: "c1", label: "Offer type selected" },
      { id: "c2", label: "Message template finalized" },
      { id: "c3", label: "Engaged leads list created" },
      { id: "c4", label: "Calls scheduled / pilot defined" },
    ],
  },
];

const principles = [
  { icon: Lock, title: "One problem", desc: "No parallel tracks per cycle." },
  { icon: Shield, title: "Public-by-default", desc: "Share research early to attract correction." },
  { icon: Flame, title: "Opinionated", desc: "Strong constraints beat generic automation." },
  { icon: Timer, title: "Timeboxed", desc: "2-week default; kill fast." },
];

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
      {children}
    </span>
  );
}

function PhaseMini({ phase, active, onClick }) {
  const Icon = phase.icon;
  return (
    <button
      onClick={onClick}
      className={`group w-full text-left rounded-2xl border p-3 transition-all hover:shadow-sm ${
        active ? "bg-accent/40 border-accent" : "bg-background"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-0.5 rounded-xl border p-2 ${active ? "bg-background" : "bg-muted/30"}`}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate font-medium">
              {phase.num}. {phase.title}
            </div>
            <Badge variant={phase.week === "A" ? "secondary" : "outline"}>
              {phase.timebox}
            </Badge>
          </div>
          <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {phase.purpose}
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            {phase.tags.slice(0, 3).map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
          </div>
        </div>
        <ArrowRight className={`h-4 w-4 mt-1 opacity-40 group-hover:opacity-70`} />
      </div>
    </button>
  );
}

function Checklist({ phase, state, setState }) {
  const items = phase.checklist || [];
  const done = items.filter((i) => state[i.id]).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          Checklist
          <span className="text-sm text-muted-foreground">{done}/{items.length}</span>
        </CardTitle>
        <CardDescription>Use this to keep the phase tight and measurable.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={pct} />
        <div className="space-y-2">
          {items.map((it) => (
            <label
              key={it.id}
              className="flex items-start gap-2 rounded-xl border p-2 hover:bg-muted/20"
            >
              <Checkbox
                checked={!!state[it.id]}
                onCheckedChange={(v) =>
                  setState((s) => ({ ...s, [it.id]: Boolean(v) }))
                }
                className="mt-0.5"
              />
              <div className="text-sm leading-snug">{it.label}</div>
            </label>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RoleSwitcher({ weekKey, rotation, setRotation }) {
  const isWeekA = weekKey === "A";
  const lead = isWeekA ? rotation.weekA.lead : rotation.weekB.lead;
  const challenger = isWeekA ? rotation.weekA.challenger : rotation.weekB.challenger;

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <LayoutGrid className="h-4 w-4" /> Weekly Roles
        </CardTitle>
        <CardDescription>
          Roles rotate weekly. Lead has final calls for the week; Challenger pressure-tests.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-2xl border p-3">
            <div className="text-xs text-muted-foreground">Week A Lead</div>
            <div className="mt-1 font-medium">{rotation.weekA.lead}</div>
            <div className="mt-2 text-xs text-muted-foreground">Week A Challenger</div>
            <div className="mt-1 font-medium">{rotation.weekA.challenger}</div>
          </div>
          <div className="rounded-2xl border p-3">
            <div className="text-xs text-muted-foreground">Week B Lead</div>
            <div className="mt-1 font-medium">{rotation.weekB.lead}</div>
            <div className="mt-2 text-xs text-muted-foreground">Week B Challenger</div>
            <div className="mt-1 font-medium">{rotation.weekB.challenger}</div>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border p-3">
          <div className="space-y-1">
            <div className="text-sm font-medium">Swap roles next cycle</div>
            <div className="text-xs text-muted-foreground">
              Toggles who leads Week A vs Week B.
            </div>
          </div>
          <Switch
            checked={rotation.swap}
            onCheckedChange={(v) => {
              setRotation((r) => {
                if (!v) return { ...r, swap: false };
                // Swap week assignments
                return {
                  swap: true,
                  weekA: { ...r.weekB },
                  weekB: { ...r.weekA },
                };
              });
            }}
          />
        </div>

        <div className="text-xs text-muted-foreground">
          Tip: keep the names here updated at the start of each cycle.
        </div>
      </CardContent>
    </Card>
  );
}

function PhaseDetail({ phase, rotation, onOpenTemplate }) {
  const Icon = phase.icon;
  const weekMeta = weeks[phase.week];
  const WeekIcon = weekMeta.icon;

  const ownerText = (() => {
    // Owner mapping derived from week lead
    const leadName = phase.week === "A" ? rotation.weekA.lead : rotation.weekB.lead;
    const challengerName =
      phase.week === "A" ? rotation.weekA.challenger : rotation.weekB.challenger;
    return {
      leadName,
      challengerName,
    };
  })();

  return (
    <motion.div
      key={phase.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      <Card className="rounded-2xl overflow-hidden">
        <div className={`h-24 bg-gradient-to-r ${weekMeta.gradient}`} />
        <CardHeader className="-mt-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border bg-background p-3 shadow-sm">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  Phase {phase.num}: {phase.title}
                </CardTitle>
                <CardDescription className="mt-1 max-w-2xl">
                  {phase.purpose}
                </CardDescription>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge variant={phase.week === "A" ? "secondary" : "outline"}>
                    {phase.timebox}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <WeekIcon className="h-3.5 w-3.5" />
                    {weekMeta.name}
                  </Badge>
                  {phase.tags.map((t) => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
              </div>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" className="rounded-2xl" onClick={onOpenTemplate}>
                    <FileText className="h-4 w-4 mr-2" /> Templates
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Phase templates for quick, consistent execution.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-2xl border p-3">
              <div className="text-xs text-muted-foreground">Week Lead</div>
              <div className="mt-1 font-medium">{ownerText.leadName}</div>
              <div className="mt-2 text-xs text-muted-foreground">Week Challenger</div>
              <div className="mt-1 font-medium">{ownerText.challengerName}</div>
            </div>
            <div className="rounded-2xl border p-3 md:col-span-2">
              <div className="text-xs text-muted-foreground">Owner guidance</div>
              <div className="mt-1 text-sm">{phase.ownerHint}</div>
              <div className="mt-2 text-xs text-muted-foreground">
                Lead drives decisions; Challenger enforces constraints and pressure-tests.
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Required Outputs</CardTitle>
                <CardDescription>What must exist by the end of this phase.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {phase.outputs.map((o) => (
                    <li key={o} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 opacity-70" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Exit Criteria</CardTitle>
                <CardDescription>Conditions for moving to the next phase.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {phase.exitCriteria.map((e) => (
                    <li key={e} className="flex items-start gap-2 text-sm">
                      <ArrowRight className="h-4 w-4 mt-0.5 opacity-60" />
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TemplateDialog({ open, onOpenChange }) {
  const templates = [
    {
      title: "Problem Spec (1 page)",
      desc: "Used in Phase 1 (draft) and Phase 4 (final).",
      fields: [
        "Segment (industry + size + context)",
        "Persona (role + responsibilities)",
        "Observable symptoms (what’s happening)",
        "Current workaround/tools",
        "Why it hurts (money/time/risk)",
        "Success criteria (measurable)",
        "Non-goals (explicitly out of scope)",
      ],
    },
    {
      title: "Solution Spec (1 page)",
      desc: "Used in Phase 4 to freeze scope.",
      fields: [
        "Opinionated workflow (happy path steps)",
        "Minimal data model (entities)",
        "UX surfaces (screens/pages)",
        "Automations/integrations (if any)",
        "Constraints (what we refuse to build in V1)",
        "V1 done-when checklist",
      ],
    },
    {
      title: "Release Post Outline",
      desc: "Used in Phase 6.",
      fields: [
        "The problem in operator language",
        "What fails with current tools",
        "What the product does (one workflow)",
        "What it does NOT do",
        "Demo link + repo link",
        "The validation question: ‘What would stop you from using this?’",
      ],
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl rounded-2xl">
        <DialogHeader>
          <DialogTitle>Phase Templates</DialogTitle>
          <DialogDescription>
            Use these templates to keep output consistent and prevent scope drift.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {templates.map((t) => (
            <Card key={t.title} className="rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t.title}</CardTitle>
                <CardDescription>{t.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {t.fields.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5 opacity-60" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" className="rounded-2xl" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function RethreadCycleUI() {
  const [activeWeek, setActiveWeek] = useState("A");
  const [activePhaseId, setActivePhaseId] = useState("p1");
  const [search, setSearch] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);

  const [rotation, setRotation] = useState({
    swap: false,
    weekA: { lead: "You", challenger: "Moaz" },
    weekB: { lead: "Moaz", challenger: "You" },
  });

  const [checkState, setCheckState] = useState({
    p1: {},
    p2: {},
    p3: {},
    p4: {},
    p5: {},
    p6: {},
    p7: {},
  });

  const phasesForWeek = useMemo(() => {
    const list = phaseDefs.filter((p) => p.week === activeWeek);
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((p) => {
      const blob = `${p.title} ${p.purpose} ${p.tags.join(" ")}`.toLowerCase();
      return blob.includes(q);
    });
  }, [activeWeek, search]);

  const activePhase = useMemo(
    () => phaseDefs.find((p) => p.id === activePhaseId) || phaseDefs[0],
    [activePhaseId]
  );

  const weekProgress = useMemo(() => {
    const ids = phaseDefs.filter((p) => p.week === activeWeek).map((p) => p.id);
    const totals = ids.map((id) => {
      const phase = phaseDefs.find((p) => p.id === id);
      const items = phase?.checklist?.length || 0;
      const done = Object.values(checkState[id] || {}).filter(Boolean).length;
      return { items, done };
    });
    const items = totals.reduce((a, b) => a + b.items, 0);
    const done = totals.reduce((a, b) => a + b.done, 0);
    return { items, done, pct: items ? Math.round((done / items) * 100) : 0 };
  }, [activeWeek, checkState]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2">
                <Badge variant="outline" className="rounded-full">
                  Internal Process
                </Badge>
                <Badge className="rounded-full" variant="secondary">
                  2-week cycle
                </Badge>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">Rethread Cycle Navigator</h1>
              <p className="max-w-2xl text-sm text-muted-foreground">
                A lightweight UI to navigate phases, roles, outputs, exit criteria, and checklists—
                without information overload.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={() => setShowTemplates(true)}
              >
                <FileText className="h-4 w-4 mr-2" /> Templates
              </Button>
              <Button
                className="rounded-2xl"
                onClick={() => {
                  // jump to decision gate phase depending on week
                  setActiveWeek("A");
                  setActivePhaseId("p3");
                }}
              >
                <ClipboardList className="h-4 w-4 mr-2" /> Decision Gate
              </Button>
            </div>
          </div>

          {/* Principles */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {principles.map((p) => {
              const I = p.icon;
              return (
                <Card key={p.title} className="rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <I className="h-4 w-4" /> {p.title}
                    </CardTitle>
                    <CardDescription className="text-xs">{p.desc}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          {/* Main */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left rail */}
            <div className="lg:col-span-4 space-y-4">
              <Tabs value={activeWeek} onValueChange={setActiveWeek}>
                <TabsList className="grid grid-cols-2 rounded-2xl">
                  <TabsTrigger value="A" className="rounded-2xl">Week A</TabsTrigger>
                  <TabsTrigger value="B" className="rounded-2xl">Week B</TabsTrigger>
                </TabsList>
                <TabsContent value="A" className="mt-3">
                  <Card className="rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Discovery</CardTitle>
                      <CardDescription>
                        Research → public share → real-world validation → decision gate.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">Week progress</div>
                        <div className="text-xs text-muted-foreground">
                          {weekProgress.done}/{weekProgress.items}
                        </div>
                      </div>
                      <Progress value={weekProgress.pct} />
                      <div className="flex items-center gap-2">
                        <Input
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search phases (e.g., validation)"
                          className="rounded-2xl"
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                className="rounded-2xl"
                                onClick={() => setSearch("")}
                              >
                                Clear
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Clear the filter</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="space-y-2">
                        {phasesForWeek.map((p) => (
                          <PhaseMini
                            key={p.id}
                            phase={p}
                            active={p.id === activePhaseId}
                            onClick={() => setActivePhaseId(p.id)}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="B" className="mt-3">
                  <Card className="rounded-2xl">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Build & Release</CardTitle>
                      <CardDescription>
                        Design freeze → build → release → engaged follow-ups.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">Week progress</div>
                        <div className="text-xs text-muted-foreground">
                          {weekProgress.done}/{weekProgress.items}
                        </div>
                      </div>
                      <Progress value={weekProgress.pct} />
                      <div className="flex items-center gap-2">
                        <Input
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder="Search phases (e.g., release)"
                          className="rounded-2xl"
                        />
                        <Button
                          variant="outline"
                          className="rounded-2xl"
                          onClick={() => setSearch("")}
                        >
                          Clear
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {phasesForWeek.map((p) => (
                          <PhaseMini
                            key={p.id}
                            phase={p}
                            active={p.id === activePhaseId}
                            onClick={() => setActivePhaseId(p.id)}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <RoleSwitcher
                weekKey={activeWeek}
                rotation={rotation}
                setRotation={setRotation}
              />

              <Card className="rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" /> Guardrails
                  </CardTitle>
                  <CardDescription>
                    Challenger can stop the week if these are violated.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="rounded-xl border p-2">No parallel problems in a cycle.</div>
                  <div className="rounded-xl border p-2">Phase 4 freezes scope (no new features).</div>
                  <div className="rounded-xl border p-2">Release must state limitations explicitly.</div>
                  <div className="rounded-xl border p-2">Commercial phase uses one offer only.</div>
                </CardContent>
              </Card>
            </div>

            {/* Right content */}
            <div className="lg:col-span-8 space-y-4">
              <PhaseDetail
                phase={activePhase}
                rotation={rotation}
                onOpenTemplate={() => setShowTemplates(true)}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Checklist
                  phase={activePhase}
                  state={checkState[activePhase.id] || {}}
                  setState={(updater) =>
                    setCheckState((s) => ({
                      ...s,
                      [activePhase.id]: updater(s[activePhase.id] || {}),
                    }))
                  }
                />

                <Card className="rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Phase Notes</CardTitle>
                    <CardDescription>
                      Keep short notes here (decisions, links, blockers). This UI can be wired to
                      storage later.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <Button variant="outline" className="rounded-2xl w-full justify-between">
                          Open notes panel
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="mt-3 space-y-2">
                          <div className="rounded-2xl border p-3 text-sm text-muted-foreground">
                            Suggested structure:
                            <ul className="list-disc ml-5 mt-2 space-y-1">
                              <li>Decisions made</li>
                              <li>Links (repo, post, doc)</li>
                              <li>Blockers + next-cycle candidates</li>
                              <li>Who to follow up with</li>
                            </ul>
                          </div>
                          <div className="rounded-2xl border p-3 text-sm">
                            <div className="text-xs text-muted-foreground mb-2">Example</div>
                            <div className="font-medium">Decision:</div>
                            <div className="text-muted-foreground">
                              Target airport transfer operators with 10–20 fleet size; focus on
                              availability + booking intake.
                            </div>
                            <div className="mt-2 font-medium">Blockers heard:</div>
                            <div className="text-muted-foreground">
                              OTA integration, payments, driver assignment rules.
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <TemplateDialog open={showTemplates} onOpenChange={setShowTemplates} />
    </div>
  );
}
