import type { Block } from '@blocknote/core';
import { supabase, getUserTeamId } from '../lib/supabase';
import type { Document } from '../lib/supabase';

// Get all documents for user's team
export async function getDocuments(): Promise<Document[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }

  return data || [];
}

// Get a single document by ID
export async function getDocument(id: string): Promise<Document | null> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching document:', error);
    return null;
  }

  return data;
}

// Create a new document (auto-inject team_id)
export async function createDocument(title: string = 'Untitled Document'): Promise<Document | null> {
  const teamId = await getUserTeamId();
  
  if (!teamId) {
    console.error('Cannot create document: No team_id found for user');
    throw new Error('User is not part of a team');
  }

  const { data, error } = await supabase
    .from('documents')
    .insert({
      team_id: teamId,
      title,
      content: [], // Empty BlockNote document
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating document:', error);
    throw error;
  }

  return data;
}

// Update document (title and/or content)
// Note: updated_at is handled by database trigger
export async function updateDocument(
  id: string,
  updates: { title?: string; content?: Block[] }
): Promise<void> {
  const { error } = await supabase
    .from('documents')
    .update(updates)
    .eq('id', id);

  if (error) {
    console.error('Error updating document:', error);
    throw error;
  }
}

// Delete a document
export async function deleteDocument(id: string): Promise<void> {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}
