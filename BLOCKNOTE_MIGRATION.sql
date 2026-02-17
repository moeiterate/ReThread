-- BlockNote Documents Migration (Production-Ready)
-- Fixes: RLS policies, team_id, updated_at trigger, pgcrypto extension

-- Enable required extensions
create extension if not exists pgcrypto;

-- Create documents table with team-based access
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null, -- Team ownership (not user_id)
  title text not null default 'Untitled Document',
  content jsonb not null default '[]'::jsonb, -- BlockNote Block[] array
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create index for fast team queries
create index if not exists documents_team_id_idx on documents(team_id);
create index if not exists documents_created_at_idx on documents(created_at desc);

-- Auto-update updated_at trigger (server-controlled, not client)
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_documents_updated_at
  before update on documents
  for each row
  execute function update_updated_at_column();

-- Enable RLS
alter table documents enable row level security;

-- RLS Policies (Team-based, authenticated only)
-- Policy 1: Users can SELECT documents from their team
create policy "Users can view team documents"
  on documents
  for select
  using (
    auth.uid() is not null
    and team_id in (
      select team_id from team_members
      where user_id = auth.uid()
    )
  );

-- Policy 2: Users can INSERT documents for their team
create policy "Users can create team documents"
  on documents
  for insert
  with check (
    auth.uid() is not null
    and team_id in (
      select team_id from team_members
      where user_id = auth.uid()
    )
  );

-- Policy 3: Users can UPDATE documents in their team
create policy "Users can update team documents"
  on documents
  for update
  using (
    auth.uid() is not null
    and team_id in (
      select team_id from team_members
      where user_id = auth.uid()
    )
  );

-- Policy 4: Users can DELETE documents from their team
create policy "Users can delete team documents"
  on documents
  for delete
  using (
    auth.uid() is not null
    and team_id in (
      select team_id from team_members
      where user_id = auth.uid()
    )
  );

-- Note: This assumes you have a team_members table like:
-- create table team_members (
--   team_id uuid not null,
--   user_id uuid not null references auth.users(id),
--   primary key (team_id, user_id)
-- );

-- For a simple two-person team, you might just use a single team_id
-- and modify the policies to check if user is in allowed users list
