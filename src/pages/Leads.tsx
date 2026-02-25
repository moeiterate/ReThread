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
  review_count: number;
  reservation_page_url: string;
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
      showToast(`Failed to update ${field}`);
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

    return <span>{String(value)}</span>;
  };

  const columns: Array<keyof Lead> = [
    'name',
    'phone',
    'address',
    'city',
    'website',
    'review_count',
    'reservation_page_url',
    'lead_claimed_by',
    'engagement_status',
    'notes',
  ];

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

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm">
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
