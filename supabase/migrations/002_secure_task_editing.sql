begin;

alter table public.tasks
  enable row level security;

-- Signed-out visitors receive no table access.
revoke all privileges
  on table public.tasks
  from anon;

-- Loading and returning an edited task requires SELECT access.
grant select
  on table public.tasks
  to authenticated;

-- Remove the existing table-wide UPDATE privilege.
revoke update
  on table public.tasks
  from authenticated;

-- Only the fields exposed by the edit feature may be updated.
grant update (title, is_complete)
  on table public.tasks
  to authenticated;

drop policy if exists "Users can read their own tasks"
  on public.tasks;

create policy "Users can read their own tasks"
  on public.tasks
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own tasks"
  on public.tasks;

create policy "Users can update their own tasks"
  on public.tasks
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- Database validation also applies to direct API requests.
alter table public.tasks
  add constraint tasks_title_valid
  check (
    title is not null
    and char_length(title) between 1 and 80
    and char_length(btrim(title)) > 0
  );

alter table public.tasks
  add constraint tasks_completion_valid
  check (is_complete is not null);

commit;