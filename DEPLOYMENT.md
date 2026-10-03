# Deployment

## 1. Supabase

Create or select a Supabase project, then link this repository:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push --dry-run
supabase db push
supabase functions deploy admin-create-user
supabase functions deploy resolve-login
supabase functions deploy send-welcome-email
```

Set Edge Function secrets in Supabase, never in GitHub or Vercel:

```bash
supabase secrets set RESEND_API_KEY=...
```

Supabase automatically provides `SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` to Edge Functions.

### Bootstrap the first administrator

The application no longer grants admin privileges based on a hard-coded email. After creating the first account in Supabase Auth, run this once in the Supabase SQL editor, replacing the UUID:

```sql
insert into public.user_roles (user_id, role)
values ('AUTH_USER_UUID', 'admin'::public.app_role)
on conflict (user_id, role) do nothing;
```

## 2. Vercel

Import this GitHub repository as a Vite project.

- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

Add these Vercel Environment Variables for Production and Preview:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Do not add `SUPABASE_SERVICE_ROLE_KEY` or `RESEND_API_KEY` to Vercel.

## 3. Supabase Auth URLs

In Supabase Authentication > URL Configuration, set the production Vercel/custom domain as Site URL and add your Vercel preview pattern as an allowed redirect URL.
