## Portfolio Next.js Client

This is the production frontend for the portfolio and admin panel.

## Requirements

- Node.js 20+
- npm 10+
- A Supabase project

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Environment Variables

Create `.env.local` (or update `.env`) with these values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_publishable_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_PASSKEY=replace_with_a_long_random_passkey
ADMIN_SESSION_SECRET=replace_with_a_minimum_32_char_random_secret
ADMIN_SESSION_TTL_SECONDS=28800
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Portfolio
```

Notes:
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` is the preferred frontend key.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is kept as a compatibility fallback.
- `SUPABASE_SERVICE_ROLE_KEY` is required for server-side admin resource APIs and seed scripts.
- `ADMIN_SESSION_SECRET` must be at least 32 characters.
- `ADMIN_PASSKEY` must be at least 8 characters (12+ recommended).

## 3. Prepare Supabase Schema

1. Open Supabase SQL Editor.
2. Run `supabase/schema.sql`.
3. In Supabase Dashboard go to Project Settings -> API.
4. Ensure `public` is included in Exposed Schemas.
5. Keep Row Level Security enabled on portfolio tables in production.

If `public` is not exposed, all table requests fail with `PGRST205`.

## 4. Validate DB Access + Seed Data

```bash
npm run db:check
npm run seed
```

Optional reset seed (re-inserts seeded rows by known IDs):

```bash
npm run seed:force
```

## 5. Run Locally

```bash
npm run dev
```

## Admin Access

- URL: `/admin`
- Passkey: value from `ADMIN_PASSKEY`

## Vercel Deployment Guide

1. Import repository into Vercel.
2. Set Root Directory to `client`.
3. Framework Preset: Next.js.
4. Add Environment Variables in Vercel Project Settings:
	 - `NEXT_PUBLIC_SUPABASE_URL`
	 - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
	 - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional fallback)
	 - `SUPABASE_SERVICE_ROLE_KEY`
	 - `ADMIN_PASSKEY`
	 - `ADMIN_SESSION_SECRET`
	 - `ADMIN_SESSION_TTL_SECONDS` (optional)
	 - `NEXT_PUBLIC_SITE_URL` (your Vercel production URL)
	 - `NEXT_PUBLIC_SITE_NAME`
5. Deploy.

After deploy, verify:
- `/` loads home sections and portfolio data.
- `/blog`, `/projects`, `/about`, `/contact` load data.
- `/admin` accepts the configured passkey.
- Admin CRUD pages can read/write data.

## Troubleshooting

- `PGRST205 Could not find table ... in schema cache`
	- Run `supabase/schema.sql` again.
	- Ensure `public` is exposed in Supabase API settings.
	- Confirm URL and keys belong to the same Supabase project.

- Admin pages load but writes fail
	- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in runtime environment.
	- Confirm key role is `service_role` and belongs to the same project ref as `NEXT_PUBLIC_SUPABASE_URL`.

- `/admin` always rejects passkey
	- Confirm `ADMIN_PASSKEY` is set and at least 8 characters long (12+ recommended).
	- Confirm `ADMIN_SESSION_SECRET` is set and at least 32 characters long.
	- Redeploy after updating env variables.
