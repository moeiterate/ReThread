import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Search, X, ChevronUp, ChevronDown, ArrowUpRight, Plus,
  Save, ExternalLink, CheckCircle2, AlertTriangle, HelpCircle,
  XCircle, Globe, BarChart2, RefreshCw, Pencil, Trash2,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────
type Category = 'ground_transport' | 'taxi_dispatch' | 'tours_activities' | 'general_scheduling' | 'payment_only' | 'other';
type TransportFocus = 'high' | 'moderate' | 'low' | 'none';
type PlatformStatus = 'active' | 'likely_defunct' | 'not_a_platform' | 'unknown';

type Competitor = {
  id: string;
  name: string;
  website: string | null;
  category: Category;
  transport_focus: TransportFocus;
  airport_transport: boolean;
  description: string | null;
  key_features: string[];
  pricing_model: string | null;
  pricing_starting: string | null;
  competitive_edge: string | null;
  platform_status: PlatformStatus;
  lead_count: number;
  notes: string | null;
  rating: number | null;
  verified_primary_url: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
};

type SortField = 'name' | 'category' | 'transport_focus' | 'lead_count' | 'platform_status' | 'rating';
type SortDir = 'asc' | 'desc';

// ─── Config ─────────────────────────────────────────────────────────────────
const CATEGORY_CFG: Record<Category, { label: string; color: string }> = {
  ground_transport:   { label: 'Ground Transport',   color: 'bg-indigo-100 text-indigo-800' },
  taxi_dispatch:      { label: 'Taxi / Dispatch',     color: 'bg-purple-100 text-purple-800' },
  tours_activities:   { label: 'Tours & Activities',  color: 'bg-teal-100 text-teal-800' },
  general_scheduling: { label: 'General Scheduling',  color: 'bg-slate-100 text-slate-600' },
  payment_only:       { label: 'Payment Only',         color: 'bg-amber-100 text-amber-800' },
  other:              { label: 'Other',                color: 'bg-gray-100 text-gray-600' },
};

const FOCUS_CFG: Record<TransportFocus, { label: string; color: string }> = {
  high:     { label: 'High',     color: 'bg-red-100 text-red-700' },
  moderate: { label: 'Moderate', color: 'bg-orange-100 text-orange-700' },
  low:      { label: 'Low',      color: 'bg-yellow-100 text-yellow-700' },
  none:     { label: 'None',     color: 'bg-gray-100 text-gray-400' },
};

