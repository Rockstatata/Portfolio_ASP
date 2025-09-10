# Portfolio_ASP

A responsive personal portfolio built with ASP.NET Web Forms (C# 7.3 / .NET Framework 4.8).  
Provides a modern public site (glassmorphism, light/dark theme, Vanta.js background) and a small admin panel for managing homepage sections, projects, blogs, experiences, skills and messages backed by SQL Server.

Maintainer: GitHub Copilot

---

## Key features

- Public site (portfolio.aspx)
  - Hero, About, Skills, Projects, Timeline, Blog, Contact sections
  - Horizontal-scroll blog carousel + blog reading modal (transparent backdrop, light/dark)
  - Vanta.js background with graceful fallback
  - Responsive, accessible UI with keyboard and touch support

- Admin area
  - CRUD pages (ManageHome, ManageBlogs, ManageProjects, ManageExperience, ManageSkills, ManageContacts)
  - Inline editing of home sections via GridView
  - Initialization (seeding) of default home sections if table empty
  - Basic admin action logging

- Implementation notes
  - Server: ASP.NET Web Forms (.aspx + code-behind)
  - Data access: ADO.NET (SqlConnection / SqlCommand) with parameterized queries
  - Client: vanilla JS (Scripts/script.js)
  - Styling: single CSS file (Content/styles.css)
  - Local persistence for some client features (localStorage for bookmarks/likes)

---

## Requirements

- Windows
- Visual Studio 2022 (or newer) with:
  - __.NET Framework 4.8__ development workload
  - Web development tools
- SQL Server (Express or full)
- Optional: Node / npm only if you plan to extend front-end toolchain
- Internet to load third-party assets (Vanta.js, three.js, Google Fonts, Font Awesome CDN)

---

## Quick start (local)

1. Clone repository
   - git clone https://github.com/Rockstatata/Portfolio_ASP.git
   - open folder in Visual Studio 2022

2. Restore NuGet packages
   - In Visual Studio: __Tools > NuGet Package Manager > Package Manager Console__ then run: `Update-Package -reinstall`
   - Or right-click solution > __Restore NuGet Packages__

3. Configure database connection
   - Open Web.config and set your connection string name `adminpanel_db` to point to your SQL Server instance.

4. Ensure DB schema exists
   - Create a database named in your connection string (e.g. `PortfolioDb`).
   - Create tables used by the app (examples below). The app will seed default home sections if `HomeSections` is empty.

5. Run in Visual Studio
   - Press __F5__ (Start Debugging) or click __Debug > Start Debugging__ to launch with __IIS Express__.

---

## Database - essential tables (schema summary)

The app uses straightforward tables. Use these as guidance — adjust types as needed.

- HomeSections
  - Id (int, PK, identity)
  - SectionName (nvarchar)
  - Content (nvarchar(max), nullable)
  - ImagePath (nvarchar, nullable)
  - DisplayOrder (int)
  - IsActive (bit)
  - CreatedDate (datetime)
  - UpdatedDate (datetime, nullable)

- Projects, Blogs, Skills, Experience, Timeline, Contacts (simple COUNT queries used)
  - Each table should at minimum include an Id (PK) and typical fields:
    - Projects: Title, Description, ImagePath, Technologies, SourceLink, DemoLink, ProjectYear, Status
    - Blogs: Title, Content, Excerpt, Tags, Categories, PublishDate, ReadTime
    - Skills: SkillName, SkillIcon, Category
    - Experience: Company, Position, Duration, Description, Responsibilities
    - Timeline: YearRange, Title, Location, Description, Type
    - Contacts: Name, Email, Subject, Message, CreatedDate

If you want, I can provide full CREATE TABLE scripts for these tables.

---

## Seeding & initialization

- ManageHome.aspx.cs includes `InitializeDefaultHomeSections()`; if `HomeSections` has zero rows the method inserts a set of default sections.
- You can safely run the site after creating an empty database — the app will seed homepage sections.

---

## Project structure (high level)

- `/` root
  - portfolio.aspx (+ portfolio.aspx.cs) — public site
  - /admin (ManageHome.aspx, ManageBlogs.aspx, ManageProjects.aspx, etc.)
  - /Content/styles.css — all styles including modal + light/dark support
  - /Scripts/script.js — theme toggle, Vanta init, blog scroll, modal logic, notifications
  - Web.config — connection strings & config
  - App_Code / Services / Models (PortfolioService.cs, PortfolioModels.cs) — business logic & objects

---

## Client-side behavior

- Theme: toggled via element `#theme-toggle`, persisted in localStorage `theme` key
- Blog carousel: horizontal scroll with mouse/touch drag, arrow controls, dots
- Blog modal: click blog card or blog-arrow opens modal populated from card markup; click outside (backdrop) or Escape closes it
- Local features: bookmark/like stored in localStorage (keys: `blogBookmarks`, `blogLikes`)

---

## Deployment (IIS)

1. Publish from Visual Studio
   - Right click project > __Publish__ > choose profile (Folder or IIS)
2. Ensure production connection string points to production SQL Server
3. Configure IIS app pool to run .NET Framework v4.0
4. Grant DB access to the app pool identity or use SQL authentication

---

## Troubleshooting & common fixes

- Exception: "The conversion could not be completed because the supplied DateTime did not have the Kind property set correctly."
  - Fix applied in ManageHome.aspx.cs: use `DateTime.SpecifyKind(parsed, DateTimeKind.Utc)` before calling `TimeZoneInfo.ConvertTimeFromUtc(...)`

- If an ADO.NET query fails:
  - Check `Web.config` connection string `adminpanel_db`
  - Ensure the user account has permissions
  - Check SQL Server instance (use SSMS to run queries)

- If JS features don't run:
  - Open browser console (F12) and check for errors (missing script path or blocked CDNs)
  - Confirm `Scripts/script.js` is loaded and not blocked by CSP

- Duplicate `</form>` in .aspx pages will break client scripts — ensure only one server form (`<form runat="server">`) exists.

---

## Security notes

- Avoid storing sensitive credentials in source. Use Windows secrets or environment-managed connection strings for production.
- All DB calls use parameterized queries; validate input when accepting content from admin UI.
- For production, serve assets over HTTPS and enable strong IIS security (request filtering, authentication as needed).

---

## Testing

- Manual: run with __IIS Express__ (F5); exercise each admin page and edit/save home sections
- Verify blog modal: open portfolio.aspx, click a blog card — modal should open and close on backdrop/Escape
- Verify theme persistence: toggle theme and reload

---

## Contributing

- Fork repo > create feature branch > open a PR.
- Keep server-side changes compatible with .NET Framework 4.8 and C# 7.3.
- Prefer ADO.NET and avoid introducing heavy runtime dependencies in the main project.

---

## Next steps / optional improvements

- Add unit/integration tests for DB helpers (requires refactor to allow DI)
- Move SQL schema to a SQL migration script or simple setup SQL file
- Add image upload in admin pages with validation and storage (Azure Blob / local uploads)
- Replace cookie-based visitor tracking with server-side persistent analytics if needed

---

## Contact

If you want a README expanded with:
- full CREATE TABLE scripts,
- step-by-step IIS publish profile,
- or a one-file SQL seed script,

tell me which tables to include and I’ll generate them.
