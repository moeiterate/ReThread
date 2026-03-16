import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Search, Globe, Save, X, ChevronUp, ChevronDown, ChevronRight,
  Plus, ArrowUpRight, Mail, Linkedin, MapPin, RefreshCw,
  Rocket,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
type StartupLead = {
  id: string;
  company_name: string;
  website: string | null;
  industry: string | null;
  stage: string | null;
  headcount_range: string | null;
  location: string | null;
  description: string | null;
  founder_name: string | null;
  founder_email: string | null;
  founder_linkedin: string | null;
  status: string;
  source: string | null;
  scheduled_at: string | null;
  research_tools: string[] | null;
  research_maturity: string | null;
  pain_points: string | null;
  budget_notes: string | null;
  interest_level: number | null;
  key_quotes: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

type SortField =
  | 'company_name'
  | 'industry'
  | 'stage'
  | 'status'
  | 'scheduled_at'
  | 'interest_level'
  | 'created_at';
type SortDir = 'asc' | 'desc';
type QuickFilter = 'all' | 'scheduled' | 'interviewed' | 'toprated';

// ─── Config ──────────────────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { label: string; dot: string; pill: string }> = {
  new:          { label: 'New',          dot: 'bg-blue-400',    pill: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
  contacted:    { label: 'Contacted',    dot: 'bg-amber-400',   pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
  scheduled:    { label: 'Scheduled',    dot: 'bg-violet-400',  pill: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200' },
  interviewed:  { label: 'Interviewed',  dot: 'bg-sky-400',     pill: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200' },
  closed_won:   { label: 'Closed — Won', dot: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  closed_lost:  { label: 'Closed — Lost',dot: 'bg-red-400',     pill: 'bg-red-50 text-red-600 ring-1 ring-red-200' },
};

const STAGE_CFG: Record<string, { label: string; color: string }> = {
  'pre-seed': { label: 'Pre-Seed', color: 'bg-pink-100 text-pink-800' },
  'seed':     { label: 'Seed',     color: 'bg-rose-100 text-rose-800' },
  'series-a': { label: 'Series A', color: 'bg-orange-100 text-orange-800' },
  'series-b': { label: 'Series B', color: 'bg-amber-100 text-amber-800' },
  'series-c+':{ label: 'Series C+',color: 'bg-emerald-100 text-emerald-800' },
  'other':    { label: 'Other',    color: 'bg-gray-100 text-gray-600' },
};

const SOURCE_CFG: Record<string, { label: string; color: string }> = {
  linkedin:      { label: 'LinkedIn',    color: 'bg-sky-100 text-sky-800' },
  accelerator:   { label: 'Accelerator', color: 'bg-violet-100 text-violet-800' },
  referral:      { label: 'Referral',    color: 'bg-teal-100 text-teal-800' },
  event:         { label: 'Event',       color: 'bg-indigo-100 text-indigo-800' },
  manual:        { label: 'Manual',      color: 'bg-gray-100 text-gray-600' },
};

const MATURITY_LABELS: Record<string, string> = {
  none:       'No formal research',
  ad_hoc:     'Ad hoc / occasional',
  occasional: 'Occasional',
  regular:    'Regular cadence',
  systematic: 'Systematic / mature',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function scheduledInfo(d: string | null): { label: string; cls: string; pulse: boolean } {
  if (!d) return { label: '—', cls: 'text-gray-300', pulse: false };
  const msPerDay = 86_400_000;
  const diff = Math.round(
    (new Date(d).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / msPerDay,
  );
  if (diff < 0)   return { label: `${-diff}d ago`,  cls: 'text-gray-400', pulse: false };
  if (diff === 0) return { label: 'Today',           cls: 'text-amber-500 font-semibold', pulse: true };
  if (diff === 1) return { label: 'Tomorrow',        cls: 'text-amber-400', pulse: false };
  if (diff <= 7)  return { label: `In ${diff}d`,     cls: 'text-violet-600', pulse: false };
  return {
    label: new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    cls: 'text-gray-400',
    pulse: false,
  };
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function StatCard({
  label, value, accent = false, highlight = false,
}: {
  label: string; value: number; accent?: boolean; highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl px-3 py-3 flex flex-col gap-0.5 ${highlight ? 'bg-violet-50 ring-1 ring-violet-200' : accent ? 'bg-emerald-50 ring-1 ring-emerald-200' : 'bg-white ring-1 ring-gray-200'}`}>
      <span className={`text-2xl font-bold tabular-nums leading-none ${highlight ? 'text-violet-700' : accent ? 'text-emerald-700' : 'text-gray-900'}`}>{value}</span>
      <span className={`text-[11px] font-medium leading-tight mt-1 ${highlight ? 'text-violet-400' : accent ? 'text-emerald-500' : 'text-gray-400'}`}>{label}</span>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.new;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${cfg.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function StageBadge({ stage }: { stage: string | null }) {
  if (!stage) return <span className="text-gray-300 text-xs">—</span>;
  const cfg = STAGE_CFG[stage] ?? { label: stage, color: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function SourceBadge({ source }: { source: string | null }) {
  if (!source) return <span className="text-gray-300 text-xs">—</span>;
  const cfg = SOURCE_CFG[source] ?? { label: source, color: 'bg-gray-100 text-gray-600' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function Stars({ score }: { score: number | null }) {
  if (!score) return <span className="text-gray-200 text-xs tracking-tight">{'★★★★★'}</span>;
  return (
    <span className="text-xs tracking-tight" aria-label={`${score} out of 5`}>
      <span className="text-amber-400">{Array(score).fill('★').join('')}</span>
      <span className="text-gray-200">{Array(5 - score).fill('★').join('')}</span>
    </span>
  );
}

function StarPicker({
  value, onChange,
}: {
  value: number | null;
  onChange: (n: number) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(value === n ? 0 : n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(null)}
          className="text-2xl leading-none transition-transform hover:scale-110 active:scale-95"
          aria-label={`${n} star`}
        >
          <span className={display !== null && n <= display ? 'text-amber-400' : 'text-gray-200'}>★</span>
        </button>
      ))}
      {value ? (
        <button
          type="button"
          onClick={() => onChange(0)}
          className="ml-1 text-xs text-gray-300 hover:text-gray-500 transition-colors"
        >
          clear
        </button>
      ) : null}
    </div>
  );
}

function SortTh({
  field, sortField, sortDir, onSort, children,
}: {
  field: SortField;
  sortField: SortField;
  sortDir: SortDir;
  onSort: (f: SortField) => void;
  children: string;
}) {
  const active = sortField === field;
  return (
    <th className="px-4 py-3 text-left">
      <button
        onClick={() => onSort(field)}
        className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-colors ${active ? 'text-gray-700' : 'text-gray-400 hover:text-gray-700'}`}
      >
        {children}
        <span className={`transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}>
          {active && sortDir === 'desc'
            ? <ChevronDown className="w-3 h-3" />
            : <ChevronUp className="w-3 h-3" />}
        </span>
      </button>
    </th>
  );
}

// ─── Slide-Over ──────────────────────────────────────────────────────────────
function SlideOver({
  lead,
  onClose,
  onSave,
}: {
  lead: StartupLead | null;
  onClose: () => void;
  onSave: (id: string, patch: Partial<StartupLead>) => void;
}) {
  // Startup info
  const [editCompanyName, setEditCompanyName] = useState('');
  const [editWebsite, setEditWebsite] = useState('');
  const [editIndustry, setEditIndustry] = useState('');
  const [editStage, setEditStage] = useState('');
  const [editHeadcount, setEditHeadcount] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editDescription, setEditDescription] = useState('');
  // Founder
  const [editFounderName, setEditFounderName] = useState('');
  const [editFounderEmail, setEditFounderEmail] = useState('');
  const [editFounderLinkedin, setEditFounderLinkedin] = useState('');
  // Pipeline
  const [editStatus, setEditStatus] = useState('new');
  const [editSource, setEditSource] = useState('');
  const [editScheduledAt, setEditScheduledAt] = useState('');
  // Interview findings
  const [editResearchTools, setEditResearchTools] = useState('');
  const [editResearchMaturity, setEditResearchMaturity] = useState('');
  const [editPainPoints, setEditPainPoints] = useState('');
  const [editBudgetNotes, setEditBudgetNotes] = useState('');
  const [editInterestLevel, setEditInterestLevel] = useState<number | null>(null);
  const [editKeyQuotes, setEditKeyQuotes] = useState('');
  // General
  const [editNotes, setEditNotes] = useState('');
  // UI
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [rawOpen, setRawOpen] = useState(false);

  useEffect(() => {
    if (!lead) return;
    setEditCompanyName(lead.company_name ?? '');
    setEditWebsite(lead.website ?? '');
    setEditIndustry(lead.industry ?? '');
    setEditStage(lead.stage ?? '');
    setEditHeadcount(lead.headcount_range ?? '');
    setEditLocation(lead.location ?? '');
    setEditDescription(lead.description ?? '');
    setEditFounderName(lead.founder_name ?? '');
    setEditFounderEmail(lead.founder_email ?? '');
    setEditFounderLinkedin(lead.founder_linkedin ?? '');
    setEditStatus(lead.status ?? 'new');
    setEditSource(lead.source ?? '');
    setEditScheduledAt(lead.scheduled_at ? lead.scheduled_at.split('T')[0] : '');
    setEditResearchTools((lead.research_tools ?? []).join(', '));
    setEditResearchMaturity(lead.research_maturity ?? '');
    setEditPainPoints(lead.pain_points ?? '');
    setEditBudgetNotes(lead.budget_notes ?? '');
    setEditInterestLevel(lead.interest_level ?? null);
    setEditKeyQuotes(lead.key_quotes ?? '');
    setEditNotes(lead.notes ?? '');
    setSavedFlash(false);
    setRawOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead?.id]);

  const handleSave = async () => {
    if (!lead) return;
    setSaving(true);
    const toolsArray = editResearchTools
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
    const patch: Partial<StartupLead> = {
      company_name: editCompanyName.trim() || lead.company_name,
      website: editWebsite || null,
      industry: editIndustry || null,
      stage: editStage || null,
      headcount_range: editHeadcount || null,
      location: editLocation || null,
      description: editDescription || null,
      founder_name: editFounderName || null,
      founder_email: editFounderEmail || null,
      founder_linkedin: editFounderLinkedin || null,
      status: editStatus,
      source: editSource || null,
      scheduled_at: editScheduledAt ? new Date(`${editScheduledAt}T12:00:00`).toISOString() : null,
      research_tools: toolsArray.length > 0 ? toolsArray : null,
      research_maturity: editResearchMaturity || null,
      pain_points: editPainPoints || null,
      budget_notes: editBudgetNotes || null,
      interest_level: editInterestLevel || null,
      key_quotes: editKeyQuotes || null,
      notes: editNotes || null,
    };
    const { error } = await supabase
      .from('startup_leads')
      .update(patch)
      .eq('id', lead.id);
    if (!error) {
      onSave(lead.id, patch);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2200);
    }
    setSaving(false);
  };

  const isOpen = !!lead;

  const inputCls =
    'w-full border border-gray-200 rounded-lg py-2 px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500';

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/25 backdrop-blur-[2px] z-[45] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-[520px] bg-white shadow-2xl z-[46] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {lead && (
          <>
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <h2 className="text-base font-bold text-gray-900 truncate">{lead.company_name}</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                    {lead.location && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="w-3 h-3" />{lead.location}
                      </span>
                    )}
                    {lead.industry && (
                      <span className="text-xs text-gray-400">{lead.industry}</span>
                    )}
                    <StageBadge stage={lead.stage} />
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">

              {/* Interest Level */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Interest Level</p>
                <StarPicker value={editInterestLevel} onChange={n => setEditInterestLevel(n || null)} />
                <p className="text-[10px] text-gray-300 mt-1.5">How interested are they in being interviewed / consulting?</p>
              </div>

              {/* Startup Info */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Startup Info</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Company Name</label>
                    <input type="text" value={editCompanyName} onChange={e => setEditCompanyName(e.target.value)} placeholder="Company name…" className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 font-medium mb-1.5">Industry / Vertical</label>
                      <input type="text" value={editIndustry} onChange={e => setEditIndustry(e.target.value)} placeholder="e.g. FinTech, HealthCare…" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 font-medium mb-1.5">Location</label>
                      <input type="text" value={editLocation} onChange={e => setEditLocation(e.target.value)} placeholder="City, Country" className={inputCls} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 font-medium mb-1.5">Stage</label>
                      <select value={editStage} onChange={e => setEditStage(e.target.value)} className={inputCls}>
                        <option value="">— select —</option>
                        {Object.entries(STAGE_CFG).map(([val, cfg]) => (
                          <option key={val} value={val}>{cfg.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 font-medium mb-1.5">Headcount</label>
                      <select value={editHeadcount} onChange={e => setEditHeadcount(e.target.value)} className={inputCls}>
                        <option value="">— select —</option>
                        {['1-5', '6-15', '16-50', '51-200', '200+'].map(h => (
                          <option key={h} value={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Website</label>
                    <div className="flex gap-2">
                      <input type="url" value={editWebsite} onChange={e => setEditWebsite(e.target.value)} placeholder="https://…" className={`${inputCls} flex-1`} />
                      {editWebsite && (
                        <a href={editWebsite} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-violet-500 hover:bg-violet-50 transition-colors">
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Description</label>
                    <textarea
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value)}
                      placeholder="Brief elevator pitch or description…"
                      rows={2}
                      className="w-full border border-gray-200 rounded-lg py-2 px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Founder Contact */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Founder Contact</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Founder Name</label>
                    <input type="text" value={editFounderName} onChange={e => setEditFounderName(e.target.value)} placeholder="Full name…" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Email</label>
                    <div className="flex gap-2">
                      <input type="email" value={editFounderEmail} onChange={e => setEditFounderEmail(e.target.value)} placeholder="founder@startup.com" className={`${inputCls} flex-1`} />
                      {editFounderEmail && (
                        <a href={`mailto:${editFounderEmail}`} className="flex-shrink-0 p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-violet-500 hover:bg-violet-50 transition-colors">
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">LinkedIn</label>
                    <div className="flex gap-2">
                      <input type="url" value={editFounderLinkedin} onChange={e => setEditFounderLinkedin(e.target.value)} placeholder="https://linkedin.com/in/…" className={`${inputCls} flex-1`} />
                      {editFounderLinkedin && (
                        <a href={editFounderLinkedin} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-violet-500 hover:bg-violet-50 transition-colors">
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pipeline */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Pipeline</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Status</label>
                    <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className={inputCls}>
                      {Object.entries(STATUS_CFG).map(([val, cfg]) => (
                        <option key={val} value={val}>{cfg.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Lead Source</label>
                    <select value={editSource} onChange={e => setEditSource(e.target.value)} className={inputCls}>
                      <option value="">— select —</option>
                      {Object.entries(SOURCE_CFG).map(([val, cfg]) => (
                        <option key={val} value={val}>{cfg.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Interview Scheduled Date</label>
                    <input
                      type="date"
                      value={editScheduledAt}
                      onChange={e => setEditScheduledAt(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>

              {/* Interview Findings */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Interview Findings</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Research Tools Used</label>
                    <input
                      type="text"
                      value={editResearchTools}
                      onChange={e => setEditResearchTools(e.target.value)}
                      placeholder="e.g. Dovetail, Notion, UserTesting (comma-separated)"
                      className={inputCls}
                    />
                    <p className="text-[10px] text-gray-300 mt-1">Separate multiple tools with commas</p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Research Maturity</label>
                    <select value={editResearchMaturity} onChange={e => setEditResearchMaturity(e.target.value)} className={inputCls}>
                      <option value="">— select —</option>
                      {Object.entries(MATURITY_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Pain Points in Research Process</label>
                    <textarea
                      value={editPainPoints}
                      onChange={e => setEditPainPoints(e.target.value)}
                      placeholder="What's frustrating or broken in their current approach?"
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm text-gray-700 placeholder-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white resize-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Budget / Willingness to Pay</label>
                    <textarea
                      value={editBudgetNotes}
                      onChange={e => setEditBudgetNotes(e.target.value)}
                      placeholder="Any signals about budget range or appetite to pay for research services…"
                      rows={2}
                      className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm text-gray-700 placeholder-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white resize-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Key Quotes / Verbatim Takeaways</label>
                    <textarea
                      value={editKeyQuotes}
                      onChange={e => setEditKeyQuotes(e.target.value)}
                      placeholder="Notable things they said verbatim…"
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm text-gray-700 placeholder-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white resize-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Notes</p>
                <textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder="General notes about this lead…"
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl py-2.5 px-3.5 text-sm text-gray-700 placeholder-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white resize-none transition-colors"
                />
              </div>

              {/* Meta (collapsible) */}
              <div className="px-6 py-5">
                <button
                  onClick={() => setRawOpen(v => !v)}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                >
                  {rawOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  Record Info
                </button>
                {rawOpen && (
                  <div className="mt-3 rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
                    {([
                      { label: 'Lead ID',  value: lead.id },
                      { label: 'Created',  value: new Date(lead.created_at).toLocaleString() },
                      { label: 'Updated',  value: new Date(lead.updated_at).toLocaleString() },
                    ] as { label: string; value: string | null }[])
                      .filter(r => r.value)
                      .map(row => (
                        <div key={row.label} className="flex justify-between gap-4 px-4 py-2.5 bg-gray-50 text-xs">
                          <span className="text-gray-400 shrink-0">{row.label}</span>
                          <span className="text-gray-600 text-right break-all">{row.value}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Save footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-white flex-shrink-0">
              <button
                onClick={handleSave}
                disabled={saving}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[.98] disabled:opacity-50 ${savedFlash ? 'bg-emerald-500 text-white' : 'bg-gray-900 text-white hover:bg-gray-700'}`}
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving…' : savedFlash ? 'Saved ✓' : 'Save Changes'}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ─── New Lead Modal ───────────────────────────────────────────────────────────
type NewLeadForm = {
  company_name: string;
  founder_name: string;
  founder_email: string;
  founder_linkedin: string;
  website: string;
  industry: string;
  stage: string;
  location: string;
  source: string;
  description: string;
  notes: string;
};

const EMPTY_FORM: NewLeadForm = {
  company_name: '',
  founder_name: '',
  founder_email: '',
  founder_linkedin: '',
  website: '',
  industry: '',
  stage: '',
  location: '',
  source: '',
  description: '',
  notes: '',
};

function NewLeadModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (lead: StartupLead) => void;
}) {
  const [form, setForm] = useState<NewLeadForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof NewLeadForm) =>
    (e: { target: { value: string } }) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company_name.trim()) { setError('Company name is required'); return; }
    setSaving(true);
    setError('');
    const { data, error: err } = await supabase
      .from('startup_leads')
      .insert({
        company_name: form.company_name.trim(),
        founder_name: form.founder_name || null,
        founder_email: form.founder_email || null,
        founder_linkedin: form.founder_linkedin || null,
        website: form.website || null,
        industry: form.industry || null,
        stage: form.stage || null,
        location: form.location || null,
        source: form.source || null,
        description: form.description || null,
        notes: form.notes || null,
        status: 'new',
      })
      .select()
      .single();
    if (err || !data) {
      setError(err?.message ?? 'Failed to create lead');
      setSaving(false);
      return;
    }
    onCreated(data as StartupLead);
    onClose();
  };

  const inputCls =
    'w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500';

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[50]" onClick={onClose} />
      <div className="fixed inset-0 z-[51] flex items-center justify-center p-4 pointer-events-none">
        <form
          onSubmit={handleSubmit}
          className="pointer-events-auto bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-gray-900">Add Startup Lead</h2>
              <p className="text-xs text-gray-400 mt-0.5">Add a founder to your research outreach pipeline</p>
            </div>
            <button type="button" onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[60vh]">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Company Name <span className="text-red-400">*</span>
              </label>
              <input type="text" value={form.company_name} onChange={set('company_name')} placeholder="e.g. Acme AI" autoFocus className={inputCls} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Founder Name</label>
                <input type="text" value={form.founder_name} onChange={set('founder_name')} placeholder="Jane Doe" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Founder Email</label>
                <input type="email" value={form.founder_email} onChange={set('founder_email')} placeholder="jane@acme.com" className={inputCls} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">LinkedIn URL</label>
              <input type="url" value={form.founder_linkedin} onChange={set('founder_linkedin')} placeholder="https://linkedin.com/in/…" className={inputCls} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Industry / Vertical</label>
                <input type="text" value={form.industry} onChange={set('industry')} placeholder="e.g. HealthTech" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Stage</label>
                <select value={form.stage} onChange={set('stage')} className={`${inputCls} bg-white`}>
                  <option value="">— select —</option>
                  {Object.entries(STAGE_CFG).map(([val, cfg]) => (
                    <option key={val} value={val}>{cfg.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Location</label>
                <input type="text" value={form.location} onChange={set('location')} placeholder="San Francisco, CA" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Source</label>
                <select value={form.source} onChange={set('source')} className={`${inputCls} bg-white`}>
                  <option value="">— select —</option>
                  {Object.entries(SOURCE_CFG).map(([val, cfg]) => (
                    <option key={val} value={val}>{cfg.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Website</label>
              <input type="url" value={form.website} onChange={set('website')} placeholder="https://…" className={inputCls} />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={set('description')}
                placeholder="Brief elevator pitch or context about the company…"
                rows={2}
                className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm text-gray-700 placeholder-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white resize-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Notes</label>
              <textarea
                value={form.notes}
                onChange={set('notes')}
                placeholder="How did you find this lead? Any context…"
                rows={2}
                className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm text-gray-700 placeholder-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:bg-white resize-none transition-colors"
              />
            </div>

            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors rounded-lg hover:bg-gray-100">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-gray-900 text-white hover:bg-gray-700 transition-all active:scale-[.98] disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {saving ? 'Adding…' : 'Add Lead'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function StartupLeads() {
  const [leads, setLeads] = useState<StartupLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<StartupLead | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stageFilter, setStageFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [showNewLead, setShowNewLead] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase
        .from('startup_leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (mounted) {
        setLeads((data as StartupLead[]) ?? []);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const stats = {
    total:       leads.length,
    pipeline:    leads.filter(l => ['contacted', 'scheduled'].includes(l.status)).length,
    scheduled:   leads.filter(l => l.status === 'scheduled').length,
    interviewed: leads.filter(l => l.status === 'interviewed').length,
    won:         leads.filter(l => l.status === 'closed_won').length,
  };

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('asc'); }
  }

  function handleSave(id: string, patch: Partial<StartupLead>) {
    setLeads(prev => prev.map(l => (l.id === id ? { ...l, ...patch } : l)));
    setSelected(prev => (prev?.id === id ? { ...prev, ...patch } : prev));
  }

  function handleCreated(lead: StartupLead) {
    setLeads(prev => [lead, ...prev]);
    setSelected(lead);
  }

  const filtered = leads
    .filter(l => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !l.company_name?.toLowerCase().includes(q) &&
          !l.founder_name?.toLowerCase().includes(q) &&
          !l.industry?.toLowerCase().includes(q) &&
          !l.location?.toLowerCase().includes(q)
        ) return false;
      }
      if (statusFilter !== 'all' && l.status !== statusFilter) return false;
      if (stageFilter !== 'all' && (l.stage ?? '') !== stageFilter) return false;
      if (sourceFilter !== 'all' && (l.source ?? '') !== sourceFilter) return false;
      if (quickFilter === 'scheduled' && l.status !== 'scheduled') return false;
      if (quickFilter === 'interviewed' && l.status !== 'interviewed') return false;
      if (quickFilter === 'toprated' && !(l.interest_level !== null && l.interest_level >= 4)) return false;
      return true;
    })
    .sort((a, b) => {
      const va = String((a as Record<string, unknown>)[sortField] ?? '');
      const vb = String((b as Record<string, unknown>)[sortField] ?? '');
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const hasActiveFilter = search || statusFilter !== 'all' || stageFilter !== 'all' || sourceFilter !== 'all' || quickFilter !== 'all';

  const QUICK_FILTERS: { id: QuickFilter; label: string }[] = [
    { id: 'all',         label: `All (${leads.length})` },
    { id: 'scheduled',   label: `📅 Scheduled (${stats.scheduled})` },
    { id: 'interviewed', label: `✅ Interviewed (${stats.interviewed})` },
    { id: 'toprated',    label: '⭐ High Interest' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Page header ── */}
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 pt-6 pb-5 flex-shrink-0">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <Rocket className="w-5 h-5 text-violet-400" />
              Startup Research Leads
            </h1>
            <p className="text-xs text-gray-400 mt-0.5 font-normal">Founders to interview about product &amp; user research</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setLoading(true);
                supabase
                  .from('startup_leads')
                  .select('*')
                  .order('created_at', { ascending: false })
                  .then(({ data }) => {
                    setLeads((data as StartupLead[]) ?? []);
                    setLoading(false);
                  });
              }}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
            <button
              onClick={() => setShowNewLead(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-gray-900 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Lead
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
          <StatCard label="Total Leads"  value={stats.total} />
          <StatCard label="In Pipeline"  value={stats.pipeline} highlight />
          <StatCard label="📅 Scheduled" value={stats.scheduled} />
          <StatCard label="✅ Interviewed" value={stats.interviewed} />
          <StatCard label="🎯 Won"        value={stats.won} accent />
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-3 flex items-center gap-3 flex-wrap flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 pointer-events-none" />
          <input
            type="text"
            placeholder="Search company, founder, industry…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 w-56 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-white"
          />
        </div>
        <div className="flex items-center gap-1">
          {QUICK_FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setQuickFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                quickFilter === f.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg text-xs py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          >
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_CFG).map(([v, c]) => (
              <option key={v} value={v}>{c.label}</option>
            ))}
          </select>
          <select
            value={stageFilter}
            onChange={e => setStageFilter(e.target.value)}
            className="border border-gray-200 rounded-lg text-xs py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          >
            <option value="all">All Stages</option>
            {Object.entries(STAGE_CFG).map(([v, cfg]) => (
              <option key={v} value={v}>{cfg.label}</option>
            ))}
          </select>
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="border border-gray-200 rounded-lg text-xs py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
          >
            <option value="all">All Sources</option>
            {Object.entries(SOURCE_CFG).map(([v, cfg]) => (
              <option key={v} value={v}>{cfg.label}</option>
            ))}
          </select>
          {hasActiveFilter && (
            <button
              onClick={() => { setSearch(''); setStatusFilter('all'); setStageFilter('all'); setSourceFilter('all'); setQuickFilter('all'); }}
              className="text-xs text-violet-500 hover:text-violet-700 font-medium transition-colors"
            >
              Clear
            </button>
          )}
          <span className="text-xs text-gray-400 pl-2 border-l border-gray-200">
            {filtered.length} of {leads.length}
          </span>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40 gap-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        ) : (
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-10">
              <tr>
                <SortTh field="company_name" sortField={sortField} sortDir={sortDir} onSort={toggleSort}>Company</SortTh>
                <SortTh field="industry" sortField={sortField} sortDir={sortDir} onSort={toggleSort}>Industry</SortTh>
                <SortTh field="stage" sortField={sortField} sortDir={sortDir} onSort={toggleSort}>Stage</SortTh>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Source</th>
                <SortTh field="status" sortField={sortField} sortDir={sortDir} onSort={toggleSort}>Status</SortTh>
                <SortTh field="interest_level" sortField={sortField} sortDir={sortDir} onSort={toggleSort}>Interest</SortTh>
                <SortTh field="scheduled_at" sortField={sortField} sortDir={sortDir} onSort={toggleSort}>Scheduled</SortTh>
                <SortTh field="created_at" sortField={sortField} sortDir={sortDir} onSort={toggleSort}>Added</SortTh>
                <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-24 text-center">
                    <Rocket className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">No leads match your filters</p>
                    {hasActiveFilter && (
                      <button
                        onClick={() => { setSearch(''); setStatusFilter('all'); setStageFilter('all'); setSourceFilter('all'); setQuickFilter('all'); }}
                        className="mt-2 text-xs text-violet-500 hover:underline"
                      >
                        Clear all filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map(lead => {
                  const sched = scheduledInfo(lead.scheduled_at);
                  const isSelected = selected?.id === lead.id;
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelected(isSelected ? null : lead)}
                      className={`cursor-pointer border-b border-gray-50 transition-colors ${
                        isSelected ? 'bg-violet-50' : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <td className={`pl-6 md:pl-8 pr-4 py-3.5 border-l-[3px] ${isSelected ? 'border-l-violet-500' : 'border-l-transparent'}`}>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm leading-snug">{lead.company_name}</p>
                          {lead.founder_name && (
                            <p className="text-xs text-gray-400 leading-tight mt-0.5">{lead.founder_name}</p>
                          )}
                          {lead.location && (
                            <p className="text-xs text-gray-300 leading-tight flex items-center gap-1 mt-0.5">
                              <MapPin className="w-2.5 h-2.5" />{lead.location}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-gray-600">{lead.industry ?? <span className="text-gray-200">—</span>}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <StageBadge stage={lead.stage} />
                      </td>
                      <td className="px-4 py-3.5">
                        <SourceBadge source={lead.source} />
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusPill status={lead.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <Stars score={lead.interest_level} />
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs flex items-center gap-1.5 ${sched.cls}`}>
                          {sched.pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse flex-shrink-0" />}
                          {sched.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="pr-6 md:pr-8 pl-4 py-3.5">
                        <div className="flex items-center justify-end gap-0.5" onClick={e => e.stopPropagation()}>
                          {lead.website && (
                            <a href={lead.website} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-gray-300 hover:text-violet-500 hover:bg-violet-50 transition-colors" title="Visit website">
                              <Globe className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {lead.founder_email && (
                            <a href={`mailto:${lead.founder_email}`} className="p-1.5 rounded-lg text-gray-300 hover:text-violet-500 hover:bg-violet-50 transition-colors" title={lead.founder_email}>
                              <Mail className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {lead.founder_linkedin && (
                            <a href={lead.founder_linkedin} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-gray-300 hover:text-violet-500 hover:bg-violet-50 transition-colors" title="LinkedIn">
                              <Linkedin className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Slide-over ── */}
      <SlideOver lead={selected} onClose={() => setSelected(null)} onSave={handleSave} />

      {/* ── New lead modal ── */}
      {showNewLead && (
        <NewLeadModal onClose={() => setShowNewLead(false)} onCreated={handleCreated} />
      )}
    </div>
  );
}
