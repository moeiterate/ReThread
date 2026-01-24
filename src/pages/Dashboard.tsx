import { useState, useEffect } from 'react';
import { Edit2, Save, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { readDashboardFromGitHub, writeDashboardToGitHub } from '../services/github';

interface DashboardData {
  documentTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  tenets: Array<{
    number: string;
    title: string;
    description: string;
  }>;
  sprintCycle: Array<{
    label: string;
    title: string;
    description: string;
  }>;
  version: string;
  updatedDate: string;
}

const defaultData: DashboardData = {
  documentTitle: "Draft Internal Strategy, Planning & Operations Document",
  heroTitle: "Weaving Strategy",
  heroSubtitle: "Into Software.",
  heroDescription: "We identify fragmented workflows in mid-market and enterprise organizations and re-thread them into seamless, data-driven systems. We replace legacy debt with custom, owned solutions—but only after rigorous validation.",
  tenets: [
    {
      number: "01",
      title: "Consulting Before Coding",
      description: "We are strategic partners to $1M+ revenue organizations. Code is a tool, not the product. We value impact over hours."
    },
    {
      number: "02",
      title: "Validate, Then Build",
      description: "We never build \"speculative\" products. Mockups sell the vision; engineering starts only after the contract is signed."
    },
    {
      number: "03",
      title: "Data Over Intuition",
      description: "We quantify the pain (e.g., \"$10k/mo lost\") before pitching. Research is our spearhead for acquisition."
    }
  ],
  sprintCycle: [
    {
      label: "Phase 1",
      title: "Intake & Research",
      description: "Anytime an idea strikes, it goes to the Backlog. Before a Sprint starts, we conduct market research to assess viability."
    },
    {
      label: "Week 1",
      title: "Build & Prep",
      description: "Monday Sprint Start: Select top backlog item. Create \"Demo First\" assets. Rebuild prospect's site/app as a high-fidelity mockup."
    },
    {
      label: "Week 2",
      title: "Outreach & Execution",
      description: "\"I built this for you.\" Cold outreach with assets. Goal: Book demo meetings to validate interest."
    },
    {
      label: "Review",
      title: "Retro & Pivot",
      description: "Friday Wk 2: Analyze response data. If valid → Contract. If invalid → Kill. Decide topic for Sprint 2."
    }
  ],
  version: "Internal OS v1.0",
  updatedDate: "Updated Jan 2026"
};

export const Dashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<DashboardData>(defaultData);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  // Load data from GitHub on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const saved = await readDashboardFromGitHub();
        if (saved) {
          // Merge saved data with defaults to ensure all fields exist
          setData({ ...defaultData, ...saved });
        } else {
          // No saved data, use defaults
          setData(defaultData);
        }
      } catch (err: any) {
        console.error('Failed to load from GitHub:', err);
        // Fallback to localStorage if GitHub fails
        const localSaved = localStorage.getItem('dashboard-data');
        if (localSaved) {
          try {
            const parsed = JSON.parse(localSaved);
            // Merge with defaults to ensure all fields exist
            setData({ ...defaultData, ...parsed });
          } catch (e) {
            setData(defaultData);
          }
        } else {
          setData(defaultData);
        }
        setError(err.message || 'Failed to load from GitHub. Using local data.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveStatus('idle');
      setError(null);

      // Update the date
      const now = new Date();
      const updatedData = {
        ...data,
        updatedDate: `Updated ${now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
      };

      // Save to GitHub
      await writeDashboardToGitHub(updatedData, undefined, `Update dashboard - ${new Date().toISOString()}`);
      
      // Also save to localStorage as backup
      localStorage.setItem('dashboard-data', JSON.stringify(updatedData));
      
      setData(updatedData);
      setHasChanges(false);
      setIsEditing(false);
      setSaveStatus('success');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      console.error('Failed to save:', err);
      setError(err.message || 'Failed to save to GitHub');
      setSaveStatus('error');
      
      // Fallback: save to localStorage
      try {
        localStorage.setItem('dashboard-data', JSON.stringify(data));
        setError('Saved locally (GitHub save failed)');
      } catch (e) {
        setError('Failed to save');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    try {
      // Reload from GitHub
      const saved = await readDashboardFromGitHub();
      if (saved) {
        setData(saved);
      } else {
        setData(defaultData);
      }
    } catch (err) {
      // Fallback to localStorage
      const localSaved = localStorage.getItem('dashboard-data');
      if (localSaved) {
        try {
          setData(JSON.parse(localSaved));
        } catch (e) {
          setData(defaultData);
        }
      } else {
        setData(defaultData);
      }
    }
    setHasChanges(false);
    setIsEditing(false);
    setError(null);
  };

  const updateField = (path: string[], value: string) => {
    setData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      setHasChanges(true);
      return newData;
    });
  };

  const updateTenet = (index: number, field: 'title' | 'description', value: string) => {
    setData(prev => {
      const newTenets = [...prev.tenets];
      newTenets[index] = { ...newTenets[index], [field]: value };
      setHasChanges(true);
      return { ...prev, tenets: newTenets };
    });
  };

  const updateSprintCycle = (index: number, field: 'title' | 'description', value: string) => {
    setData(prev => {
      const newCycle = [...prev.sprintCycle];
      newCycle[index] = { ...newCycle[index], [field]: value };
      setHasChanges(true);
      return { ...prev, sprintCycle: newCycle };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-[var(--text-muted)]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-24 animate-in fade-in duration-500 relative">
      
      {/* Edit Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="bg-[var(--secondary)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </>
        )}
      </div>

      {/* Status Messages */}
      {saveStatus === 'success' && (
        <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Saved to GitHub successfully!
        </div>
      )}

      {error && (
        <div className="fixed top-20 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-md">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Brand Header */}
      <div className="flex justify-between items-end pb-6 mb-8">
        <div className="flex items-center gap-2 text-[var(--text-main)]">
          <svg viewBox="0 0 260 50" fill="none" stroke="currentColor" strokeWidth="0" className="h-10 w-auto text-[var(--text-main)]">
            <text x="0" y="35" fontFamily="'Playfair Display', serif" fontWeight="800" fontSize="38" fill="var(--text-main)">Re</text>
            <path d="M 50 26 C 55 26, 55 28, 62 25" stroke="var(--secondary)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <g stroke="var(--primary)" strokeWidth="2" fill="none">
              <path d="M 62 25 L 72 22 A 3 3 0 0 1 74 28 L 64 31 A 3 3 0 0 1 62 25 Z" />
              <path d="M 69 23 L 79 20 A 3 3 0 0 1 81 26 L 71 29 A 3 3 0 0 1 69 23 Z" />
              <path d="M 76 21 L 86 18 A 3 3 0 0 1 88 24 L 78 27 A 3 3 0 0 1 76 21 Z" />
            </g>
            <path d="M 86 21 C 92 20, 92 18, 98 18" stroke="var(--secondary)" strokeWidth="2" fill="none" strokeLinecap="round" />
            <text x="100" y="35" fontFamily="'Playfair Display', serif" fontWeight="800" fontSize="38" fill="var(--text-main)">Thread</text>
          </svg>
        </div>
        <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest text-right">
          {isEditing ? (
            <input
              type="text"
              value={data.version}
              onChange={(e) => updateField(['version'], e.target.value)}
              className="bg-transparent border-b border-dashed border-[var(--text-muted)] text-right focus:outline-none focus:border-[var(--primary)]"
            />
          ) : (
            <>{data.version}<br />{data.updatedDate}</>
          )}
        </div>
      </div>

      {/* Document Header */}
      <header className="pb-8 border-b-2 border-[var(--text-main)] mb-20">
        {isEditing ? (
          <input
            type="text"
            value={data.documentTitle}
            onChange={(e) => updateField(['documentTitle'], e.target.value)}
            className="font-serif text-2xl italic text-[var(--text-main)] pl-4 border-l-2 border-[var(--line-color)] leading-snug w-full bg-transparent border-b border-dashed border-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
          />
        ) : (
          <h2 className="font-serif text-2xl italic text-[var(--text-main)] pl-4 border-l-2 border-[var(--line-color)] leading-snug">
            {data.documentTitle}
          </h2>
        )}
      </header>

      {/* Hero Section */}
      <section>
        {isEditing ? (
          <>
            <div className="mb-4">
              <input
                type="text"
                value={data.heroTitle}
                onChange={(e) => updateField(['heroTitle'], e.target.value)}
                className="text-7xl font-serif font-medium leading-none tracking-tight w-full bg-transparent border-b border-dashed border-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] mb-2"
              />
              <input
                type="text"
                value={data.heroSubtitle}
                onChange={(e) => updateField(['heroSubtitle'], e.target.value)}
                className="text-7xl font-serif italic text-[var(--secondary)] leading-none tracking-tight w-full bg-transparent border-b border-dashed border-[var(--secondary)] focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <textarea
              value={data.heroDescription}
              onChange={(e) => updateField(['heroDescription'], e.target.value)}
              className="text-2xl text-[var(--text-muted)] max-w-3xl leading-relaxed font-light w-full bg-transparent border border-dashed border-[var(--text-muted)] rounded p-2 focus:outline-none focus:border-[var(--primary)]"
              rows={3}
            />
          </>
        ) : (
          <>
            <h1 className="text-7xl font-serif font-medium leading-none mb-8 tracking-tight">
              {data.heroTitle} <br /><span className="text-[var(--secondary)] italic">{data.heroSubtitle}</span>
            </h1>
            <p className="text-2xl text-[var(--text-muted)] max-w-3xl leading-relaxed font-light">
              {data.heroDescription && data.heroDescription.includes('re-thread') ? (
                <>
                  {data.heroDescription.split('re-thread')[0]}
                  <strong>re-thread</strong>
                  {data.heroDescription.split('re-thread')[1]}
                </>
              ) : (
                data.heroDescription || ''
              )}
            </p>
          </>
        )}
      </section>

      {/* Core Tenets */}
      <section>
        <h2 className="font-serif text-3xl mb-8 font-medium border-t border-[var(--line-color)] pt-12 mt-24">
          Organizational Tenets (DRAFT)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {data.tenets.map((tenet, index) => (
            <div key={index} className="relative pt-6">
              <div className="absolute top-0 left-0 w-10 h-0.5 bg-[var(--secondary)]"></div>
              <span className="block font-bold text-xs text-[var(--text-muted)] mb-4 tracking-widest uppercase">{tenet.number}</span>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={tenet.title}
                    onChange={(e) => updateTenet(index, 'title', e.target.value)}
                    className="font-serif text-2xl font-semibold mb-2 w-full bg-transparent border-b border-dashed border-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
                  />
                  <textarea
                    value={tenet.description}
                    onChange={(e) => updateTenet(index, 'description', e.target.value)}
                    className="text-[var(--text-muted)] w-full bg-transparent border border-dashed border-[var(--text-muted)] rounded p-2 focus:outline-none focus:border-[var(--primary)]"
                    rows={3}
                  />
                </>
              ) : (
                <>
                  <h3 className="font-serif text-2xl font-semibold mb-2">{tenet.title}</h3>
                  <p className="text-[var(--text-muted)]">{tenet.description}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Process Cycle */}
      <section>
        <h2 className="font-serif text-3xl mb-8 font-medium border-t border-[var(--line-color)] pt-12 mt-24">
          The 2-Week Sprint Cycle
        </h2>
        <div className="ml-4 border-l border-[var(--line-color)] space-y-0">
          {data.sprintCycle.map((item, index) => (
            <div key={index} className="grid grid-cols-[120px_1fr] pl-8 py-8 relative">
              <div className="absolute left-[-5px] top-10 w-2.5 h-2.5 bg-[var(--bg-color)] border-2 border-[var(--secondary)] rounded-full"></div>
              <div className="font-bold text-sm text-[var(--text-muted)] uppercase tracking-widest mt-1">{item.label}</div>
              <div>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateSprintCycle(index, 'title', e.target.value)}
                      className="font-serif text-2xl font-semibold mb-2 w-full bg-transparent border-b border-dashed border-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
                    />
                    <textarea
                      value={item.description}
                      onChange={(e) => updateSprintCycle(index, 'description', e.target.value)}
                      className="text-[var(--text-muted)] w-full bg-transparent border border-dashed border-[var(--text-muted)] rounded p-2 focus:outline-none focus:border-[var(--primary)]"
                      rows={2}
                    />
                  </>
                ) : (
                  <>
                    <h3 className="font-serif text-2xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-[var(--text-muted)]">{item.description}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center text-xs text-[var(--text-muted)] uppercase tracking-widest pt-24 pb-12">
        ReThread © 2026 Strategy Document
      </footer>
    </div>
  );
};
