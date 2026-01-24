import { useState, useEffect } from 'react';
import { Edit2, Save, X, AlertCircle, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { readDashboardFromGitHub, writeDashboardToGitHub, getGitHubToken } from '../services/github';

type SectionType = 'hero' | 'text' | 'tenets' | 'sprint-cycle' | 'custom';

interface Section {
  id: string;
  type: SectionType;
  title?: string;
  content: string;
  subtitle?: string;
  items?: Array<{
    id: string;
    label?: string;
    title: string;
    description: string;
  }>;
}

interface DashboardData {
  documentTitle: string;
  version: string;
  updatedDate: string;
  sections: Section[];
}

const createDefaultSections = (): Section[] => [
  {
    id: 'hero-1',
    type: 'hero',
    title: 'Weaving Strategy',
    subtitle: 'Into Software.',
    content: 'We identify fragmented workflows in mid-market and enterprise organizations and re-thread them into seamless, data-driven systems. We replace legacy debt with custom, owned solutions—but only after rigorous validation.',
  },
  {
    id: 'tenets-1',
    type: 'tenets',
    title: 'Organizational Tenets (DRAFT)',
    content: '',
    items: [
      {
        id: 'tenet-1',
        title: 'Consulting Before Coding',
        description: 'We are strategic partners to $1M+ revenue organizations. Code is a tool, not the product. We value impact over hours.',
      },
      {
        id: 'tenet-2',
        title: 'Validate, Then Build',
        description: 'We never build "speculative" products. Mockups sell the vision; engineering starts only after the contract is signed.',
      },
      {
        id: 'tenet-3',
        title: 'Data Over Intuition',
        description: 'We quantify the pain (e.g., "$10k/mo lost") before pitching. Research is our spearhead for acquisition.',
      },
    ],
  },
  {
    id: 'sprint-1',
    type: 'sprint-cycle',
    title: 'The 2-Week Sprint Cycle',
    content: '',
    items: [
      {
        id: 'sprint-1',
        label: 'Phase 1',
        title: 'Intake & Research',
        description: 'Anytime an idea strikes, it goes to the Backlog. Before a Sprint starts, we conduct market research to assess viability.',
      },
      {
        id: 'sprint-2',
        label: 'Week 1',
        title: 'Build & Prep',
        description: 'Monday Sprint Start: Select top backlog item. Create "Demo First" assets. Rebuild prospect\'s site/app as a high-fidelity mockup.',
      },
      {
        id: 'sprint-3',
        label: 'Week 2',
        title: 'Outreach & Execution',
        description: '"I built this for you." Cold outreach with assets. Goal: Book demo meetings to validate interest.',
      },
      {
        id: 'sprint-4',
        label: 'Review',
        title: 'Retro & Pivot',
        description: 'Friday Wk 2: Analyze response data. If valid → Contract. If invalid → Kill. Decide topic for Sprint 2.',
      },
    ],
  },
];

const defaultData: DashboardData = {
  documentTitle: 'Draft Internal Strategy, Planning & Operations Document',
  version: 'Internal OS v1.0',
  updatedDate: 'Updated Jan 2026',
  sections: createDefaultSections(),
};

export const Dashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [data, setData] = useState<DashboardData>(defaultData);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [githubTokenStatus, setGithubTokenStatus] = useState<'checking' | 'ok' | 'missing'>('checking');

  // Check GitHub token on mount
  useEffect(() => {
    const token = getGitHubToken();
    setGithubTokenStatus(token ? 'ok' : 'missing');
  }, []);

  // Load data from GitHub on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const saved = await readDashboardFromGitHub();
        if (saved) {
          // Merge saved data with defaults to ensure all fields exist
          const merged: DashboardData = {
            ...defaultData,
            ...saved,
            sections: saved.sections || defaultData.sections,
          };
          setData(merged);
        } else {
          setData(defaultData);
        }
      } catch (err: any) {
        console.error('Failed to load from GitHub:', err);
        // Fallback to localStorage if GitHub fails
        const localSaved = localStorage.getItem('dashboard-data');
        if (localSaved) {
          try {
            const parsed = JSON.parse(localSaved);
            const merged: DashboardData = {
              ...defaultData,
              ...parsed,
              sections: parsed.sections || defaultData.sections,
            };
            setData(merged);
          } catch (e) {
            setData(defaultData);
          }
        } else {
          setData(defaultData);
        }
        if (err.message?.includes('token')) {
          setGithubTokenStatus('missing');
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
      const updatedData: DashboardData = {
        ...data,
        updatedDate: `Updated ${now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`,
      };

      // Save to GitHub
      try {
        await writeDashboardToGitHub(updatedData, undefined, `Update dashboard - ${new Date().toISOString()}`);
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } catch (githubErr: any) {
        console.error('GitHub save failed:', githubErr);
        // Still save locally
        localStorage.setItem('dashboard-data', JSON.stringify(updatedData));
        
        if (githubErr.message?.includes('token')) {
          setGithubTokenStatus('missing');
          setError('GitHub token not configured. Changes saved locally. Add VITE_GITHUB_TOKEN to Netlify environment variables.');
        } else {
          setError(`GitHub save failed: ${githubErr.message}. Changes saved locally.`);
        }
        setSaveStatus('error');
        return; // Don't clear editing mode if GitHub save failed
      }

      // Also save to localStorage as backup
      localStorage.setItem('dashboard-data', JSON.stringify(updatedData));

      setData(updatedData);
      setHasChanges(false);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Failed to save:', err);
      setError(err.message || 'Failed to save');
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    try {
      // Reload from GitHub
      const saved = await readDashboardFromGitHub();
      if (saved) {
        const merged: DashboardData = {
          ...defaultData,
          ...saved,
          sections: saved.sections || defaultData.sections,
        };
        setData(merged);
      } else {
        setData(defaultData);
      }
    } catch (err) {
      // Fallback to localStorage
      const localSaved = localStorage.getItem('dashboard-data');
      if (localSaved) {
        try {
          const parsed = JSON.parse(localSaved);
          const merged: DashboardData = {
            ...defaultData,
            ...parsed,
            sections: parsed.sections || defaultData.sections,
          };
          setData(merged);
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

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setData((prev) => {
      const newSections = prev.sections.map((s) =>
        s.id === sectionId ? { ...s, ...updates } : s
      );
      setHasChanges(true);
      return { ...prev, sections: newSections };
    });
  };

  const updateSectionItem = (sectionId: string, itemId: string, updates: Partial<NonNullable<Section['items']>[0]>) => {
    setData((prev) => {
      const newSections = prev.sections.map((s) => {
        if (s.id === sectionId && s.items) {
          const newItems = s.items.map((item) =>
            item.id === itemId ? { ...item, ...updates } : item
          );
          return { ...s, items: newItems };
        }
        return s;
      });
      setHasChanges(true);
      return { ...prev, sections: newSections };
    });
  };

  const addSection = (type: SectionType = 'text') => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      type,
      title: 'New Section',
      content: '',
    };
    setData((prev) => {
      setHasChanges(true);
      return { ...prev, sections: [...prev.sections, newSection] };
    });
  };

  const removeSection = (sectionId: string) => {
    setData((prev) => {
      setHasChanges(true);
      return { ...prev, sections: prev.sections.filter((s) => s.id !== sectionId) };
    });
  };

  const addSectionItem = (sectionId: string) => {
    setData((prev) => {
      const newSections = prev.sections.map((s) => {
        if (s.id === sectionId) {
          const newItem = {
            id: `item-${Date.now()}`,
            title: 'New Item',
            description: '',
          };
          return { ...s, items: [...(s.items || []), newItem] };
        }
        return s;
      });
      setHasChanges(true);
      return { ...prev, sections: newSections };
    });
  };

  const removeSectionItem = (sectionId: string, itemId: string) => {
    setData((prev) => {
      const newSections = prev.sections.map((s) => {
        if (s.id === sectionId && s.items) {
          return { ...s, items: s.items.filter((item) => item.id !== itemId) };
        }
        return s;
      });
      setHasChanges(true);
      return { ...prev, sections: newSections };
    });
  };

  const updateField = (field: keyof DashboardData, value: string) => {
    setData((prev) => {
      setHasChanges(true);
      return { ...prev, [field]: value };
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
    <div className="space-y-14 md:space-y-24 animate-in fade-in duration-500 relative">
      {/* Edit Controls */}
      <div className="fixed top-16 md:top-4 right-4 z-50 flex flex-row md:flex-col gap-2">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[var(--primary)] text-white px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg text-sm md:text-base"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={!hasChanges || saving}
              className="bg-[var(--secondary)] text-white px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="bg-gray-500 text-white px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 text-sm md:text-base"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={() => addSection('text')}
              className="bg-green-600 text-white px-3 md:px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg text-sm md:text-base"
            >
              <Plus className="w-4 h-4" />
              Add Section
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

      {githubTokenStatus === 'missing' && (
        <div className="fixed top-20 left-4 z-50 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg max-w-md">
          <AlertCircle className="w-5 h-5 inline mr-2" />
          <span className="text-sm">
            GitHub token not configured. Add VITE_GITHUB_TOKEN to Netlify environment variables for cloud saves.
          </span>
        </div>
      )}

      {/* Meta (keep version/date; logo lives in sidebar / mobile top bar) */}
      <div className="flex justify-end pb-4 mb-4">
        <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest text-right">
          {isEditing ? (
            <input
              type="text"
              value={data.version}
              onChange={(e) => updateField('version', e.target.value)}
              className="bg-transparent border-b border-dashed border-[var(--text-muted)] text-right focus:outline-none focus:border-[var(--primary)]"
            />
          ) : (
            <>
              {data.version}
              <br />
              {data.updatedDate}
            </>
          )}
        </div>
      </div>

      {/* Document Header */}
      <header className="pb-8 border-b-2 border-[var(--text-main)] mb-12 md:mb-20">
        {isEditing ? (
          <input
            type="text"
            value={data.documentTitle}
            onChange={(e) => updateField('documentTitle', e.target.value)}
            className="font-serif text-xl md:text-2xl italic text-[var(--text-main)] pl-4 border-l-2 border-[var(--line-color)] leading-snug w-full bg-transparent border-b border-dashed border-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
          />
        ) : (
          <h2 className="font-serif text-xl md:text-2xl italic text-[var(--text-main)] pl-4 border-l-2 border-[var(--line-color)] leading-snug">
            {data.documentTitle}
          </h2>
        )}
      </header>

      {/* Dynamic Sections */}
      {data.sections.map((section) => (
        <section key={section.id} className="relative">
          {isEditing && (
            <button
              onClick={() => removeSection(section.id)}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors z-10"
              title="Remove section"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}

          {/* Hero Section */}
          {section.type === 'hero' && (
            <>
              {isEditing ? (
                <>
                  <div className="mb-4">
                    <input
                      type="text"
                      value={section.title || ''}
                      onChange={(e) => updateSection(section.id, { title: e.target.value })}
                      placeholder="Title"
                      className="text-4xl sm:text-5xl lg:text-7xl font-serif font-medium leading-none tracking-tight w-full bg-transparent border-b border-dashed border-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] mb-2"
                    />
                    <input
                      type="text"
                      value={section.subtitle || ''}
                      onChange={(e) => updateSection(section.id, { subtitle: e.target.value })}
                      placeholder="Subtitle"
                      className="text-4xl sm:text-5xl lg:text-7xl font-serif italic text-[var(--secondary)] leading-none tracking-tight w-full bg-transparent border-b border-dashed border-[var(--secondary)] focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                  <textarea
                    value={section.content}
                    onChange={(e) => updateSection(section.id, { content: e.target.value })}
                    placeholder="Description"
                    className="text-base sm:text-lg lg:text-2xl text-[var(--text-muted)] max-w-3xl leading-relaxed font-light w-full bg-transparent border border-dashed border-[var(--text-muted)] rounded p-2 focus:outline-none focus:border-[var(--primary)]"
                    rows={3}
                  />
                </>
              ) : (
                <>
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-medium leading-none mb-6 md:mb-8 tracking-tight">
                    {section.title} <br />
                    <span className="text-[var(--secondary)] italic">{section.subtitle}</span>
                  </h1>
                  <p className="text-base sm:text-lg lg:text-2xl text-[var(--text-muted)] max-w-3xl leading-relaxed font-light">
                    {section.content}
                  </p>
                </>
              )}
            </>
          )}

          {/* Text Section */}
          {section.type === 'text' && (
            <>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={section.title || ''}
                    onChange={(e) => updateSection(section.id, { title: e.target.value })}
                    placeholder="Section Title"
                    className="font-serif text-2xl md:text-3xl mb-4 font-medium border-t border-[var(--line-color)] pt-8 md:pt-12 mt-16 md:mt-24 w-full bg-transparent border-b border-dashed border-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
                  />
                  <textarea
                    value={section.content}
                    onChange={(e) => updateSection(section.id, { content: e.target.value })}
                    placeholder="Section content..."
                    className="text-[var(--text-muted)] w-full bg-transparent border border-dashed border-[var(--text-muted)] rounded p-4 focus:outline-none focus:border-[var(--primary)] min-h-[200px]"
                  />
                </>
              ) : (
                <>
                  {section.title && (
                    <h2 className="font-serif text-2xl md:text-3xl mb-6 md:mb-8 font-medium border-t border-[var(--line-color)] pt-8 md:pt-12 mt-16 md:mt-24">
                      {section.title}
                    </h2>
                  )}
                  {section.content && (
                    <div className="text-[var(--text-muted)] whitespace-pre-wrap">{section.content}</div>
                  )}
                </>
              )}
            </>
          )}

          {/* Tenets Section */}
          {section.type === 'tenets' && (
            <>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={section.title || ''}
                    onChange={(e) => updateSection(section.id, { title: e.target.value })}
                    placeholder="Section Title"
                    className="font-serif text-2xl md:text-3xl mb-6 md:mb-8 font-medium border-t border-[var(--line-color)] pt-8 md:pt-12 mt-16 md:mt-24 w-full bg-transparent border-b border-dashed border-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    {section.items?.map((item, itemIndex) => (
                      <div key={item.id} className="relative pt-6">
                        {isEditing && (
                          <button
                            onClick={() => removeSectionItem(section.id, item.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors z-10"
                            title="Remove item"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                        <div className="absolute top-0 left-0 w-10 h-0.5 bg-[var(--secondary)]"></div>
                        <span className="block font-bold text-xs text-[var(--text-muted)] mb-4 tracking-widest uppercase">
                          {String(itemIndex + 1).padStart(2, '0')}
                        </span>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateSectionItem(section.id, item.id, { title: e.target.value })}
                          className="font-serif text-2xl font-semibold mb-2 w-full bg-transparent border-b border-dashed border-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
                        />
                        <textarea
                          value={item.description}
                          onChange={(e) => updateSectionItem(section.id, item.id, { description: e.target.value })}
                          className="text-[var(--text-muted)] w-full bg-transparent border border-dashed border-[var(--text-muted)] rounded p-2 focus:outline-none focus:border-[var(--primary)]"
                          rows={3}
                        />
                      </div>
                    ))}
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => addSectionItem(section.id)}
                      className="mt-4 text-[var(--secondary)] hover:text-[var(--primary)] flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Tenet
                    </button>
                  )}
                </>
              ) : (
                <>
                  {section.title && (
                    <h2 className="font-serif text-2xl md:text-3xl mb-6 md:mb-8 font-medium border-t border-[var(--line-color)] pt-8 md:pt-12 mt-16 md:mt-24">
                      {section.title}
                    </h2>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    {section.items?.map((item, itemIndex) => (
                      <div key={item.id} className="relative pt-6">
                        <div className="absolute top-0 left-0 w-10 h-0.5 bg-[var(--secondary)]"></div>
                        <span className="block font-bold text-xs text-[var(--text-muted)] mb-4 tracking-widest uppercase">
                          {String(itemIndex + 1).padStart(2, '0')}
                        </span>
                        <h3 className="font-serif text-2xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-[var(--text-muted)]">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {/* Sprint Cycle Section */}
          {section.type === 'sprint-cycle' && (
            <>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={section.title || ''}
                    onChange={(e) => updateSection(section.id, { title: e.target.value })}
                    placeholder="Section Title"
                    className="font-serif text-2xl md:text-3xl mb-6 md:mb-8 font-medium border-t border-[var(--line-color)] pt-8 md:pt-12 mt-16 md:mt-24 w-full bg-transparent border-b border-dashed border-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
                  />
                  <div className="ml-0 sm:ml-4 border-l-0 sm:border-l border-[var(--line-color)] space-y-0">
                    {section.items?.map((item) => (
                      <div key={item.id} className="grid grid-cols-1 sm:grid-cols-[120px_1fr] pl-0 sm:pl-8 py-6 sm:py-8 relative gap-3 sm:gap-0">
                        {isEditing && (
                          <button
                            onClick={() => removeSectionItem(section.id, item.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors z-10"
                            title="Remove item"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                        <div className="hidden sm:block absolute left-[-5px] top-10 w-2.5 h-2.5 bg-[var(--bg-color)] border-2 border-[var(--secondary)] rounded-full"></div>
                        <input
                          type="text"
                          value={item.label || ''}
                          onChange={(e) => updateSectionItem(section.id, item.id, { label: e.target.value })}
                          placeholder="Label"
                          className="font-bold text-sm text-[var(--text-muted)] uppercase tracking-widest mt-0 sm:mt-1 bg-transparent border-b border-dashed border-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
                        />
                        <div>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateSectionItem(section.id, item.id, { title: e.target.value })}
                            placeholder="Title"
                            className="font-serif text-2xl font-semibold mb-2 w-full bg-transparent border-b border-dashed border-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
                          />
                          <textarea
                            value={item.description}
                            onChange={(e) => updateSectionItem(section.id, item.id, { description: e.target.value })}
                            placeholder="Description"
                            className="text-[var(--text-muted)] w-full bg-transparent border border-dashed border-[var(--text-muted)] rounded p-2 focus:outline-none focus:border-[var(--primary)]"
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => addSectionItem(section.id)}
                      className="mt-4 text-[var(--secondary)] hover:text-[var(--primary)] flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Sprint Phase
                    </button>
                  )}
                </>
              ) : (
                <>
                  {section.title && (
                    <h2 className="font-serif text-2xl md:text-3xl mb-6 md:mb-8 font-medium border-t border-[var(--line-color)] pt-8 md:pt-12 mt-16 md:mt-24">
                      {section.title}
                    </h2>
                  )}
                  <div className="ml-0 sm:ml-4 border-l-0 sm:border-l border-[var(--line-color)] space-y-0">
                    {section.items?.map((item) => (
                      <div key={item.id} className="grid grid-cols-1 sm:grid-cols-[120px_1fr] pl-0 sm:pl-8 py-6 sm:py-8 relative gap-3 sm:gap-0">
                        <div className="hidden sm:block absolute left-[-5px] top-10 w-2.5 h-2.5 bg-[var(--bg-color)] border-2 border-[var(--secondary)] rounded-full"></div>
                        <div className="font-bold text-sm text-[var(--text-muted)] uppercase tracking-widest mt-1">
                          {item.label}
                        </div>
                        <div>
                          <h3 className="font-serif text-2xl font-semibold mb-2">{item.title}</h3>
                          <p className="text-[var(--text-muted)]">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </section>
      ))}

      <footer className="text-center text-xs text-[var(--text-muted)] uppercase tracking-widest pt-24 pb-12">
        ReThread © 2026 Strategy Document
      </footer>
    </div>
  );
};
