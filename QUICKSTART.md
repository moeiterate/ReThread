# BlockNote Documents - Quick Start Guide

## 🎯 What Was Built

A production-ready **BlockNote document editor** integrated with Supabase:
- Team-based document management
- Rich text editing with all BlockNote features
- Auto-save with dirty tracking
- Secure RLS policies
- Server-controlled timestamps

**All feedback addressed** ✅

---

## 📦 Installation (5 minutes)

### 1. Install Packages
```bash
npm install @blocknote/core @blocknote/react @blocknote/mantine @supabase/supabase-js @mantine/core @mantine/hooks
```

### 2. Environment Setup
Create/update `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Get these from: Supabase Dashboard → Settings → API

---

## 🗄️ Database Setup (Already Complete!)

✅ Tables created via Supabase MCP:
- `documents` (with RLS)
- `team_members` (with RLS)

✅ Triggers, indexes, and policies configured

---

## 👥 Team Configuration (2 minutes)

### Choose Your Approach:

#### Option A: Simple Hardcode (Recommended for 2-person team)

1. Generate a team ID:
```bash
node -e "console.log(require('crypto').randomUUID())"
# Example: 550e8400-e29b-41d4-a716-446655440000
```

2. Update [src/lib/supabase.ts](src/lib/supabase.ts):
```typescript
export async function getUserTeamId(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  // Hardcoded team ID for your two-person team
  return '550e8400-e29b-41d4-a716-446655440000'; // ← Your team ID here
}
```

3. Run [TEAM_SETUP.sql](TEAM_SETUP.sql) in Supabase SQL Editor:
   - Get your user IDs
   - Insert team memberships

#### Option B: User Metadata
Store `team_id` in auth.users metadata during signup

#### Option C: Dynamic (Already Implemented)
Query `team_members` table dynamically

---

## 🚀 Usage

### Navigate to Documents
- Start dev server: `npm run dev`
- Click "Documents" in sidebar
- Create your first document

### Features Available
- **Blocks**: Paragraph, headings, lists, quotes, tables, code
- **Media**: Images, videos, audio, files (requires upload config)
- **Formatting**: Bold, italic, colors, links
- **Auto-save**: 2 seconds after last edit
- **Manual save**: Click save button anytime

---

## 📋 Quick Test Checklist

- [ ] App starts without errors
- [ ] Navigate to `/documents`
- [ ] Click "New Document" → creates document
- [ ] Type text → auto-saves after 2s
- [ ] Edit title → saves on blur
- [ ] Click save button → immediate save
- [ ] Refresh page → content persists
- [ ] Delete document → removes from list
- [ ] Login as second team member → sees shared documents

---

## 🔒 Security Notes

### RLS Protections
- All queries filter by team membership
- Cannot access other teams' documents
- Authentication required for all operations

### Test RLS
```sql
-- As authenticated user in team
select * from documents; -- ✅ Returns team documents

-- As unauthenticated user
select * from documents; -- ❌ Returns empty (blocked by RLS)
```

---

## 🐛 Common Issues

### Issue: "Cannot find module '@blocknote/...'"
**Fix**: Run `npm install` with all BlockNote packages

### Issue: "User is not part of a team"
**Fix**: 
1. Check `getUserTeamId()` returns correct team_id
2. Verify user exists in `team_members` table
3. Run `TEAM_SETUP.sql` to insert team membership

### Issue: Auto-save not triggering
**Fix**: 
1. Open browser DevTools → Network tab
2. Type in editor
3. After 2s, should see PUT request to Supabase
4. If not, check console for errors

### Issue: RLS blocking queries
**Fix**:
1. Ensure user is authenticated (not anonymous)
2. Verify `team_members` row exists for user
3. Check RLS policies in Supabase Dashboard

---

## 📚 Documentation

- **Setup Details**: [BLOCKNOTE_SETUP.md](BLOCKNOTE_SETUP.md)
- **Implementation**: [BLOCKNOTE_IMPLEMENTATION.md](BLOCKNOTE_IMPLEMENTATION.md)
- **Team Setup**: [TEAM_SETUP.sql](TEAM_SETUP.sql)
- **BlockNote Docs**: https://www.blocknotejs.org/docs
- **Supabase RLS**: https://supabase.com/docs/guides/auth/row-level-security

---

## 🎨 Customization Ideas

### Add File Uploads
```typescript
const editor = useCreateBlockNote({
  uploadFile: async (file) => {
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(`${crypto.randomUUID()}-${file.name}`, file);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(data.path);
    
    return publicUrl;
  },
});
```

### Custom Block Types
See: https://www.blocknotejs.org/docs/features/custom-schemas

### Real-Time Collaboration
See: https://www.blocknotejs.org/docs/features/collaboration
(Requires YJS provider like PartyKit, Liveblocks, or Y-Sweet)

---

## ✅ Production Checklist

Before deploying:
- [ ] Environment variables set in production
- [ ] Team memberships configured
- [ ] RLS policies tested
- [ ] Auto-save behavior verified
- [ ] Error handling tested
- [ ] Security advisors checked (no issues with new tables)

---

## 🎉 You're Ready!

Everything is set up and production-ready. Start creating documents!

**Questions?** See full documentation in the files listed above.
