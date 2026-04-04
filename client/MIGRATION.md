# ASP.NET WebForms → Next.js Migration Guide

## Legacy 1:1 Homepage Mode

The `/` route now renders a generated fragment extracted from `server/admin_panel/portfolio.aspx` to preserve the original ASP.NET portfolio design/behavior.

- Fragment source: `client/public/legacy/portfolio-fragment.html`
- Legacy assets: `client/public/legacy/Content/styles.css`, `client/public/legacy/Scripts/script.js`, `client/public/legacy/assets/*`
- Regenerate fragment after legacy markup updates:

```bash
npm run legacy:fragment
```

Note: Run the command from the `client` folder.

## Architecture Mapping

| ASP.NET WebForms | Next.js Equivalent |
|---|---|
| `.aspx` pages | App Router pages (`page.tsx`) |
| Code-behind (`.aspx.cs`) | Server Components / API Routes |
| Master Pages (`.Master`) | Root Layout (`layout.tsx`) |
| Server Controls | React Components |
| `Session["AdminLoggedIn"]` | Supabase Auth |
| SQL Server + ADO.NET | Supabase PostgreSQL |
| `Web.config` | `.env.local` / `next.config.ts` |
| GridView / Repeater | React tables with state |
| ViewState | React state / URL params |
| IIS Hosting | Vercel deployment |

## Page Route Mapping

| ASP.NET Page | Next.js Route |
|---|---|
| `portfolio.aspx` | `/` (homepage) |
| `portfolio.aspx#about` | `/about` |
| `portfolio.aspx#projects` | `/projects` |
| `portfolio.aspx#blog` | `/blog` |
| `portfolio.aspx#contact` | `/contact` |
| `Login.aspx` | `/admin/login` |
| `Default.aspx` (admin) | `/admin/dashboard` |
| `ManageProjects.aspx` | `/admin/projects` |
| `ManageBlogs.aspx` | `/admin/blogs` |
| `ViewContacts.aspx` | `/admin/messages` |
| `Settings.aspx` | `/admin/settings` |

## Database Migration

### From SQL Server to Supabase PostgreSQL

The database schema has been translated from SQL Server syntax to PostgreSQL.
See `supabase/schema.sql` for the complete schema.

Key changes:
- `IDENTITY(1,1)` → `uuid_generate_v4()` (UUID primary keys)
- `NVARCHAR(MAX)` → `TEXT`
- `BIT` → `BOOLEAN`
- `DATETIME` → `TIMESTAMPTZ`
- `GETDATE()` → `NOW()`
- Added Row Level Security (RLS) policies
- Added proper indexes

### Authentication Migration

**Before (ASP.NET):**
- Session-based auth with `Session["AdminLoggedIn"]`
- Plaintext password comparison
- Fallback to `Web.config` credentials

**After (Next.js client):**
- Passkey-based admin login (`ADMIN_PASSKEY`)
- Signed JWT cookie session (`ADMIN_SESSION_SECRET`)
- Route protection via `proxy.ts` and session verification
- Supabase used for portfolio data CRUD, not for admin user authentication

## Setup Instructions

### 1. Supabase Setup

1. Create a new Supabase project
2. Run `supabase/schema.sql` in the SQL Editor
3. Set up authentication (email/password)
4. Create an admin user

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in values:

```bash
cp .env.example .env.local
```

### 3. Development

```bash
cd client
npm install
npm run dev
```

### 4. Deployment (Vercel)

1. Connect the repository to Vercel
2. Set the root directory to `client`
3. Add environment variables
4. Deploy

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Deployment:** Vercel
- **Icons:** react-icons
- **Notifications:** react-hot-toast
