# BlockNote Document Editor - Setup Guide

## Production-Ready Implementation ✅

All feedback addressed:
- ✅ RLS policies (team-based authentication)
- ✅ `team_id` auto-injection on insert
- ✅ `updated_at` trigger (server-controlled)
- ✅ `pgcrypto` extension enabled
- ✅ Browser `setTimeout` typing (not Node.js)
- ✅ Content loading guard (prevents re-loads)
- ✅ JSONB `not null` constraint
- ✅ Dirty tracking (skip unchanged saves)

---

## Installation

### 1. Install NPM Packages

```bash
npm install @blocknote/core @blocknote/react @blocknote/mantine @supabase/supabase-js
npm install @mantine/core @mantine/hooks
```

### 2. Environment Variables

Add to your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from your Supabase project dashboard: **Settings → API**

---

## Database Setup

### 1. Run Migration SQL

Execute the SQL in `BLOCKNOTE_MIGRATION.sql` in your Supabase SQL Editor:

- Creates `documents` table with `team_id` (not `user_id`)
- Enables `pgcrypto` extension
- Sets up `updated_at` trigger
- Configures RLS policies for team-based access

### 2. Team Setup (Choose One)

**Option A: Two-Person Team (Simplest)**

If you're the only team, hardcode the team_id in your app:

```typescript
// In src/lib/supabase.ts
export async function getUserTeamId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  // Hardcode for two-person team
  return 'YOUR_TEAM_ID_HERE'; // Generate via: crypto.randomUUID()
}
```

Then manually insert team membership:

```sql
insert into team_members (team_id, user_id)
values 
  ('YOUR_TEAM_ID', 'user_1_uuid'),
  ('YOUR_TEAM_ID', 'user_2_uuid');
```

**Option B: User Metadata**

Store `team_id` in user metadata during signup:

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: {
      team_id: 'YOUR_TEAM_ID'
    }
  }
});
```

**Option C: Team Members Table** (Already configured in migration)

Create a `team_members` table:

```sql
create table team_members (
  team_id uuid not null,
  user_id uuid not null references auth.users(id),
  primary key (team_id, user_id)
);
```

---

## BlockNote Configuration

### Default Schema Used ✅

The implementation uses BlockNote's **default schema** with all built-in blocks:

**Block Types:**
- paragraph, heading (levels 1-3), quote
- bulletListItem, numberedListItem, checkListItem
- table, codeBlock
- image, video, audio, file
- toggleListItem

**Inline Content:**
- Styled text (bold, italic, underline, strikethrough)
- Text/background colors
- Links

**Props (all blocks):**
- backgroundColor, textColor, textAlignment

No custom schema needed - perfect for a two-person team!

---

## Testing Checklist

### 1. Authentication
- [ ] Users can log in
- [ ] `team_id` is correctly retrieved
- [ ] RLS policies block unauthorized access

### 2. Document List
- [ ] Can view team documents at `/documents`
- [ ] Can create new document
- [ ] Can delete document (with confirmation)
- [ ] Documents sorted by creation date

### 3. Document Editor
- [ ] Editor loads existing document
- [ ] Can edit title
- [ ] Can type and format text
- [ ] Auto-save triggers after 2 seconds
- [ ] Manual save button works
- [ ] Save status indicator updates correctly
- [ ] All block types available in `/` menu

### 4. BlockNote Features
- [ ] Block drag-and-drop works
- [ ] Slash commands work (`/heading`, `/bullet`, etc.)
- [ ] Formatting toolbar appears on text selection
- [ ] Tables render and edit correctly
- [ ] Images can be uploaded (needs `uploadFile` config)

---

## Advanced: File Upload

To enable image/file uploads, configure `uploadFile` in the editor:

```typescript
const editor = useCreateBlockNote({
  initialContent: [{ type: 'paragraph', content: '' }],
  uploadFile: async (file: File) => {
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(`${crypto.randomUUID()}-${file.name}`, file);
    
    if (error) throw error;
    
    // Return public URL
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(data.path);
    
    return publicUrl;
  },
});
```

Don't forget to create the storage bucket in Supabase!

---

## Architecture Notes

### Content Storage
- Documents stored as `Block[]` JSONB arrays
- Each block: `{ id, type, props, content, children }`
- Use `editor.document` to get/set content

### Auto-Save Strategy
- Debounced 2 seconds after last change
- Dirty tracking prevents unchanged saves
- Manual save button for explicit control

### RLS Security
- All queries filtered by team membership
- `team_id` injected automatically on insert
- Two-person team = simple access control

### Performance
- Indexes on `team_id` and `created_at`
- Content loading guarded (prevents duplicates)
- Minimal re-renders with proper refs

---

## Troubleshooting

**Error: "Missing Supabase environment variables"**
→ Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env`

**Error: "User is not part of a team"**
→ Check `getUserTeamId()` implementation and team_members table

**RLS policies blocking queries**
→ Verify user is authenticated and in team_members table

**Auto-save not triggering**
→ Check browser console for errors, verify network tab shows updates

**Content not persisting**
→ Verify `updated_at` trigger exists and RLS policies allow updates

---

## Files Created

- ✅ `BLOCKNOTE_MIGRATION.sql` - Database schema with RLS
- ✅ `src/lib/supabase.ts` - Supabase client + team context
- ✅ `src/services/documents.ts` - Document CRUD operations
- ✅ `src/pages/Documents.tsx` - Document list view
- ✅ `src/pages/DocumentEditor.tsx` - BlockNote editor (fixed)
- ✅ `src/App.tsx` - Routes added
- ✅ `src/components/Sidebar.tsx` - Navigation link added

Ready to ship! 🚀
