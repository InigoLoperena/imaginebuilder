# Venture Builder Ownership Tracking — Build Plan

A protected web app where team members log hours per project and ownership percentages are calculated automatically from logged hours + manually-assigned fixed allocations. A super-admin area at `/Venturebuilder` manages users, projects and fixed ownership.

The current marketing landing page (`/`) and legal pages stay as they are. The app lives under new routes.

## Routes

- `/` — current landing (unchanged)
- `/privacidad`, `/cookies`, `/aviso-legal` — current legal pages (unchanged)
- `/login` — email + password sign-in (no public sign-up)
- `/app` — authenticated dashboard, lists projects as logo cards/tabs
- `/app/projects/:id` — project page: timesheet form, my entries, totals, ownership pie + table
- `/Venturebuilder` — super-admin only: manage projects, users, fixed ownership, view all entries

## Database (Lovable Cloud / Supabase)

New tables in `public`:

- `profiles` — `id (uuid → auth.users)`, `full_name`, `email`
- `app_role` enum: `admin`, `member` (extends existing pattern; reuse existing `user_roles` table — it already has `has_role()`)
- `projects` — `id`, `name`, `logo_url`, `created_at`, `updated_at`
- `time_entries` — `id`, `project_id`, `user_id`, `hours numeric`, `work_date date`, `description text`, `created_at`
- `fixed_ownership` — `id`, `project_id`, `user_id`, `percentage numeric(5,2)`, unique `(project_id, user_id)`

RLS:
- `profiles`: every authenticated user can read; user can update own; admin can update/insert/delete.
- `projects`: authenticated read; admin write.
- `time_entries`: user can read/insert/update/delete own rows; admin can read/delete all. `user_id` forced to `auth.uid()` via WITH CHECK.
- `fixed_ownership`: authenticated read; admin write.

A `logos` public storage bucket for project logos (admin write, public read).

Initial users (Lucas, Pablo, Andrea, Isvara, Joaquina, Íñigo, Yessica) and the super-admin `inigoloperena@gmail.com` are created via the admin UI after the schema is in place — public sign-up stays disabled in auth settings.

The super-admin role is auto-granted to `inigoloperena@gmail.com` on first sign-up via a trigger on `auth.users` (verified-email domain pattern, adapted to a single address).

## Ownership math (client-side, single source of truth)

For each project:
1. Sum every user's `fixed_ownership.percentage` → `F` (validated ≤ 100 in admin form).
2. Remaining pool `R = 100 − F`.
3. Sum `time_entries.hours` per user → `h_u`, total `H = Σ h_u`.
4. Variable share for user u: `R × h_u / H` (or `0` if `H = 0`).
5. Final share: `fixed_u + variable_u`.

Implemented once in `features/ownership/calculateOwnership.ts` and consumed by the project page (table + pie) and the admin view.

## Folder structure

Feature-based, UI separated from logic:

```text
src/
  features/
    auth/            useAuth, AuthProvider, RequireAuth, RequireAdmin
    projects/        api.ts, useProjects, ProjectCard, ProjectLogo
    timesheet/       api.ts, useTimeEntries, TimeEntryForm, TimeEntryTable
    ownership/       calculateOwnership.ts, OwnershipPie, OwnershipTable
    admin/           UsersPanel, ProjectsPanel, FixedOwnershipPanel, AllEntriesPanel
  pages/
    LoginPage.tsx
    AppLayout.tsx
    DashboardPage.tsx
    ProjectPage.tsx
    AdminPage.tsx
```

Reused: shadcn `Card`, `Table`, `Tabs`, `Dialog`, `Input`, `Button`, recharts `PieChart` (already in deps).

## Implementation steps

1. **Migration** — create enum extension if needed, `profiles`, `projects`, `time_entries`, `fixed_ownership`, GRANTs, RLS policies, trigger to insert profile + auto-admin for `inigoloperena@gmail.com`.
2. **Storage** — create public `logos` bucket + policies.
3. **Auth settings** — disable public sign-ups via `configure_auth`.
4. **Auth feature** — `AuthProvider`, `useAuth`, `RequireAuth`, `RequireAdmin`, `/login` page.
5. **Projects + timesheet features** — hooks using `supabase-js` + react-query (already installed).
6. **Ownership feature** — pure calc function + pie/table components.
7. **Pages** — `AppLayout` (top bar with logo, sign-out), `DashboardPage` (project cards), `ProjectPage` (form, my entries, totals, ownership pie + table), `AdminPage` at `/Venturebuilder`.
8. **Router** — register all new routes in `src/App.tsx` behind `Suspense`.
9. **Seed admin** — instruct user to sign up with `inigoloperena@gmail.com` once; trigger grants admin automatically. Other users are created from the admin panel (admin invites by email + temp password via edge function using service role).

## Notes / decisions to confirm

- New routes are added; existing landing page and legal pages are untouched.
- "Create user" from the admin panel uses an edge function with the service role to call `auth.admin.createUser`, then inserts the profile. The admin sets the temporary password; the user changes it after first login (optional later iteration).
- Language: admin/app UI in Spanish to match the rest of the site.
- The published landing URL keeps working; the new app is reachable at `/login` → `/app`.

If anything above should change (e.g. English UI, different ownership rules, different route name), tell me before I build.
