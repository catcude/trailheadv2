-- Profiles: roles live here, not in auth metadata (CLAUDE.md §Auth & Data Model).
-- RLS is enabled in the SAME migration that creates the table — owner-only.
-- Data minimization: role + display name only; no DOB, phone, or school.

create type public.user_role as enum ('student', 'parent', 'teacher');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role,
  display_name text check (char_length(display_name) between 1 and 60),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Owner-only. There is deliberately NO parent/teacher read path into any
-- student data, here or in any later migration, without an explicit,
-- consent-based feature that gets its own review.
create policy "profiles_select_own"
  on public.profiles for select
  using ((select auth.uid()) = id);

create policy "profiles_update_own"
  on public.profiles for update
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- No insert policy: rows are created by the signup trigger below.
-- No delete policy: deletion cascades from auth.users (account deletion).

-- Note: role is self-descriptive (chosen by the user at onboarding, per PRD
-- §6.1), not a permission tier. If role ever gates privileged behavior,
-- move role changes server-side and re-review these policies.

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
