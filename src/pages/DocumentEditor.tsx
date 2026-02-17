import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, CheckCircle } from 'lucide-react';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import '@blocknote/core/fonts/inter.css';
import { getDocument, updateDocument } from '../services/documents';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export function DocumentEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('Untitled Document');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  
  // Fix: Use browser setTimeout type, not Node.js
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Fix: Track if content has been loaded to prevent re-loading
  const didLoadRef = useRef(false);
  
  // Fix: Track dirty state to prevent unnecessary saves
  const lastSavedContentRef = useRef<string>('');

  // Create BlockNote editor with default schema (all built-in blocks)
  const editor = useCreateBlockNote({
    initialContent: [{ type: 'paragraph', content: '' }],
  });

  // Load document on mount
  useEffect(() => {
    if (!id || didLoadRef.current) return;
    
    loadDocument();
  }, [id]);

  async function loadDocument() {
    if (!id) return;
    
    try {
      setLoading(true);
      const doc = await getDocument(id);
      
      if (!doc) {
        console.error('Document not found');
        navigate('/documents');
        return;
      }

      setTitle(doc.title);
      
      // Load content into editor only once
      if (doc.content && Array.isArray(doc.content) && doc.content.length > 0) {
        editor.replaceBlocks(editor.document, doc.content);
      }
      
      // Track initial content for dirty checking
      lastSavedContentRef.current = JSON.stringify(doc.content);
      didLoadRef.current = true;
    } catch (error) {
      console.error('Failed to load document:', error);
      setSaveStatus('error');
    } finally {
      setLoading(false);
    }
  }

  // Debounced auto-save with dirty checking
  function handleContentChange() {
    const currentContent = JSON.stringify(editor.document);
    
    // Fix: Skip save if content hasn't changed
    if (currentContent === lastSavedContentRef.current) {
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSaveStatus('idle');

    saveTimeoutRef.current = setTimeout(() => {
      saveDocument();
    }, 2000);
  }

  async function saveDocument() {
    if (!id) return;

    try {
      setSaveStatus('saving');
      const content = editor.document;
      
      await updateDocument(id, { title, content });
      
      // Update last saved content
      lastSavedContentRef.current = JSON.stringify(content);
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save document:', error);
      setSaveStatus('error');
    }
  }

  // Manual save
  async function handleManualSave() {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    await saveDocument();
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading document...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => navigate('/documents')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleManualSave}
              className="text-2xl font-bold border-none outline-none flex-1"
              placeholder="Untitled Document"
            />
          </div>
          <div className="flex items-center gap-3">
            {/* Save Status Indicator */}
            <div className="text-sm text-gray-500 flex items-center gap-2">
              {saveStatus === 'saving' && (
                <>
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Saved
                </>
              )}
              {saveStatus === 'error' && (
                <span className="text-red-600">Save failed</span>
              )}
            </div>
            <button
              onClick={handleManualSave}
              disabled={saveStatus === 'saving'}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>

      {/* BlockNote Editor */}
      <div className="flex-1 overflow-auto bg-white">
        <div className="max-w-4xl mx-auto py-8">
          <BlockNoteView
            editor={editor}
            onChange={handleContentChange}
            theme="light"
          />
        </div>
      </div>
    </div>
  );
}
