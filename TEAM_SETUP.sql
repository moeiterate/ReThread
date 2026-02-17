-- Team Setup Helper Script
-- Run this after creating your two users in Supabase Auth

-- Step 1: Generate a team UUID (copy this for your code)
select gen_random_uuid() as team_id;
-- Copy the result, e.g., '123e4567-e89b-12d3-a456-426614174000'

-- Step 2: Find your user IDs
select id, email from auth.users;
-- Copy both user IDs

-- Step 3: Insert team memberships
-- Replace the UUIDs below with your actual values
insert into team_members (team_id, user_id, role)
values 
  ('YOUR_TEAM_ID_HERE', 'USER_1_ID_HERE', 'owner'),
  ('YOUR_TEAM_ID_HERE', 'USER_2_ID_HERE', 'member');

-- Step 4: Verify team setup
select 
  tm.team_id,
  tm.role,
  u.email
from team_members tm
join auth.users u on tm.user_id = u.id;

-- Step 5: Test document creation (should succeed for team members)
-- This will be tested via the app UI after setup

-- Optional: Create a test document manually
insert into documents (team_id, title, content)
values (
  'YOUR_TEAM_ID_HERE',
  'Test Document',
  '[{"type":"paragraph","content":"Welcome to BlockNote!","id":"test-id"}]'::jsonb
);

-- Verify test document is visible
select id, title, team_id, created_at 
from documents 
where team_id = 'YOUR_TEAM_ID_HERE';
