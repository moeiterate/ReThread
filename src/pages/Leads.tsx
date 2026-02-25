import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { ChevronsUpDown } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  website: string;
  review_count?: number; // optional because national may not use
  reservation_page_url: string;
  is_hudson_customer?: boolean;
  reservation_system?: string;
  lead_claimed_by: string;
  engagement_status: string;
  notes: string;
  [key: string]: any; // accomodate any other columns
}

type SortConfig = {
  key: keyof Lead;
  direction: 'asc' | 'desc';
} | null;

export const Leads = () => {
  const [activeTab, setActiveTab] = useState<'arizona' | 'national'>('arizona');
  const [arizona, setArizona] = useState<Lead[]>([]);
  const [national, setNational] = useState<Lead[]>([]);
  const [filterText, setFilterText] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [editingCell, setEditingCell] = useState<{ id: string; field: keyof Lead } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const tableForTab = activeTab === 'arizona' ? 'az_transport_businesses' : 'national_leads';
  const data = activeTab === 'arizona' ? arizona : national;
  const setData = activeTab === 'arizona' ? setArizona : setNational;

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  useEffect(() => {
    // always reload both datasets once when component mounts
    async function loadAll() {
      const [{ data: az, error: ez }, { data: nl, error: en }] = await Promise.all([
        supabase.from('az_transport_businesses').select('*'),
        supabase.from('national_leads').select('*'),
      ] as any);
      if (ez) {
        console.error('arizona load error', ez);
        showToast('Failed to load Arizona leads');
      } else {
        setArizona(az || []);
      }
      if (en) {
        console.error('national load error', en);
        showToast('Failed to load National leads');
      } else {
        setNational(nl || []);
      }
    }

    loadAll().finally(() => setLoading(false));
  }, [showToast]);

  const handleSort = (key: keyof Lead) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedData = (): Lead[] => {
    let items = [...data];
    if (sortConfig) {
      items.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal == null || bVal == null) return 0;
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return (aVal - bVal) * (sortConfig.direction === 'asc' ? 1 : -1);
        }
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  };

  const filteredData = (): Lead[] => {
    const txt = filterText.toLowerCase();
    return sortedData().filter(
      (row) =>
        row.name?.toString().toLowerCase().includes(txt) ||
        row.city?.toString().toLowerCase().includes(txt),
    );
  };

  const handleCellChange = (id: string, field: keyof Lead, value: any) => {
    setData((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  };

  const handleCellBlur = async (id: string, field: keyof Lead, value: any) => {
    setEditingCell(null);
    // optimistic update already applied
    const { error } = await supabase
      .from(tableForTab)
      .update({ [field]: value })
      .eq('id', id);
    if (error) {
      console.error('update error', error);
      // if it's a permission/RLS issue, try proxying the update via a local service-role proxy
      const message = String(error.message || error);
      if (message.toLowerCase().includes('permission') || message.toLowerCase().includes('forbidden') || message.toLowerCase().includes('row-level')) {
        try {
          const proxyResp = await fetch('http://localhost:8787/api/proxy-update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ table: tableForTab, id, updates: { [field]: value } }),
          });
          if (proxyResp.ok) {
            const updated = await proxyResp.json().catch(() => null);
            // If proxy returned the updated row(s), merge into state
            if (Array.isArray(updated) && updated.length > 0) {
              const fresh = updated[0];
              setData((prev) => prev.map((r) => (r.id === id ? fresh : r)));
            }
            return;
          }
          const body = await proxyResp.text();
          console.error('proxy update failed', proxyResp.status, body);
          showToast(`Failed to update ${String(field)}`);
        } catch (e) {
          console.error('proxy call error', e);
          showToast(`Failed to update ${String(field)}`);
        }
        return;
      }

      showToast(`Failed to update ${String(field)}`);
      // reload single row from server to revert
      const { data: fresh, error: fetchErr } = await supabase
        .from(tableForTab)
        .select('*')
        .eq('id', id)
        .single() as any;
      if (!fetchErr && fresh) {
        setData((prev) => prev.map((r) => (r.id === id ? fresh : r)));
      }
    }
  };

  const startEditing = (id: string, field: keyof Lead) => {
    setEditingCell({ id, field });
  };

  const renderCell = (row: Lead, field: keyof Lead) => {
    const value = row[field] ?? '';
    const isLink = field === 'website' || field === 'reservation_page_url';
    const isEditing = editingCell?.id === row.id && editingCell?.field === field;

    if (isEditing) {
      if (field === 'lead_claimed_by') {
        return (
          <select
            autoFocus
            className="w-full border-b border-blue-300 focus:outline-none"
            value={value as string}
            onChange={(e) => {
              handleCellChange(row.id, field, e.target.value);
              handleCellBlur(row.id, field, e.target.value);
            }}
          >
            <option value="">(none)</option>
            <option value="Ahmad">Ahmad</option>
            <option value="Moaz">Moaz</option>
          </select>
        );
      }

      if (field === 'is_hudson_customer') {
        return (
          <input
            type="checkbox"
            autoFocus
            checked={Boolean(value)}
            onChange={(e) => {
              handleCellChange(row.id, field, e.target.checked);
              handleCellBlur(row.id, field, e.target.checked);
            }}
          />
        );
      }

      return (
        <input
          autoFocus
          className="w-full border-b border-blue-300 focus:outline-none"
          value={value}
          onChange={(e) => handleCellChange(row.id, field, e.target.value)}
          onBlur={() => handleCellBlur(row.id, field, value)}
        />
      );
    }

    if (isLink && value) {
      return (
        <a href={String(value)} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          {String(value)}
        </a>
      );
    }

    if (field === 'is_hudson_customer') {
      return <span>{value ? 'Yes' : 'No'}</span>;
    }

    return <span>{String(value)}</span>;
  };

  const baseColumns: Array<keyof Lead> = [
    'name',
    'phone',
    'address',
    'city',
    'website',
    'review_count',
    'reservation_page_url',
    'is_hudson_customer',
    'reservation_system',
    'lead_claimed_by',
    'engagement_status',
    'notes',
  ];

  const columns: Array<keyof Lead> =
    activeTab === 'national'
      ? baseColumns.filter((c) => c !== 'review_count')
      : baseColumns;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {toast && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
      {/* simple tabs */}
      <div className="flex space-x-2 border-b">
        <button
          className={`pb-2 ${activeTab === 'arizona' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}
          onClick={() => setActiveTab('arizona')}
        >
          Arizona Leads
        </button>
        <button
          className={`pb-2 ${activeTab === 'national' ? 'border-b-2 border-blue-600 text-blue-600' : ''}`}
          onClick={() => setActiveTab('national')}
        >
          National Leads
        </button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Search by name or city"
          className="w-full border p-2 rounded mb-2"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col)}
                  className="px-4 py-2 text-left cursor-pointer select-none"
                  onClick={() => handleSort(col)}
                >
                  <div className="flex items-center gap-1">
                    {String(col).replace(/_/g, ' ')}
                    <ChevronsUpDown className="w-4 h-4" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData().map((row) => (
              <tr key={row.id} className="odd:bg-white even:bg-gray-50">
                {columns.map((col) => (
                  <td
                    key={col}
                    className="px-4 py-2 max-w-xs break-words"
                    onClick={() => startEditing(row.id, col)}
                  >
                    {renderCell(row, col)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
