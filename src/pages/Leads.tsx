import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import type { ColumnDef, SortingState, Row, Column } from '@tanstack/react-table';
import { ChevronsUpDown, Loader2, Globe, Check, X, Plus, Trash2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';

/* ─── Types ─── */
interface Lead {
  id: string; name: string; phone: string; address: string; city: string;
  state: string; website: string; review_count?: number;
  reservation_page_url: string; is_hudson_customer?: boolean;
  reservation_system?: string; lead_claimed_by: string;
  engagement_status: string; lead_notes: string;
  domain?: string; score?: number; next_follow_up?: string;
  [key: string]: any;
}
type TabType = 'arizona' | 'national';

const DB_COLUMNS = {
  arizona: { lead_claimed_by: 'Lead Claimed By (Ahmad or Moaz)', engagement_status: 'Engagement Status', lead_notes: 'Notes' },
  national: { lead_claimed_by: 'Lead Claimed By (Ahmad or Moaz)', engagement_status: 'Engagement Status', lead_notes: 'notes' },
} as const;

function uiToDbField(f: string, tab: TabType): string {
  return (DB_COLUMNS[tab] as Record<string, string>)[f] ?? f;
}
function normalizeRow(raw: any, tab: TabType): Lead {
  return {
    ...raw,
    lead_claimed_by: raw['Lead Claimed By (Ahmad or Moaz)'] ?? '',
    engagement_status: raw['Engagement Status'] ?? '',
    lead_notes: tab === 'arizona' ? (raw['Notes'] ?? '') : (raw['notes'] ?? ''),
  };
}

/* ═══════════════════════════════════════════════════════════
   EditableCell — isolated component so typing doesn't
   re-render the entire table and lose focus.
   This is the fix for the single-letter bug.
   ═══════════════════════════════════════════════════════════ */
interface EditableCellProps {
  row: Lead;
  field: string;
  activeTab: TabType;
  tableName: string;
  onUpdate: (id: string, field: string, value: any) => Promise<void>;
  onOpenSheet: (id: string, value: string, field: string) => void;
}

const EditableCell = ({ row, field, activeTab, tableName, onUpdate, onOpenSheet }: EditableCellProps) => {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const value = row[field] ?? '';

  const startEdit = () => {
    if (field === 'lead_notes' || field === 'address') {
      onOpenSheet(row.id, String(value || ''), field);
      return;
    }
    setEditing(true);
    setLocalValue(String(value || ''));
  };

  const commitValue = async (val?: string) => {
    const newVal = val !== undefined ? val : localValue;
    setEditing(false);
    if (newVal === String(value || '')) return;
    setSaving(true);
    await onUpdate(row.id, field, newVal === '' ? null : newVal);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 10);
    let r = '';
    if (d.length > 0) r += '(' + d.slice(0, 3);
    if (d.length >= 4) r += ') ' + d.slice(3, 6);
    if (d.length >= 7) r += '-' + d.slice(6, 10);
    return r;
  };

  if (saving) return <Loader2 className="animate-spin w-4 h-4 text-blue-500" />;
  if (saved) return <Check className="w-4 h-4 text-green-500" />;

  /* ── Editing mode ── */
  if (editing) {
    if (field === 'lead_claimed_by') {
      return (
        <div className="relative" data-claimed-picker>
          <div className="flex flex-col bg-white border border-blue-400 rounded shadow-lg overflow-hidden text-sm">
            {['', 'Ahmad', 'Moaz'].map((opt) => (
              <button key={opt} type="button"
                className={`px-3 py-1.5 text-left hover:bg-blue-50 transition-colors ${localValue === opt ? 'bg-blue-100 font-medium' : ''}`}
                onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); commitValue(opt); }}
              >{opt || '(none)'}</button>
            ))}
          </div>
        </div>
      );
    }

    if (field === 'is_hudson_customer') {
      return (
        <input type="checkbox" autoFocus className="w-4 h-4 accent-blue-600"
          checked={localValue === 'true'}
          onChange={(e) => commitValue(e.target.checked ? 'true' : 'false')}
          onBlur={() => setEditing(false)}
        />
      );
    }

    return (
      <input
        autoFocus
        className="w-full h-8 border border-blue-400 rounded px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        placeholder={field === 'engagement_status' ? 'e.g. Contacted, Meeting Set...' : ''}
        value={localValue}
        onFocus={(e) => e.target.select()}
        onChange={(e) => {
          let v = e.target.value;
          if (field === 'phone') v = formatPhone(v);
          setLocalValue(v);
        }}
        onBlur={() => commitValue()}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
          if (e.key === 'Escape') setEditing(false);
        }}
      />
    );
  }

  /* ── Read-only display ── */
  // Notes
  if (field === 'lead_notes') {
    const s = String(value || '');
    return (
      <span className="cursor-pointer text-blue-600 hover:underline truncate block"
        onClick={(e) => { e.stopPropagation(); onOpenSheet(row.id, s, 'lead_notes'); }}
      >{s ? (s.length > 30 ? s.slice(0, 30) + '...' : s) : '\u2014'}</span>
    );
  }
  // Address
  if (field === 'address') {
    const s = String(value || '');
    return (
      <span className="cursor-pointer hover:underline truncate block"
        onClick={(e) => { e.stopPropagation(); onOpenSheet(row.id, s, 'address'); }}
      >{s ? (s.length > 35 ? s.slice(0, 35) + '...' : s) : '\u2014'}</span>
    );
  }
  // URLs
  if ((field === 'website' || field === 'reservation_page_url') && value) {
    return (
      <button className="flex items-center justify-center w-full"
        onClick={(e) => { e.stopPropagation(); window.open(String(value), '_blank'); }}
      ><Globe className="w-4 h-4 text-blue-600 hover:text-blue-800" /></button>
    );
  }
  // Status badge
  if (field === 'engagement_status') {
    const s = String(value || '');
    if (!s) return <span className="text-slate-400 text-xs cursor-pointer" onClick={startEdit}>{'\u2014'}</span>;
    const l = s.toLowerCase();
    let c = 'bg-slate-100 text-slate-700';
    if (l.includes('new')) c = 'bg-blue-100 text-blue-800';
    if (l.includes('contact')) c = 'bg-amber-100 text-amber-800';
    if (l.includes('meeting')) c = 'bg-purple-100 text-purple-800';
    if (l.includes('proposal')) c = 'bg-indigo-100 text-indigo-800';
    if (l.includes('won') || l.includes('closed')) c = 'bg-green-100 text-green-800';
    if (l.includes('lost') || l.includes('not interested')) c = 'bg-red-100 text-red-800';
    if (l.includes('follow')) c = 'bg-orange-100 text-orange-800';
    return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer ${c}`} onClick={startEdit}>{s}</span>;
  }
  // Claimed badge
  if (field === 'lead_claimed_by') {
    const s = String(value || '');
    if (!s) return <span className="text-slate-400 text-xs cursor-pointer" onClick={startEdit}>{'\u2014'}</span>;
    const c = s === 'Ahmad' ? 'bg-cyan-100 text-cyan-800' : s === 'Moaz' ? 'bg-violet-100 text-violet-800' : 'bg-slate-100 text-slate-700';
    return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer ${c}`} onClick={startEdit}>{s}</span>;
  }
  // Hudson
  if (field === 'is_hudson_customer') {
    return <span className={`cursor-pointer ${value ? 'text-green-700 font-medium' : 'text-slate-500'}`} onClick={startEdit}>{value ? 'Yes' : 'No'}</span>;
  }
  // Review count / Score
  if (field === 'review_count') return <span className="tabular-nums cursor-pointer" onClick={startEdit}>{value ?? 0}</span>;
  if (field === 'score') return <span className="tabular-nums cursor-pointer" onClick={startEdit}>{value ?? '\u2014'}</span>;

  // Default text
  return (
    <span className={`${field === 'phone' ? 'font-mono' : ''} truncate block cursor-pointer`} onClick={startEdit}>
      {String(value || '\u2014')}
    </span>
  );
};

