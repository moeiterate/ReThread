import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Search, Phone, Globe, ExternalLink, Save, Building2, MapPin,
  X, ChevronUp, ChevronDown, ChevronRight, RefreshCw, ArrowUpRight, Plus,
  MessageSquare, PhoneCall, Mail, Users, ArrowRight, Monitor, Send,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────
type Lead = {
  id: string;
  place_id: string | null;
  name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  website: string | null;
  domain: string | null;
  query_term: string | null;
  reservation_system: string | null;
  reservation_page_url: string | null;
  reservation_evidence: Record<string, unknown> | null;
  reservation_checked_at: string | null;
  is_hudson_customer: boolean;
  hudson_evidence: Record<string, unknown> | null;
  hudson_checked_at: string | null;
  fetched_at: string | null;
  status: string | null;
  owner_id: string | null;
  notes: string | null;
  next_follow_up: string | null;
  'Lead Claimed By (Ahmad or Moaz)': string | null;
  'Engagement Status': string | null;
  score: number | null;
};

type ActivityEntry = {
  id: string;
  lead_id: string;
  type: 'note' | 'call' | 'email' | 'meeting' | 'status_change' | 'demo' | 'other';
  body: string | null;
  author: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

type SortField = 'name' | 'state' | 'reservation_system' | 'status' | 'next_follow_up' | 'score';
type SortDir = 'asc' | 'desc';
type QuickFilter = 'all' | 'hudson' | 'phone' | 'followup' | 'toprated';

// ─── Config ─────────────────────────────────────────────────────────────────
const STATUS_CFG: Record<string, { label: string; dot: string; pill: string }> = {
  new:         { label: 'New',         dot: 'bg-blue-400',    pill: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' },
  researching: { label: 'Researching', dot: 'bg-violet-400',  pill: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200' },
  contacted:   { label: 'Contacted',   dot: 'bg-amber-400',   pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' },
  demo:        { label: 'Demo',        dot: 'bg-orange-400',  pill: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200' },
  won:         { label: 'Won',         dot: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  lost:        { label: 'Lost',        dot: 'bg-red-400',     pill: 'bg-red-50 text-red-600 ring-1 ring-red-200' },
  unqualified: { label: 'Unqualified', dot: 'bg-gray-300',    pill: 'bg-gray-50 text-gray-400 ring-1 ring-gray-200' },
};

const SYSTEM_COLOR: Record<string, string> = {
  Hudson:          'bg-indigo-100 text-indigo-800',
  MyLimoBiz:       'bg-orange-100 text-orange-800',
  direct:          'bg-emerald-100 text-emerald-800',
  phone_only:      'bg-slate-100 text-slate-600',
  unavailable:     'bg-gray-100 text-gray-400',
  MoovsApp:        'bg-sky-100 text-sky-800',
  Stripe:          'bg-violet-100 text-violet-800',
  BookRidesOnline: 'bg-teal-100 text-teal-800',
  FareHarbor:      'bg-amber-100 text-amber-800',
  BookingTool:     'bg-rose-100 text-rose-800',
};

const SYSTEM_LABEL: Record<string, string> = {
  phone_only:  'Phone Only',
  unavailable: 'Unknown',
  direct:      'Direct',
};

const ACTIVITY_TYPE_CFG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  note:          { label: 'Note',          icon: MessageSquare, color: 'text-gray-500',    bg: 'bg-gray-100'   },
  call:          { label: 'Call',          icon: PhoneCall,     color: 'text-blue-500',    bg: 'bg-blue-50'    },
  email:         { label: 'Email',         icon: Mail,          color: 'text-violet-500',  bg: 'bg-violet-50'  },
  meeting:       { label: 'Meeting',       icon: Users,         color: 'text-emerald-500', bg: 'bg-emerald-50' },
  status_change: { label: 'Status Change', icon: ArrowRight,    color: 'text-amber-500',   bg: 'bg-amber-50'   },
  demo:          { label: 'Demo',          icon: Monitor,       color: 'text-orange-500',  bg: 'bg-orange-50'  },
  other:         { label: 'Other',         icon: MessageSquare, color: 'text-gray-500',    bg: 'bg-gray-100'   },
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60)  return 'just now';
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function followUpInfo(d: string | null): { label: string; cls: string; pulse: boolean } {
  if (!d) return { label: '—', cls: 'text-gray-300', pulse: false };
  const msPerDay = 86_400_000;
  const diff = Math.round(
    (new Date(d).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / msPerDay,
  );
  if (diff < 0)   return { label: `${-diff}d overdue`, cls: 'text-red-500 font-semibold', pulse: true };
  if (diff === 0) return { label: 'Today',             cls: 'text-amber-500 font-semibold', pulse: true };
  if (diff === 1) return { label: 'Tomorrow',          cls: 'text-amber-400', pulse: false };
  if (diff <= 7)  return { label: `In ${diff}d`,       cls: 'text-gray-500', pulse: false };
  return {
    label: new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    cls: 'text-gray-400',
    pulse: false,
  };
}

function autoSuggestScore(lead: Pick<Lead, 'is_hudson_customer' | 'reservation_system' | 'phone'>): number {
  let s = 1;
  if (lead.is_hudson_customer) s += 2;
  if (lead.reservation_system && !['phone_only', 'unavailable', null].includes(lead.reservation_system)) s += 1;
  if (lead.phone) s += 1;
  return Math.min(s, 5);
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function StatCard({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`rounded-xl px-5 py-4 flex flex-col gap-1 ${accent ? 'bg-amber-50 ring-1 ring-amber-200' : 'bg-white ring-1 ring-gray-200'}`}>
      <span className={`text-3xl font-bold tabular-nums ${accent ? 'text-amber-700' : 'text-gray-900'}`}>{value}</span>
      <span className={`text-xs font-medium ${accent ? 'text-amber-500' : 'text-gray-400'}`}>{label}</span>
    </div>
  );
}

function SystemBadge({ system }: { system: string | null }) {
  if (!system) return <span className="text-gray-300 text-xs">—</span>;
  const color = SYSTEM_COLOR[system] ?? 'bg-gray-100 text-gray-600';
  const label = SYSTEM_LABEL[system] ?? system;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap ${color}`}>
      {label}
    </span>
  );
}

function StatusPill({ status }: { status: string | null }) {
  const cfg = STATUS_CFG[status ?? 'new'] ?? STATUS_CFG.new;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${cfg.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// Read-only compact stars for the table
function Stars({ score }: { score: number | null }) {
  if (!score) return <span className="text-gray-200 text-xs tracking-tight">{'★★★★★'}</span>;
  return (
    <span className="text-xs tracking-tight" aria-label={`${score} out of 5`}>
      <span className="text-amber-400">{Array(score).fill('★').join('')}</span>
      <span className="text-gray-200">{Array(5 - score).fill('★').join('')}</span>
    </span>
  );
}

// Interactive star picker for the slide-over
function StarPicker({
  value, suggested, onChange,
}: {
  value: number | null;
  suggested: number;
  onChange: (n: number) => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value;
  return (
    <div>
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
            <span className={display !== null && n <= display ? 'text-amber-400' : 'text-gray-200'}>
              ★
            </span>
          </button>
        ))}
        {value && (
          <button
            type="button"
            onClick={() => onChange(0)}
            className="ml-1 text-xs text-gray-300 hover:text-gray-500 transition-colors"
          >
            clear
          </button>
        )}
      </div>
      {!value && (
        <button
          type="button"
          onClick={() => onChange(suggested)}
          className="mt-2 flex items-center gap-1 text-xs text-gray-400 hover:text-amber-500 transition-colors"
        >
          <span className="text-amber-300">{Array(suggested).fill('★').join('')}</span>
          <span className="text-gray-200">{Array(5 - suggested).fill('★').join('')}</span>
          <span className="ml-1">Suggested — tap to apply</span>
        </button>
      )}
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
  lead: Lead | null;
  onClose: () => void;
  onSave: (id: string, patch: Partial<Lead>) => void;
}) {
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('new');
  const [followUp, setFollowUp] = useState('');
  const [claimedBy, setClaimedBy] = useState('');
  const [engagementStatus, setEngagementStatus] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [rawOpen, setRawOpen] = useState(false);
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [newLogType, setNewLogType] = useState<ActivityEntry['type']>('note');
  const [newLogBody, setNewLogBody] = useState('');
  const [loggingEntry, setLoggingEntry] = useState(false);

  // Sync fields when a new lead is selected
  useEffect(() => {
    if (!lead) return;
    setNotes(lead.notes ?? '');
    setStatus(lead.status ?? 'new');
    setFollowUp(lead.next_follow_up ? lead.next_follow_up.split('T')[0] : '');
    setClaimedBy(lead['Lead Claimed By (Ahmad or Moaz)'] ?? '');
    setEngagementStatus(lead['Engagement Status'] ?? '');
    setScore(lead.score ?? null);
    setSavedFlash(false);
    setRawOpen(false);
    setNewLogBody('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead?.id]);

  // Load activity log whenever the selected lead changes
  useEffect(() => {
    if (!lead) { setActivityLog([]); return; }
    setActivityLoading(true);
    supabase
      .from('lead_activity_log')
      .select('*')
      .eq('lead_id', lead.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setActivityLog((data as ActivityEntry[]) ?? []);
        setActivityLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lead?.id]);

  const handleLogEntry = async () => {
    if (!lead || !newLogBody.trim()) return;
    setLoggingEntry(true);
    const { data, error } = await supabase
      .from('lead_activity_log')
      .insert({
        lead_id: lead.id,
        type: newLogType,
        body: newLogBody.trim(),
        author: claimedBy || null,
        metadata: {},
      })
      .select()
      .single();
    if (!error && data) {
      setActivityLog(prev => [data as ActivityEntry, ...prev]);
      setNewLogBody('');
    }
    setLoggingEntry(false);
  };

  const handleSave = async () => {
    if (!lead) return;
    setSaving(true);
    const patch: Partial<Lead> = {
      notes,
      status,
      next_follow_up: followUp ? new Date(`${followUp}T12:00:00`).toISOString() : null,
      'Lead Claimed By (Ahmad or Moaz)': claimedBy || null,
      'Engagement Status': engagementStatus || null,
      score: score || null,
    };
    const { error } = await supabase
      .from('national_leads')
      .update(patch)
      .eq('id', lead.id);
    if (!error) {
      onSave(lead.id, patch);
      // Auto-log status changes as an activity entry
      if (status !== (lead.status ?? 'new')) {
        const fromLabel = STATUS_CFG[lead.status ?? 'new']?.label ?? (lead.status ?? 'new');
        const toLabel   = STATUS_CFG[status]?.label ?? status;
        const { data: newEntry } = await supabase
          .from('lead_activity_log')
          .insert({
            lead_id: lead.id,
            type: 'status_change',
            body: `${fromLabel} → ${toLabel}`,
            author: claimedBy || null,
            metadata: { from: lead.status ?? 'new', to: status },
          })
          .select()
          .single();
        if (newEntry) setActivityLog(prev => [newEntry as ActivityEntry, ...prev]);
      }
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2200);
    }
    setSaving(false);
  };

  const isOpen = !!lead;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/25 backdrop-blur-[2px] z-[45] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-[520px] bg-white shadow-2xl z-[46] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {lead && (
          <>
            {/* Header */}
            <div className={`px-6 py-5 border-b border-gray-100 flex-shrink-0 ${lead.is_hudson_customer ? 'bg-amber-50/60' : ''}`}>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {lead.is_hudson_customer && <span className="leading-none flex-shrink-0">🔥</span>}
                    <h2 className="text-base font-bold text-gray-900 truncate">{lead.name}</h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                    {lead.city && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MapPin className="w-3 h-3" />{lead.city}, {lead.state}
                      </span>
                    )}
                    {lead.is_hudson_customer && (
                      <span className="text-xs font-semibold text-amber-600">Hudson Customer</span>
                    )}
                    <SystemBadge system={lead.reservation_system} />
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

              {/* Score */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Lead Score</p>
                <StarPicker
                  value={score}
                  suggested={autoSuggestScore(lead)}
                  onChange={n => setScore(n || null)}
                />
              </div>

              {/* Contact */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Contact</p>
                <div className="space-y-2">
                  {lead.phone && (
                    <a href={`tel:${lead.phone}`} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 group transition-colors">
                      <Phone className="w-4 h-4 text-gray-300 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
                      <span className="text-sm text-gray-700 font-medium">{lead.phone}</span>
                    </a>
                  )}
                  {lead.website && (
                    <a href={lead.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 group transition-colors">
                      <Globe className="w-4 h-4 text-gray-300 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
                      <span className="text-sm text-gray-700 font-medium flex-1 truncate">{lead.domain ?? lead.website}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-200 group-hover:text-blue-400 flex-shrink-0 transition-colors" />
                    </a>
                  )}
                  {lead.address && (
                    <div className="flex items-start gap-3 px-3 py-2.5 rounded-xl bg-gray-50">
                      <MapPin className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{lead.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Pipeline */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Pipeline</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Status</label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg py-2 px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Object.entries(STATUS_CFG).map(([val, cfg]) => (
                        <option key={val} value={val}>{cfg.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Follow-up Date</label>
                    <input
                      type="date"
                      value={followUp}
                      onChange={e => setFollowUp(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg py-2 px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Claimed By</label>
                    <select
                      value={claimedBy}
                      onChange={e => setClaimedBy(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg py-2 px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">— unassigned —</option>
                      <option value="Ahmad">Ahmad</option>
                      <option value="Moaz">Moaz</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Engagement Status</label>
                    <input
                      type="text"
                      value={engagementStatus}
                      onChange={e => setEngagementStatus(e.target.value)}
                      placeholder="e.g. Replied, No answer…"
                      className="w-full border border-gray-200 rounded-lg py-2 px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Activity Log */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Activity Log</p>

                {/* Pinned Summary — maps to lead.notes, saved with the Save button */}
                <div className="mb-5">
                  <label className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-1.5">
                    <span>📌</span> Pinned Summary
                  </label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="High-level notes about this lead…"
                    rows={2}
                    className="w-full border border-gray-200 rounded-xl py-2.5 px-3.5 text-sm text-gray-700 placeholder-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none transition-colors"
                  />
                </div>

                {/* Timeline */}
                {activityLoading ? (
                  <div className="flex items-center gap-1.5 py-4 justify-center">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
                    ))}
                  </div>
                ) : activityLog.length > 0 ? (
                  <div className="space-y-3 mb-5">
                    {activityLog.map(entry => {
                      const cfg = ACTIVITY_TYPE_CFG[entry.type] ?? ACTIVITY_TYPE_CFG.note;
                      const Icon = cfg.icon;
                      return (
                        <div key={entry.id} className="flex gap-3">
                          <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${cfg.bg}`}>
                            <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                          </div>
                          <div className="flex-1 min-w-0 pb-3 border-b border-gray-50 last:border-b-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                              {entry.author && (
                                <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-medium">
                                  {entry.author}
                                </span>
                              )}
                              <span className="text-[10px] text-gray-300 ml-auto flex-shrink-0">
                                {timeAgo(entry.created_at)}
                              </span>
                            </div>
                            {entry.body && <p className="text-sm text-gray-600 leading-relaxed">{entry.body}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-300 text-center py-4 mb-4">No activity logged yet</p>
                )}

                {/* New entry composer */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200">
                    <select
                      value={newLogType}
                      onChange={e => setNewLogType(e.target.value as ActivityEntry['type'])}
                      className="text-xs bg-transparent font-medium text-gray-600 focus:outline-none cursor-pointer border-0"
                    >
                      <option value="note">📝 Note</option>
                      <option value="call">📞 Call</option>
                      <option value="email">✉️ Email</option>
                      <option value="meeting">🤝 Meeting</option>
                      <option value="demo">🖥️ Demo</option>
                      <option value="other">💬 Other</option>
                    </select>
                    {claimedBy && (
                      <span className="ml-auto text-[10px] bg-white border border-gray-200 text-gray-500 px-1.5 py-0.5 rounded font-medium">
                        {claimedBy}
                      </span>
                    )}
                  </div>
                  <textarea
                    value={newLogBody}
                    onChange={e => setNewLogBody(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleLogEntry(); }}
                    placeholder="What happened? Log a call, note, or update…"
                    rows={3}
                    className="w-full border-0 py-3 px-3.5 text-sm text-gray-700 placeholder-gray-300 bg-white focus:outline-none resize-none"
                  />
                  <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200">
                    <span className="text-[10px] text-gray-300">⌘↵ to submit</span>
                    <button
                      onClick={handleLogEntry}
                      disabled={loggingEntry || !newLogBody.trim()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-900 text-white hover:bg-gray-700 transition-all active:scale-[.98] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Send className="w-3 h-3" />
                      {loggingEntry ? 'Logging…' : 'Log Entry'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Competitor Intel */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Competitor Intel</p>
                <div className="rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                    <span className="text-xs text-gray-500">Current System</span>
                    <SystemBadge system={lead.reservation_system} />
                  </div>
                  {lead.is_hudson_customer && (
                    <div className="flex items-center justify-between px-4 py-3 bg-amber-50">
                      <span className="text-xs font-semibold text-amber-700">Hudson Customer</span>
                      <span>🔥</span>
                    </div>
                  )}
                  {lead.reservation_page_url && (
                    <div className="px-4 py-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1.5">Booking URL</p>
                      <a href={lead.reservation_page_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1 break-all">
                        {lead.reservation_page_url}
                        <ExternalLink className="w-3 h-3 flex-shrink-0 ml-0.5" />
                      </a>
                    </div>
                  )}
                  {lead.reservation_evidence && (
                    <div className="px-4 py-3">
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1.5">Evidence</p>
                      <pre className="text-xs text-gray-600 whitespace-pre-wrap break-all font-mono leading-relaxed">
                        {JSON.stringify(lead.reservation_evidence, null, 2)}
                      </pre>
                    </div>
                  )}
                  {lead.hudson_evidence && (
                    <div className="px-4 py-3 bg-amber-50">
                      <p className="text-[10px] text-amber-600 uppercase tracking-wider font-semibold mb-1.5">Hudson Evidence</p>
                      <pre className="text-xs text-amber-900 whitespace-pre-wrap break-all font-mono leading-relaxed">
                        {JSON.stringify(lead.hudson_evidence, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>

              {/* Source Data (collapsible) */}
              <div className="px-6 py-5">
                <button
                  onClick={() => setRawOpen(v => !v)}
                  className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
                >
                  {rawOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  Source Data
                </button>
                {rawOpen && (
                  <div className="mt-3 rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
                    {([
                      { label: 'Query Term',     value: lead.query_term },
                      { label: 'Place ID',       value: lead.place_id },
                      { label: 'Domain',         value: lead.domain },
                      { label: 'Fetched',        value: lead.fetched_at ? new Date(lead.fetched_at).toLocaleString() : null },
                      { label: 'Res. Checked',   value: lead.reservation_checked_at ? new Date(lead.reservation_checked_at).toLocaleString() : null },
                      { label: 'Hudson Checked', value: lead.hudson_checked_at ? new Date(lead.hudson_checked_at).toLocaleString() : null },
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

// ─── New Lead Modal ─────────────────────────────────────────────────────────
type NewLeadForm = {
  name: string; city: string; state: string; phone: string;
  website: string; reservation_system: string; status: string; notes: string;
};
const EMPTY_FORM: NewLeadForm = {
  name: '', city: '', state: '', phone: '', website: '',
  reservation_system: '', status: 'new', notes: '',
};
const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
];

function NewLeadModal({ onClose, onCreated }: {
  onClose: () => void;
  onCreated: (lead: Lead) => void;
}) {
  const [form, setForm] = useState<NewLeadForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof NewLeadForm) =>
    (e: { target: { value: string } }) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Company name is required'); return; }
    setSaving(true);
    setError('');
    const { data, error: err } = await supabase
      .from('national_leads')
      .insert({
        place_id: `manual_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        name: form.name.trim(),
        city: form.city || null,
        state: form.state || null,
        phone: form.phone || null,
        website: form.website || null,
        domain: form.website
          ? form.website.replace(/^https?:\/\//, '').split('/')[0]
          : null,
        reservation_system: form.reservation_system || null,
        status: form.status,
        notes: form.notes || null,
        is_hudson_customer: false,
      })
      .select()
      .single();
    if (err || !data) {
      setError(err?.message ?? 'Failed to create lead');
      setSaving(false);
      return;
    }
    onCreated(data as Lead);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[50]"
        onClick={onClose}
      />
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
              <h2 className="text-base font-bold text-gray-900">Add New Lead</h2>
              <p className="text-xs text-gray-400 mt-0.5">Manually add a company to your pipeline</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4 overflow-y-auto max-h-[60vh]">
            {/* Company name */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Company Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={set('name')}
                placeholder="e.g. Acme Limo Co."
                autoFocus
                className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* City + State */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={set('city')}
                  placeholder="New York"
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">State</label>
                <select
                  value={form.state}
                  onChange={set('state')}
                  className="w-full border border-gray-200 rounded-lg py-2 px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">— select —</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Phone + Website */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="(555) 000-0000"
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Website</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={set('website')}
                  placeholder="https://…"
                  className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Reservation System + Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Reservation System</label>
                <select
                  value={form.reservation_system}
                  onChange={set('reservation_system')}
                  className="w-full border border-gray-200 rounded-lg py-2 px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">— unknown —</option>
                  {Object.keys(SYSTEM_COLOR).map(s => (
                    <option key={s} value={s}>{SYSTEM_LABEL[s] ?? s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={set('status')}
                  className="w-full border border-gray-200 rounded-lg py-2 px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(STATUS_CFG).map(([val, cfg]) => (
                    <option key={val} value={val}>{cfg.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Notes</label>
              <textarea
                value={form.notes}
                onChange={set('notes')}
                placeholder="How did you find this lead? Any context…"
                rows={3}
                className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm text-gray-700 placeholder-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none transition-colors"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 font-medium">{error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors rounded-lg hover:bg-gray-100"
            >
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

// ─── Main Page ───────────────────────────────────────────────────────────────
export function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [showNewLead, setShowNewLead] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data } = await supabase
        .from('national_leads')
        .select('*')
        .order('name', { ascending: true });
      if (mounted) {
        setLeads((data as Lead[]) ?? []);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const todayMs = new Date().setHours(0, 0, 0, 0);

  const stats = {
    total:    leads.length,
    hudson:   leads.filter(l => l.is_hudson_customer).length,
    followup: leads.filter(l => l.next_follow_up && new Date(l.next_follow_up).setHours(0, 0, 0, 0) <= todayMs).length,
    pipeline: leads.filter(l => ['researching', 'contacted', 'demo'].includes(l.status ?? '')).length,
  };

  const states = [...new Set(leads.map(l => l.state).filter(Boolean) as string[])].sort();

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('asc'); }
  }

  function handleSave(id: string, patch: Partial<Lead>) {
    setLeads(prev => prev.map(l => (l.id === id ? { ...l, ...patch } : l)));
    setSelected(prev => (prev?.id === id ? { ...prev, ...patch } : prev));
  }

  function handleCreated(lead: Lead) {
    setLeads(prev => [lead, ...prev]);
    setSelected(lead);
  }

  const filtered = leads
    .filter(l => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !l.name?.toLowerCase().includes(q) &&
          !l.city?.toLowerCase().includes(q) &&
          !l.state?.toLowerCase().includes(q) &&
          !l.reservation_system?.toLowerCase().includes(q)
        ) return false;
      }
      if (stateFilter !== 'all' && l.state !== stateFilter) return false;
      if (statusFilter !== 'all' && (l.status ?? 'new') !== statusFilter) return false;
      if (quickFilter === 'hudson' && !l.is_hudson_customer) return false;
      if (quickFilter === 'toprated' && !(l.score !== null && l.score >= 4)) return false;
      if (quickFilter === 'phone' && l.reservation_system !== 'phone_only') return false;
      if (quickFilter === 'followup' && !(l.next_follow_up && new Date(l.next_follow_up).setHours(0, 0, 0, 0) <= todayMs)) return false;
      return true;
    })
    .sort((a, b) => {
      const va = String(a[sortField] ?? '');
      const vb = String(b[sortField] ?? '');
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const hasActiveFilter = search || statusFilter !== 'all' || stateFilter !== 'all' || quickFilter !== 'all';

  const QUICK_FILTERS: { id: QuickFilter; label: string }[] = [
    { id: 'all',      label: `All (${leads.length})` },
    { id: 'hudson',   label: `🔥 Hudson (${stats.hudson})` },
    { id: 'toprated', label: '⭐ Top Rated' },
    { id: 'phone',    label: 'Phone Only' },
    { id: 'followup', label: '📅 Follow-up' },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Page header ── */}
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 pt-6 pb-5 flex-shrink-0">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              National Leads
            </h1>
            <p className="text-xs text-gray-400 mt-0.5 font-normal">Transportation companies · outreach pipeline</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.location.reload()}
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Leads" value={stats.total} />
          <StatCard label="🔥 Hudson Customers" value={stats.hudson} accent />
          <StatCard label="Needs Follow-up" value={stats.followup} />
          <StatCard label="Active Pipeline" value={stats.pipeline} />
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-3 flex items-center gap-3 flex-wrap flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 pointer-events-none" />
          <input
            type="text"
            placeholder="Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 w-48 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
            className="border border-gray-200 rounded-lg text-xs py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_CFG).map(([v, c]) => (
              <option key={v} value={v}>{c.label}</option>
            ))}
          </select>
          <select
            value={stateFilter}
            onChange={e => setStateFilter(e.target.value)}
            className="border border-gray-200 rounded-lg text-xs py-1.5 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {hasActiveFilter && (
            <button
              onClick={() => { setSearch(''); setStatusFilter('all'); setStateFilter('all'); setQuickFilter('all'); }}
              className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
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
                <SortTh field="name" sortField={sortField} sortDir={sortDir} onSort={toggleSort}>Company</SortTh>
                <SortTh field="state" sortField={sortField} sortDir={sortDir} onSort={toggleSort}>State</SortTh>
                <SortTh field="reservation_system" sortField={sortField} sortDir={sortDir} onSort={toggleSort}>System</SortTh>
                <SortTh field="status" sortField={sortField} sortDir={sortDir} onSort={toggleSort}>Status</SortTh>
                <SortTh field="score" sortField={sortField} sortDir={sortDir} onSort={toggleSort}>Score</SortTh>
                <SortTh field="next_follow_up" sortField={sortField} sortDir={sortDir} onSort={toggleSort}>Follow-up</SortTh>
                <th className="px-4 py-3 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-24 text-center">
                    <Building2 className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">No leads match your filters</p>
                    {hasActiveFilter && (
                      <button
                        onClick={() => { setSearch(''); setStatusFilter('all'); setStateFilter('all'); setQuickFilter('all'); }}
                        className="mt-2 text-xs text-blue-500 hover:underline"
                      >
                        Clear all filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map(lead => {
                  const fu = followUpInfo(lead.next_follow_up);
                  const isSelected = selected?.id === lead.id;
                  const isHudson = lead.is_hudson_customer;
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => setSelected(isSelected ? null : lead)}
                      className={`cursor-pointer border-b border-gray-50 transition-colors ${
                        isSelected ? 'bg-blue-50' : isHudson ? 'bg-amber-50/30 hover:bg-amber-50/70' : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <td className={`pl-6 md:pl-8 pr-4 py-3.5 border-l-[3px] ${isSelected ? 'border-l-blue-500' : isHudson ? 'border-l-amber-400' : 'border-l-transparent'}`}>
                        <div className="flex items-center gap-2">
                          {isHudson && <span className="text-xs leading-none flex-shrink-0">🔥</span>}
                          <div>
                            <p className="font-semibold text-gray-900 text-sm leading-snug">{lead.name}</p>
                            <p className="text-xs text-gray-400 leading-tight mt-0.5">{lead.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block bg-gray-100 text-gray-600 rounded-md px-2 py-0.5 text-xs font-semibold">{lead.state ?? '—'}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <SystemBadge system={lead.reservation_system} />
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusPill status={lead.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <Stars score={lead.score} />
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs flex items-center gap-1.5 ${fu.cls}`}>
                          {fu.pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse flex-shrink-0" />}
                          {fu.label}
                        </span>
                      </td>
                      <td className="pr-6 md:pr-8 pl-4 py-3.5">
                        <div className="flex items-center justify-end gap-0.5" onClick={e => e.stopPropagation()}>
                          {lead.phone && (
                            <a href={`tel:${lead.phone}`} className="p-1.5 rounded-lg text-gray-300 hover:text-blue-500 hover:bg-blue-50 transition-colors" title={lead.phone}>
                              <Phone className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {lead.website && (
                            <a href={lead.website} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-gray-300 hover:text-blue-500 hover:bg-blue-50 transition-colors" title="Visit website">
                              <Globe className="w-3.5 h-3.5" />
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
        <NewLeadModal
          onClose={() => setShowNewLead(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}

