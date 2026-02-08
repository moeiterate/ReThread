# Architecture Planning

**When to Use:** After finalizing your project specification. Before writing any code.

**Context Needed:** Your finalized specification from the synthesis step.

---

## Prompt

```
Based on this specification:
[PASTE YOUR SPECIFICATION HERE]

Design a system architecture for [YOUR TECH STACK]. Include:

1. Database schema (tables, relationships, indexes)
2. API structure (endpoints, methods, authentication)
3. Authentication/authorization strategy
4. File storage solution (if applicable)
5. External service integrations
6. Security considerations
7. Scalability considerations
8. Deployment strategy

Provide text-based diagrams where helpful.
```

---

## Usage Notes

- **Use in Cursor planning mode** - Or equivalent planning tool in your IDE
- **Be specific about tech stack** - "Next.js 14, Supabase PostgreSQL, Vercel" not just "web app"
- **Request diagrams** - Text-based (ASCII, Mermaid) works great for documentation
- **Document decisions** - Save as `ARCHITECTURE.md` and `SYSTEM_DESIGN.md`
- **Reference later** - This becomes your source of truth during implementation

---

## Tech Stack Specificity Examples

**Too vague:**
> "Design architecture for a web app"

**Good:**
> "Design architecture for Next.js 14 app using App Router, Supabase PostgreSQL + Auth, Vercel hosting, R2 storage for files"

**Even better:**
> "Design architecture for Next.js 14 app using:
> - Frontend: App Router, Server Components, Tailwind
> - Backend: Next.js API routes, Prisma ORM
> - Database: Supabase PostgreSQL (free tier, 500MB limit)
> - Auth: NextAuth.js with email/password + Google OAuth
> - Storage: Cloudflare R2 (10GB free)
> - Deployment: Vercel (hobby plan)
> - Constraints: Must work offline-first, sync when online"

---

## What Good Output Looks Like

Should include:

### 1. Database Schema
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table  
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  status TEXT DEFAULT 'todo',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
```

### 2. API Structure
```
POST   /api/auth/login       - Email/password login
POST   /api/auth/logout      - Session cleanup
GET    /api/tasks            - List user's tasks
POST   /api/tasks            - Create task
PATCH  /api/tasks/:id        - Update task
DELETE /api/tasks/:id        - Delete task
POST   /api/webhooks/slack   - Slack webhook endpoint
```

### 3. Security Considerations
- Row-Level Security (RLS) on all tables
- API routes check authentication before operations
- CORS restricted to production domain
- Secrets in environment variables, not code
- Rate limiting on public endpoints

### 4. Deployment Strategy
- Git push → Vercel auto-deploy
- Database migrations via Supabase CLI
- Environment variables in Vercel dashboard
- Staging environment for testing

---

## Common Mistakes to Avoid

❌ **Not considering free tier limits**
> "Use Supabase for everything" → What happens at 500MB DB limit?

❌ **Over-engineering for scale you don't have**
> "Use Redis for caching" → Do you have a performance problem yet?

❌ **Forgetting about authentication edge cases**
> "Users can edit tasks" → What about deleted users? Expired sessions?

❌ **No rollback plan**
> "Deploy to production" → What if it breaks? How do you rollback?

---

## Next Step

After architecture is defined, choose implementation template:
- High control → `../implementation/step-by-step-template.md`
- Balanced → `../implementation/phase-by-phase-template.md`