/* ═══════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════ */
export const Leads = () => {
  const [activeTab, setActiveTab] = useState<TabType>('arizona');
  const [arizona, setArizona] = useState<Lead[]>([]);
  const [national, setNational] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});
  const [columnsOpen, setColumnsOpen] = useState(false);
  const columnsRef = useRef<HTMLDivElement>(null);
  const [columnSizing, setColumnSizing] = useState<Record<string, number>>({});
  const [sheetInfo, setSheetInfo] = useState<{ id: string; field: string; value: string; leadName: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [addFormData, setAddFormData] = useState<Record<string, string>>({});
  const [addSaving, setAddSaving] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const tableName = activeTab === 'arizona' ? 'az_transport_businesses' : 'national_leads';
  const data = activeTab === 'arizona' ? arizona : national;
  const setData = activeTab === 'arizona' ? setArizona : setNational;

  // Click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (columnsRef.current && !columnsRef.current.contains(e.target as Node)) setColumnsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Load data
  useEffect(() => {
    (async () => {
      setIsFetching(true);
      const [{ data: az, error: ez }, { data: nl, error: en }] = await Promise.all([
        supabase.from('az_transport_businesses').select('*'),
        supabase.from('national_leads').select('*'),
      ]);
      if (ez) { console.error(ez); toast.error('Failed to load Arizona leads'); }
      else setArizona((az || []).map((r: any) => normalizeRow(r, 'arizona')));
      if (en) { console.error(en); toast.error('Failed to load National leads'); }
      else setNational((nl || []).map((r: any) => normalizeRow(r, 'national')));
      setLoading(false); setIsFetching(false);
    })();
  }, []);

  // Realtime
  useEffect(() => {
    const azCh = supabase.channel('az-rt').on('postgres_changes', { event: '*', schema: 'public', table: 'az_transport_businesses' },
      (p) => {
        if (p.eventType === 'INSERT') { setArizona((prev) => [...prev, normalizeRow(p.new, 'arizona')]); }
        else if (p.eventType === 'UPDATE') { const u = normalizeRow(p.new, 'arizona'); setArizona((prev) => prev.map((r) => r.id === u.id ? { ...r, ...u } : r)); }
        else if (p.eventType === 'DELETE') { setArizona((prev) => prev.filter((r) => r.id !== (p.old as any).id)); }
      }).subscribe();
    const nlCh = supabase.channel('nl-rt').on('postgres_changes', { event: '*', schema: 'public', table: 'national_leads' },
      (p) => {
        if (p.eventType === 'INSERT') { setNational((prev) => [...prev, normalizeRow(p.new, 'national')]); }
        else if (p.eventType === 'UPDATE') { const u = normalizeRow(p.new, 'national'); setNational((prev) => prev.map((r) => r.id === u.id ? { ...r, ...u } : r)); }
        else if (p.eventType === 'DELETE') { setNational((prev) => prev.filter((r) => r.id !== (p.old as any).id)); }
      }).subscribe();
    return () => { supabase.removeChannel(azCh); supabase.removeChannel(nlCh); };
  }, []);

  // Update cell
  const updateCell = useCallback(async (id: string, field: string, newValue: any) => {
    const dbField = uiToDbField(field, activeTab);
    // Handle boolean fields
    if (field === 'is_hudson_customer') {
      newValue = newValue === 'true' || newValue === true;
    }
    const { error } = await supabase.from(tableName).update({ [dbField]: newValue }).eq('id', id);
    if (error) { console.error(error); toast.error('Failed to save'); }
    else {
      toast.success('Saved');
      setData((prev: Lead[]) => prev.map((r) => r.id === id ? { ...r, [field]: newValue ?? '', [dbField]: newValue } : r));
    }
  }, [activeTab, tableName, setData]);

  // ★ Add Lead — form fields per tab (only user-facing ones)
  const addFormFields = useMemo(() => {
    if (activeTab === 'arizona') {
      return [
        { key: 'name', label: 'Business Name', placeholder: 'e.g. Phoenix Airport Shuttle' },
        { key: 'phone', label: 'Phone', placeholder: '(602) 555-1234' },
        { key: 'address', label: 'Address', placeholder: '123 Main St, Phoenix, AZ 85001' },
        { key: 'city', label: 'City', placeholder: 'Phoenix' },
        { key: 'state', label: 'State', placeholder: 'AZ', defaultValue: 'AZ' },
        { key: 'website', label: 'Website', placeholder: 'https://...' },
        { key: 'reservation_page_url', label: 'Reservation URL', placeholder: 'https://...' },
        { key: 'reservation_system', label: 'Reservation System', placeholder: 'e.g. phone_only, direct, Hudson' },
        { key: 'Notes', label: 'Notes', placeholder: 'Any notes...', multiline: true },
      ];
    }
    return [
      { key: 'name', label: 'Business Name', placeholder: 'e.g. Metro Shuttle Service' },
      { key: 'phone', label: 'Phone', placeholder: '(555) 555-1234' },
      { key: 'address', label: 'Address', placeholder: '123 Main St, City, ST 12345' },
      { key: 'city', label: 'City', placeholder: 'New York' },
      { key: 'state', label: 'State', placeholder: 'NY' },
      { key: 'website', label: 'Website', placeholder: 'https://...' },
      { key: 'domain', label: 'Domain', placeholder: 'example.com' },
      { key: 'reservation_page_url', label: 'Reservation URL', placeholder: 'https://...' },
      { key: 'reservation_system', label: 'Reservation System', placeholder: 'e.g. phone_only, direct' },
      { key: 'notes', label: 'Notes', placeholder: 'Any notes...', multiline: true },
    ];
  }, [activeTab]);

  const openAddForm = useCallback(() => {
    // Pre-fill defaults
    const defaults: Record<string, string> = {};
    addFormFields.forEach((f) => {
      defaults[f.key] = (f as any).defaultValue ?? '';
    });
    setAddFormData(defaults);
    setAddFormOpen(true);
  }, [addFormFields]);

  const closeAddForm = useCallback(() => { setAddFormOpen(false); setAddFormData({}); }, []);

  const submitAddForm = useCallback(async () => {
    // Build the insert payload
    const payload: Record<string, any> = {};

    // Copy user-entered fields (skip empty strings)
    for (const [key, val] of Object.entries(addFormData)) {
      if (val.trim()) payload[key] = val.trim();
    }

    // Auto-generate required NOT NULL fields the user shouldn't care about
    if (activeTab === 'arizona') {
      payload.yelp_id = `manual_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    } else {
      payload.place_id = `manual_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    }

    setAddSaving(true);
    const { data: inserted, error } = await supabase.from(tableName).insert(payload).select().single();
    if (error) {
      console.error(error);
      toast.error(`Failed to add lead: ${error.message}`);
    } else {
      const normalized = normalizeRow(inserted, activeTab);
      setData((prev: Lead[]) => [normalized, ...prev]);
      toast.success('Lead added!');
      closeAddForm();
    }
    setAddSaving(false);
  }, [addFormData, activeTab, tableName, setData, closeAddForm]);

  // Delete row
  const deleteRow = useCallback(async (id: string) => {
    setIsFetching(true);
    const { error } = await supabase.from(tableName).delete().eq('id', id);
    if (error) { console.error(error); toast.error('Failed to delete lead'); }
    else {
      setData((prev: Lead[]) => prev.filter((r) => r.id !== id));
      toast.success('Lead deleted');
    }
    setDeleteConfirm(null);
    setIsFetching(false);
  }, [tableName, setData]);

  // Notes sheet
  const openNotesSheet = useCallback((id: string, value: string, field: string) => {
    const row = data.find((r) => r.id === id);
    setSheetInfo({ id, field, value, leadName: row?.name ?? 'Unknown' });
  }, [data]);
  const closeNotesSheet = useCallback(() => setSheetInfo(null), []);
  const saveNotesSheet = useCallback(async () => {
    if (!sheetInfo) return;
    await updateCell(sheetInfo.id, sheetInfo.field, sheetInfo.value);
    closeNotesSheet();
  }, [sheetInfo, updateCell, closeNotesSheet]);

  /* ─── Column defs — NO dependency on editing state ─── */
  const columnsDef = useMemo<ColumnDef<Lead>[]>(() => {
    const base: { key: string; header: string; size: number; minSize: number; maxSize: number; tabs: TabType[] }[] = [
      { key: 'name', header: 'Name', size: 200, minSize: 120, maxSize: 400, tabs: ['arizona', 'national'] },
      { key: 'phone', header: 'Phone', size: 140, minSize: 100, maxSize: 200, tabs: ['arizona', 'national'] },
      { key: 'address', header: 'Address', size: 220, minSize: 100, maxSize: 400, tabs: ['arizona', 'national'] },
      { key: 'city', header: 'City', size: 120, minSize: 60, maxSize: 200, tabs: ['arizona', 'national'] },
      { key: 'state', header: 'State', size: 60, minSize: 40, maxSize: 100, tabs: ['arizona', 'national'] },
      { key: 'website', header: 'Website', size: 80, minSize: 50, maxSize: 120, tabs: ['arizona', 'national'] },
      { key: 'review_count', header: 'Reviews', size: 80, minSize: 60, maxSize: 120, tabs: ['arizona'] },
      { key: 'score', header: 'Score', size: 60, minSize: 40, maxSize: 100, tabs: ['national'] },
      { key: 'domain', header: 'Domain', size: 140, minSize: 80, maxSize: 300, tabs: ['national'] },
      { key: 'reservation_page_url', header: 'Reservation', size: 100, minSize: 60, maxSize: 150, tabs: ['arizona', 'national'] },
      { key: 'is_hudson_customer', header: 'Hudson?', size: 80, minSize: 60, maxSize: 120, tabs: ['arizona', 'national'] },
      { key: 'reservation_system', header: 'Res. System', size: 120, minSize: 80, maxSize: 200, tabs: ['arizona', 'national'] },
      { key: 'lead_claimed_by', header: 'Claimed By', size: 110, minSize: 80, maxSize: 180, tabs: ['arizona', 'national'] },
      { key: 'engagement_status', header: 'Status', size: 140, minSize: 80, maxSize: 250, tabs: ['arizona', 'national'] },
      { key: 'lead_notes', header: 'Notes', size: 180, minSize: 100, maxSize: 400, tabs: ['arizona', 'national'] },
    ];
    return base.filter((c) => c.tabs.includes(activeTab)).map((c) => ({
      accessorKey: c.key,
      header: c.header,
      size: c.size,
      minSize: c.minSize,
      maxSize: c.maxSize,
      enableResizing: true,
      // ★ cell renders EditableCell which manages its OWN editing state
      // This means typing doesn't cause column re-creation
      cell: ({ row }: { row: Row<Lead> }) => (
        <EditableCell
          row={row.original}
          field={c.key}
          activeTab={activeTab}
          tableName={tableName}
          onUpdate={updateCell}
          onOpenSheet={openNotesSheet}
        />
      ),
    }));
  }, [activeTab, tableName, updateCell, openNotesSheet]);

  const table = useReactTable({
    data,
    columns: columnsDef,
    state: { sorting, columnVisibility, globalFilter, columnSizing },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onColumnSizingChange: setColumnSizing,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) =>
      String(row.getValue(columnId) ?? '').toLowerCase().includes(String(filterValue).toLowerCase()),
  });

  const friendlyName = (id: string): string => {
    const m: Record<string, string> = { lead_claimed_by: 'Claimed By', engagement_status: 'Status', lead_notes: 'Notes', reservation_page_url: 'Reservation', is_hudson_customer: 'Hudson?', reservation_system: 'Res. System', review_count: 'Reviews' };
    return m[id] ?? id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g, ' ');
  };

  if (loading) return <div className="flex items-center justify-center h-full bg-slate-50"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>;

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 overflow-hidden">
      <Toaster position="bottom-right" richColors />

      {/* TOOLBAR */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0 gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <div className="inline-flex rounded-lg border border-slate-200 overflow-hidden">
            {(['arizona', 'national'] as TabType[]).map((tab) => (
              <button key={tab} className={`px-5 py-2 text-sm font-medium transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                onClick={() => { setActiveTab(tab); setGlobalFilter(''); }}>{tab === 'arizona' ? 'Arizona Leads' : 'National Leads'}</button>
            ))}
          </div>
          {/* ★ Add Lead button */}
          <button onClick={openAddForm} className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
        <span className="text-xs text-slate-500 shrink-0">{table.getRowModel().rows.length} leads</span>
        <input type="text" placeholder="Search leads..." className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-300" value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} />
        <div className="relative shrink-0" ref={columnsRef}>
          <button className="border border-slate-200 rounded-lg px-3 py-2 text-sm hover:bg-slate-50" onClick={() => setColumnsOpen((p) => !p)}>Columns {'\u25BE'}</button>
          {columnsOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-lg shadow-lg p-3 z-50">
              <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Toggle Columns</div>
              {table.getAllLeafColumns().map((col: Column<Lead, unknown>) => (
                <label key={col.id} className="flex items-center gap-2 py-1 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-blue-600 rounded" checked={col.getIsVisible()} onChange={(e) => col.toggleVisibility(e.target.checked)} />{friendlyName(col.id)}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {isFetching && <div className="h-1 w-full bg-blue-100 shrink-0"><div className="h-1 bg-blue-600 animate-pulse w-full" /></div>}

      {/* TABLE */}
      <div className="flex-1 overflow-auto" ref={tableContainerRef}>
        <table className="w-full text-sm border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {/* Delete column header */}
                <th className="px-2 py-2.5 w-10 border-b border-slate-200 bg-slate-50" />
                {hg.headers.map((header) => (
                  <th key={header.id}
                    style={{ width: header.getSize() }}
                    className="relative px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 cursor-pointer select-none hover:bg-slate-100 transition-colors whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1" onClick={header.column.getToggleSortingHandler()}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <ChevronsUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                    <div onMouseDown={header.getResizeHandler()} onTouchStart={header.getResizeHandler()}
                      className={`absolute top-0 right-0 w-1.5 h-full cursor-col-resize select-none touch-none hover:bg-blue-400 ${header.column.getIsResizing() ? 'bg-blue-600' : 'bg-transparent'}`} />
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr><td className="p-12 text-center text-slate-400" colSpan={columnsDef.length + 1}>No leads found</td></tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 hover:bg-blue-50/40 transition-colors group">
                  {/* ★ Delete button — shows on hover */}
                  <td className="px-2 py-2 w-10 align-middle">
                    {deleteConfirm === row.original.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => deleteRow(row.original.id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Yes</button>
                        <button onClick={() => setDeleteConfirm(null)} className="text-slate-500 hover:text-slate-700 text-xs">No</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(row.original.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}
                      style={{ width: cell.column.getSize() }}
                      className="px-3 py-2 align-middle"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* NOTES / ADDRESS SHEET */}
      {sheetInfo && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={closeNotesSheet} />
          <div className="w-full max-w-md bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">{sheetInfo.leadName}</h2>
                <p className="text-xs text-slate-500 mt-0.5">{sheetInfo.field === 'lead_notes' ? 'Notes' : 'Address'} &middot; Cmd+Enter to save</p>
              </div>
              <button onClick={closeNotesSheet} className="p-1 rounded hover:bg-slate-100"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="flex-1 p-6">
              <textarea autoFocus className="w-full h-full min-h-[200px] border border-slate-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={sheetInfo.value} onChange={(e) => setSheetInfo((p) => p ? { ...p, value: e.target.value } : null)}
                onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); saveNotesSheet(); } }} />
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50" onClick={closeNotesSheet}>Cancel</button>
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700" onClick={saveNotesSheet}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ★ ADD LEAD FORM SHEET */}
      {addFormOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={closeAddForm} />
          <div className="w-full max-w-lg bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Add {activeTab === 'arizona' ? 'Arizona' : 'National'} Lead
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Fill in what you know, leave the rest blank</p>
              </div>
              <button onClick={closeAddForm} className="p-1 rounded hover:bg-slate-100"><X className="w-5 h-5 text-slate-500" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {addFormFields.map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
                  {(f as any).multiline ? (
                    <textarea
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                      rows={3}
                      placeholder={f.placeholder}
                      value={addFormData[f.key] || ''}
                      onChange={(e) => setAddFormData((p) => ({ ...p, [f.key]: e.target.value }))}
                    />
                  ) : (
                    <input
                      type="text"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                      placeholder={f.placeholder}
                      value={addFormData[f.key] || ''}
                      onChange={(e) => setAddFormData((p) => ({ ...p, [f.key]: e.target.value }))}
                      onKeyDown={(e) => { if (e.key === 'Enter') submitAddForm(); }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50" onClick={closeAddForm}>Cancel</button>
              <button
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 inline-flex items-center gap-2"
                onClick={submitAddForm}
                disabled={addSaving}
              >
                {addSaving && <Loader2 className="animate-spin w-4 h-4" />}
                {addSaving ? 'Saving...' : 'Add Lead'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};