import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, Trash2 } from 'lucide-react';
import type { Document } from '../lib/supabase';
import { getDocuments, createDocument, deleteDocument } from '../services/documents';

export function Documents() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  async function loadDocuments() {
    try {
      setLoading(true);
      const docs = await getDocuments();
      setDocuments(docs);
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    try {
      setCreating(true);
      const doc = await createDocument();
      if (doc) {
        setDocuments([doc, ...documents]);
      }
    } catch (error) {
      console.error('Failed to create document:', error);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await deleteDocument(id);
      setDocuments(documents.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading documents...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Documents</h1>
        <button
          onClick={handleCreate}
          disabled={creating}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          {creating ? 'Creating...' : 'New Document'}
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">No documents yet</p>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create your first document
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <Link
                  to={`/documents/${doc.id}`}
                  className="flex-1"
                >
                  <h2 className="text-xl font-semibold hover:text-blue-600 transition-colors">
                    {doc.title}
                  </h2>
                </Link>
                <button
                  onClick={() => handleDelete(doc.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Delete document"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="text-sm text-gray-500">
                <div>Created: {new Date(doc.created_at).toLocaleDateString()}</div>
                <div>Updated: {new Date(doc.updated_at).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
