-- Every task belongs to a Supabase Auth user.
alter table public.tasks
  add column if not exists user_id uuid
  references auth.users(id)
  on delete cascade;

alter table public.tasks
  alter column user_id set default auth.uid(),
  alter column user_id set not null;

-- Improves queries and policies that filter by task owner.
create index if not exists tasks_user_id_idx
  on public.tasks (user_id);

-- Require RLS for API access.
alter table public.tasks enable row level security;

-- Signed-out visitors receive no task access.
revoke all privileges
  on table public.tasks
  from anon, authenticated;

-- Signed-in users may attempt the operations used by the app.
-- The policies below determine which rows are allowed.
grant select, insert, update, delete
  on table public.tasks
  to authenticated;

create policy "Users can read their own tasks"
  on public.tasks
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own tasks"
  on public.tasks
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own tasks"
  on public.tasks
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their own tasks"
  on public.tasks
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);