const STATUS_CFG: Record<PlatformStatus, { label: string; pill: string; icon: React.ElementType }> = {
  active:          { label: 'Active',         pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', icon: CheckCircle2 },
  likely_defunct:  { label: 'Likely Defunct', pill: 'bg-red-50 text-red-600 ring-1 ring-red-200',            icon: XCircle },
  not_a_platform:  { label: 'Not a Platform', pill: 'bg-gray-50 text-gray-400 ring-1 ring-gray-200',          icon: AlertTriangle },
  unknown:         { label: 'Unknown',         pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',       icon: HelpCircle },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
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

function featuresFromText(text: string): string[] {
  return text
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function StatCard({ label, value, sub, accent = false, danger = false }: {
  label: string; value: number | string; sub?: string; accent?: boolean; danger?: boolean;
}) {
  return (
    <div className={`rounded-xl px-3 py-3 flex flex-col gap-0.5 ${danger ? 'bg-red-50 ring-1 ring-red-200' : accent ? 'bg-amber-50 ring-1 ring-amber-200' : 'bg-white ring-1 ring-gray-200'}`}>
      <span className={`text-2xl font-bold tabular-nums leading-none ${danger ? 'text-red-600' : accent ? 'text-amber-700' : 'text-gray-900'}`}>{value}</span>
      <span className={`text-[11px] font-medium leading-tight mt-1 ${danger ? 'text-red-400' : accent ? 'text-amber-500' : 'text-gray-400'}`}>{label}</span>
      {sub && <span className="text-[10px] text-gray-300 leading-tight">{sub}</span>}
    </div>
  );
}

function CategoryBadge({ category }: { category: Category }) {
  const cfg = CATEGORY_CFG[category];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function FocusBadge({ focus }: { focus: TransportFocus }) {
  const cfg = FOCUS_CFG[focus];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function StatusPill({ status }: { status: PlatformStatus }) {
  const cfg = STATUS_CFG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${cfg.pill}`}>
      <Icon className="w-3 h-3 flex-shrink-0" />
      {cfg.label}
    </span>
  );
}

function Stars({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-gray-200 text-xs tracking-tight">{'★★★★★'}</span>;
  return (
    <span className="text-xs tracking-tight" aria-label={`${rating} out of 5`}>
      <span className="text-amber-400">{Array(Math.round(rating)).fill('★').join('')}</span>
      <span className="text-gray-200">{Array(5 - Math.round(rating)).fill('★').join('')}</span>
    </span>
  );
}

function StarPicker({ value, onChange }: { value: number | null; onChange: (n: number | null) => void }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? value;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(value === n ? null : n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(null)}
          className="text-2xl leading-none transition-transform hover:scale-110 active:scale-95"
        >
          <span className={display !== null && n <= display ? 'text-amber-400' : 'text-gray-200'}>★</span>
        </button>
      ))}
      {value && (
        <button type="button" onClick={() => onChange(null)} className="ml-1 text-xs text-gray-300 hover:text-gray-500">
          clear
        </button>
      )}
    </div>
  );
}

function SortTh<F extends string>({
  field, sortField, sortDir, onSort, children, className = '',
}: {
  field: F; sortField: F; sortDir: SortDir; onSort: (f: F) => void; children: string; className?: string;
}) {
  const active = sortField === field;
  return (
    <th className={`px-4 py-3 text-left ${className}`}>
      <button
        onClick={() => onSort(field)}
        className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest transition-colors ${active ? 'text-gray-700' : 'text-gray-400 hover:text-gray-700'}`}
      >
        {children}
        <span className={`transition-opacity ${active ? 'opacity-100' : 'opacity-0'}`}>
          {active && sortDir === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </span>
      </button>
    </th>
  );
}

// ─── Add New Modal ────────────────────────────────────────────────────────────
function AddModal({ onClose, onAdded }: { onClose: () => void; onAdded: (c: Competitor) => void }) {
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [category, setCategory] = useState<Category>('ground_transport');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = async () => {
    if (!name.trim()) { setError('Name is required.'); return; }
    setSaving(true);
    const { data, error: err } = await supabase
      .from('system_competitors')
      .insert({ name: name.trim(), website: website.trim() || null, category })
      .select()
      .single();
    if (err) { setError(err.message); setSaving(false); return; }
    onAdded(data as Competitor);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[50]" onClick={onClose} />
      <div className="fixed inset-0 z-[51] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Add Competitor System</h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700">
              <X className="w-4 h-4" />
            </button>
          </div>
          {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg p-2">{error}</p>}
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 font-medium mb-1.5">Platform Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. MoovsApp"
                autoFocus
                className="w-full border border-gray-200 rounded-lg py-2 px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-medium mb-1.5">Website</label>
              <input
                type="url"
                value={website}
                onChange={e => setWebsite(e.target.value)}
                placeholder="https://…"
                className="w-full border border-gray-200 rounded-lg py-2 px-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-medium mb-1.5">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className="w-full border border-gray-200 rounded-lg py-2 px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(CATEGORY_CFG).map(([val, cfg]) => (
                  <option key={val} value={val}>{cfg.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} className="px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50">Cancel</button>
            <button
              onClick={handleAdd}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Slide-Over ───────────────────────────────────────────────────────────────
function SlideOver({
  competitor,
  onClose,
  onSave,
  onDelete,
}: {
  competitor: Competitor | null;
  onClose: () => void;
  onSave: (id: string, patch: Partial<Competitor>) => void;
  onDelete: (id: string) => void;
}) {
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [category, setCategory] = useState<Category>('ground_transport');
  const [transportFocus, setTransportFocus] = useState<TransportFocus>('high');
  const [airportTransport, setAirportTransport] = useState(false);
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [pricingModel, setPricingModel] = useState('');
  const [pricingStarting, setPricingStarting] = useState('');
  const [competitiveEdge, setCompetitiveEdge] = useState('');
  const [platformStatus, setPlatformStatus] = useState<PlatformStatus>('active');
  const [leadCount, setLeadCount] = useState(0);
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [verifiedUrl, setVerifiedUrl] = useState('');

  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!competitor) return;
    setName(competitor.name ?? '');
    setWebsite(competitor.website ?? '');
    setCategory(competitor.category);
    setTransportFocus(competitor.transport_focus);
    setAirportTransport(competitor.airport_transport ?? false);
    setDescription(competitor.description ?? '');
    setFeaturesText(Array.isArray(competitor.key_features) ? competitor.key_features.join('\n') : '');
    setPricingModel(competitor.pricing_model ?? '');
    setPricingStarting(competitor.pricing_starting ?? '');
    setCompetitiveEdge(competitor.competitive_edge ?? '');
    setPlatformStatus(competitor.platform_status);
    setLeadCount(competitor.lead_count ?? 0);
    setNotes(competitor.notes ?? '');
    setRating(competitor.rating ?? null);
    setVerifiedUrl(competitor.verified_primary_url ?? '');
    setSavedFlash(false);
    setConfirmDelete(false);
  }, [competitor?.id]);

  const handleSave = async () => {
    if (!competitor) return;
    setSaving(true);
    const patch: Partial<Competitor> = {
      name: name.trim() || competitor.name,
      website: website.trim() || null,
      category,
      transport_focus: transportFocus,
      airport_transport: airportTransport,
      description: description.trim() || null,
      key_features: featuresFromText(featuresText),
      pricing_model: pricingModel.trim() || null,
      pricing_starting: pricingStarting.trim() || null,
      competitive_edge: competitiveEdge.trim() || null,
      platform_status: platformStatus,
      lead_count: leadCount,
      notes: notes.trim() || null,
      rating: rating,
      verified_primary_url: verifiedUrl.trim() || null,
    };
    const { error } = await supabase
      .from('system_competitors')
      .update(patch)
      .eq('id', competitor.id);
    if (!error) {
      onSave(competitor.id, patch);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2200);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!competitor) return;
    setDeleting(true);
    const { error } = await supabase.from('system_competitors').delete().eq('id', competitor.id);
    if (!error) {
      onDelete(competitor.id);
      onClose();
    }
    setDeleting(false);
  };

  const isOpen = !!competitor;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/25 backdrop-blur-[2px] z-[45] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-[540px] bg-white shadow-2xl z-[46] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {competitor && (
          <>
            {/* Header */}
            <div className={`px-6 py-5 border-b border-gray-100 flex-shrink-0 ${competitor.platform_status === 'likely_defunct' ? 'bg-red-50/60' : competitor.platform_status === 'unknown' ? 'bg-amber-50/50' : competitor.category === 'ground_transport' ? 'bg-indigo-50/50' : ''}`}>
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-gray-900 truncate">{competitor.name}</h2>
                    <StatusPill status={competitor.platform_status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                    <CategoryBadge category={competitor.category} />
                    <FocusBadge focus={competitor.transport_focus} />
                    {competitor.airport_transport && (
                      <span className="text-xs font-semibold text-blue-500">✈ Airport</span>
                    )}
                    {competitor.website && (
                      <a
                        href={competitor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Globe className="w-3 h-3" />
                        {competitor.website.replace(/^https?:\/\//, '').split('/')[0]}
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
                <button onClick={onClose} className="flex-shrink-0 p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">

              {/* Meta stats */}
              <div className="px-6 py-4 grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900 tabular-nums">{leadCount}</div>
                  <div className="text-[10px] text-gray-400 font-medium">Leads in CRM</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center">
                    <Stars rating={rating} />
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium mt-0.5">Threat Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-700 truncate">{competitor.pricing_starting ?? '—'}</div>
                  <div className="text-[10px] text-gray-400 font-medium">Starting Price</div>
                </div>
              </div>

              {/* Rating */}
              <div className="px-6 py-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Competitive Threat Rating</p>
                <StarPicker value={rating} onChange={v => setRating(v)} />
              </div>

              {/* Primary details */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Platform Details</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Platform Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg py-2 px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Website</label>
                    <div className="flex gap-2">
                      <input type="url" value={website} onChange={e => setWebsite(e.target.value)}
                        placeholder="https://…"
                        className="flex-1 border border-gray-200 rounded-lg py-2 px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      {website && (
                        <a href={website} target="_blank" rel="noopener noreferrer"
                          className="flex-shrink-0 p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 font-medium mb-1.5">Category</label>
                      <select value={category} onChange={e => setCategory(e.target.value as Category)}
                        className="w-full border border-gray-200 rounded-lg py-2 px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {Object.entries(CATEGORY_CFG).map(([val, cfg]) => (
                          <option key={val} value={val}>{cfg.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 font-medium mb-1.5">Platform Status</label>
                      <select value={platformStatus} onChange={e => setPlatformStatus(e.target.value as PlatformStatus)}
                        className="w-full border border-gray-200 rounded-lg py-2 px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {Object.entries(STATUS_CFG).map(([val, cfg]) => (
                          <option key={val} value={val}>{cfg.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 font-medium mb-1.5">Transport Focus</label>
                      <select value={transportFocus} onChange={e => setTransportFocus(e.target.value as TransportFocus)}
                        className="w-full border border-gray-200 rounded-lg py-2 px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {Object.entries(FOCUS_CFG).map(([val, cfg]) => (
                          <option key={val} value={val}>{cfg.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 font-medium mb-1.5">Leads in CRM</label>
                      <input type="number" min={0} value={leadCount} onChange={e => setLeadCount(Number(e.target.value))}
                        className="w-full border border-gray-200 rounded-lg py-2 px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 cursor-pointer pt-1">
                      <input type="checkbox" checked={airportTransport} onChange={e => setAirportTransport(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 accent-blue-500" />
                      <span className="text-xs text-gray-500 font-medium">✈ Supports Airport Transport</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Pricing</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Pricing Model</label>
                    <input type="text" value={pricingModel} onChange={e => setPricingModel(e.target.value)}
                      placeholder="e.g. Monthly SaaS, Revenue share…"
                      className="w-full border border-gray-200 rounded-lg py-2 px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Starting Price</label>
                    <input type="text" value={pricingStarting} onChange={e => setPricingStarting(e.target.value)}
                      placeholder="e.g. $99/mo, Free + 6%…"
                      className="w-full border border-gray-200 rounded-lg py-2 px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              {/* Description & Competitive Edge */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Intelligence</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Description</label>
                    <textarea value={description} onChange={e => setDescription(e.target.value)}
                      rows={2} placeholder="What does this platform do?"
                      className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm text-gray-700 placeholder-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Competitive Edge</label>
                    <textarea value={competitiveEdge} onChange={e => setCompetitiveEdge(e.target.value)}
                      rows={2} placeholder="What makes them a threat / differentiator?"
                      className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm text-gray-700 placeholder-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Key Features <span className="text-gray-300">(one per line)</span></label>
                    <textarea value={featuresText} onChange={e => setFeaturesText(e.target.value)}
                      rows={4} placeholder="Real-time GPS tracking&#10;Automated dispatch&#10;White-label booking widget"
                      className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm text-gray-700 placeholder-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none font-mono" />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Internal Notes</p>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  rows={3} placeholder="Strategy notes, outreach ideas, monitoring reminders…"
                  className="w-full border border-gray-200 rounded-xl py-2.5 px-3 text-sm text-gray-700 placeholder-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none" />
              </div>

              {/* Verification */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Verification</p>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-500 font-medium mb-1.5">Verified Source URL</label>
                    <div className="flex gap-2">
                      <input type="url" value={verifiedUrl} onChange={e => setVerifiedUrl(e.target.value)}
                        placeholder="https://…"
                        className="flex-1 border border-gray-200 rounded-lg py-2 px-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      {verifiedUrl && (
                        <a href={verifiedUrl} target="_blank" rel="noopener noreferrer"
                          className="flex-shrink-0 p-2 rounded-lg bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-300">
                    <span>Last updated:</span>
                    <span>{timeAgo(competitor.updated_at)}</span>
                    {competitor.verified_at && (
                      <>
                        <span>·</span>
                        <span>Verified {timeAgo(competitor.verified_at)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Key Features Preview (read-only chips) */}
              {competitor.key_features?.length > 0 && (
                <div className="px-6 py-4">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Current Features on Record</p>
                  <div className="flex flex-wrap gap-1.5">
                    {competitor.key_features.map((f, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-600">{f}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Danger zone */}
              <div className="px-6 py-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Danger Zone</p>
                {!confirmDelete ? (
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete this record
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-red-500 font-medium">Confirm delete?</p>
                    <button onClick={handleDelete} disabled={deleting}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 disabled:opacity-50">
                      {deleting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                      Delete
                    </button>
                    <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:bg-gray-50">Cancel</button>
                  </div>
                )}
              </div>

              <div className="h-8" />
            </div>

            {/* Footer save bar */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
              <span className={`text-xs font-medium transition-all duration-300 ${savedFlash ? 'text-emerald-500 opacity-100' : 'opacity-0'}`}>
                ✓ Saved
              </span>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 disabled:opacity-50 transition-colors ml-auto"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function CompetitorSystems() {
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Competitor | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<PlatformStatus | 'all'>('all');
  const [focusFilter, setFocusFilter] = useState<TransportFocus | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('lead_count');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [showAdd, setShowAdd] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    fetchCompetitors();
  }, []);

  const fetchCompetitors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('system_competitors')
      .select('*')
      .order('lead_count', { ascending: false });
    if (error) { setFetchError(error.message); setLoading(false); return; }
    setCompetitors((data as Competitor[]) ?? []);
    setLoading(false);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const handleSave = (id: string, patch: Partial<Competitor>) => {
    setCompetitors(prev => prev.map(c => c.id === id ? { ...c, ...patch } : c));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, ...patch } : null);
  };

  const handleDelete = (id: string) => {
    setCompetitors(prev => prev.filter(c => c.id !== id));
    setSelected(null);
  };

  const handleAdded = (c: Competitor) => {
    setCompetitors(prev => [c, ...prev]);
    setSelected(c);
  };

  // Derived stats
  const groundCount  = competitors.filter(c => c.category === 'ground_transport').length;
  const highFocus    = competitors.filter(c => c.transport_focus === 'high').length;
  const defunctCount = competitors.filter(c => c.platform_status === 'likely_defunct' || c.platform_status === 'unknown').length;

  // Filter + search
  const filtered = competitors
    .filter(c => {
      if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && c.platform_status !== statusFilter) return false;
      if (focusFilter !== 'all' && c.transport_focus !== focusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          (c.description ?? '').toLowerCase().includes(q) ||
          (c.competitive_edge ?? '').toLowerCase().includes(q) ||
          (c.pricing_starting ?? '').toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      let av: string | number = a[sortField] ?? '';
      let bv: string | number = b[sortField] ?? '';
      if (typeof av === 'string') av = av.toLowerCase();
      if (typeof bv === 'string') bv = bv.toLowerCase();
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="px-6 pt-8 pb-4">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-500" />
              Competitor Systems
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">Reservation & dispatch platforms used by leads in our CRM</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchCompetitors}
              className="p-2 rounded-lg text-gray-400 hover:bg-white hover:text-gray-700 hover:shadow-sm transition-all"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add System
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <StatCard label="Total Systems" value={competitors.length} />
          <StatCard label="Ground Transport" value={groundCount} />
          <StatCard label="High Transport Focus" value={highFocus} accent />
          <StatCard label="Defunct / Unknown" value={defunctCount} danger />
        </div>

        {/* Quick category filter pills */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${categoryFilter === 'all' ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
          >
            All Categories
          </button>
          {Object.entries(CATEGORY_CFG).map(([val, cfg]) => (
            <button
              key={val}
              onClick={() => setCategoryFilter(categoryFilter === val as Category ? 'all' : val as Category)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${categoryFilter === val ? `${cfg.color} border-transparent` : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
            >
              {cfg.label}
            </button>
          ))}
        </div>

        {/* Search + filters row */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search platforms, features, pricing…"
              className="w-full border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as PlatformStatus | 'all')}
            className="border border-gray-200 rounded-xl py-2 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_CFG).map(([val, cfg]) => (
              <option key={val} value={val}>{cfg.label}</option>
            ))}
          </select>
          <select
            value={focusFilter}
            onChange={e => setFocusFilter(e.target.value as TransportFocus | 'all')}
            className="border border-gray-200 rounded-xl py-2 px-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Focus Levels</option>
            {Object.entries(FOCUS_CFG).map(([val, cfg]) => (
              <option key={val} value={val}>{cfg.label} Transport Focus</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="px-6 pb-12">
        {fetchError && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl p-4 mb-4">{fetchError}</div>
        )}
        <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: `${i * 120}ms` }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-sm">
              {search || categoryFilter !== 'all' || statusFilter !== 'all' || focusFilter !== 'all'
                ? 'No platforms match your filters.'
                : 'No platforms found.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-gray-50/50">
                  <tr>
                    <SortTh<SortField> field="name" sortField={sortField} sortDir={sortDir} onSort={handleSort}>Platform</SortTh>
                    <SortTh<SortField> field="category" sortField={sortField} sortDir={sortDir} onSort={handleSort}>Category</SortTh>
                    <SortTh<SortField> field="transport_focus" sortField={sortField} sortDir={sortDir} onSort={handleSort}>Focus</SortTh>
                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-400">Pricing</th>
                    <SortTh<SortField> field="lead_count" sortField={sortField} sortDir={sortDir} onSort={handleSort}>Leads</SortTh>
                    <SortTh<SortField> field="rating" sortField={sortField} sortDir={sortDir} onSort={handleSort}>Rating</SortTh>
                    <SortTh<SortField> field="platform_status" sortField={sortField} sortDir={sortDir} onSort={handleSort}>Status</SortTh>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(c => (
                    <tr
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className={`cursor-pointer transition-colors hover:bg-blue-50/40 ${selected?.id === c.id ? 'bg-blue-50/60' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900 text-sm">{c.name}</div>
                        {c.website && (
                          <a
                            href={c.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="flex items-center gap-0.5 text-[11px] text-gray-400 hover:text-blue-500 transition-colors mt-0.5"
                          >
                            <Globe className="w-2.5 h-2.5" />
                            {c.website.replace(/^https?:\/\//, '').split('/')[0]}
                            <ArrowUpRight className="w-2.5 h-2.5" />
                          </a>
                        )}
                        {c.airport_transport && (
                          <span className="text-[10px] text-blue-400 font-medium">✈ Airport</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <CategoryBadge category={c.category} />
                      </td>
                      <td className="px-4 py-3">
                        <FocusBadge focus={c.transport_focus} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-gray-700 font-medium">{c.pricing_starting ?? <span className="text-gray-300">—</span>}</div>
                        {c.pricing_model && <div className="text-[10px] text-gray-400 mt-0.5">{c.pricing_model}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold tabular-nums ${c.lead_count >= 10 ? 'text-indigo-600' : c.lead_count >= 5 ? 'text-gray-700' : 'text-gray-400'}`}>
                          {c.lead_count}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Stars rating={c.rating} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={c.platform_status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={e => { e.stopPropagation(); setSelected(c); }}
                          className="p-1.5 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer count */}
          {!loading && filtered.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-50 bg-gray-50/40">
              <span className="text-xs text-gray-400 tabular-nums">
                {filtered.length} of {competitors.length} system{competitors.length !== 1 ? 's' : ''}
                {(categoryFilter !== 'all' || statusFilter !== 'all' || focusFilter !== 'all' || search) && ' (filtered)'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Side-Over */}
      <SlideOver
        competitor={selected}
        onClose={() => setSelected(null)}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      {/* Add Modal */}
      {showAdd && <AddModal onClose={() => setShowAdd(false)} onAdded={handleAdded} />}
    </div>
  );
}
