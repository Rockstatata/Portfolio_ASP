---
applyTo: '**'
---
# Portfolio Frontend Project Context
---

## 🧠 Project Context: Portfolio Frontend (Client-side)

You're building a **modern, elegant, and professional personal portfolio website**. This is the **client-facing part** only — the admin panel (backend) is separate and will be integrated later via dynamic data. For now, the frontend will use **dummy/static data** during development.

---

## 🎯 Project Goals

* Build a fully-responsive, elegant portfolio site.
* Reflect a **modern, minimalistic design** with refined typography and a **crimson red theme**, similar to Laravel’s branding.
* Avoid all unnecessary animations and visual clutter — only **elegant, meaningful animations** where appropriate.
* Dark/Light mode support with a **floating toggle button** on the top navbar.
* Future integration with a backend admin panel (ASP.NET WebForms) for dynamic content loading.
* All content (projects, timeline, blogs, contact info, etc.) will later come from the backend.
* The final site must be **production-grade**, smooth, and professional.

---

## 🧩 UI/UX Design Inspirations (Strictly Followed)

### 1. **Laravel.com** (`https://laravel.com`)

* **Typography & Font**: Laravel uses **"Inter"** for all its content — clean, modern sans-serif font. This is your exact font.
* **Color Palette**: Crimson Red and Neutral Black/White shades.
* **Layout Aesthetic**: Elegant spacing, modern hero sections, subtle gradients, glassmorphism in some areas.

### 2. **[https://adityaseth.in/](https://adityaseth.in/)**

* Portfolio layout and section separation.
* Consistent content structure and vertical rhythm.
* Smooth transitions and soft color theming.

### 3. **[https://saadbukhari.vercel.app/en](https://saadbukhari.vercel.app/en)**

* Clean layout and section containers.
* Scroll-based animation handled with subtlety.
* Neat, clean "About Me", skills, and contact sections.

### 4. **[https://www.serhii-nazarov.com/](https://www.serhii-nazarov.com/)**

* Unique **Timeline Section Design**.
* Well-balanced spacing between elements.
* Use of icons and cards to display experience/projects.

---

## 🖌️ Visual Identity & Design Language

* **Font**: `Inter`, same as Laravel.com. Use from Google Fonts or locally host.
* **Primary Color**: Crimson Red (#DC143C or Laravel's shade)
* **Theme Support**: Light/Dark mode with smooth transitions.
* **Mode Toggle**: Floating button at the top-right (persistent across all pages).
* **Background**:

  * Use **Vanta.js** (e.g., `NET`, `FOG`, or `TOPOLOGY`) for **light animated blurry backgrounds**.
  * Customizable via settings (color, opacity, zoom, etc.) to stay elegant, not distracting.
  * Should blend into the theme naturally (dark/light-aware).
* **Minimalism**: No heavy animations or flashy transitions. Elegant scroll reveals and smooth fade/slide only.

---

## 🧱 Required Sections in Client-Side

Each of these will initially use dummy data (e.g., hardcoded JSON or JS objects), but **should be componentized** for dynamic future integration:

* **Hero Section** — Welcome message, picture/logo, CTA button
* **About Me** — Short bio, skills highlights
* **Timeline** — Education, Experience in vertical roadmap-style cards
* **Projects** — Grid/card layout, support filtering by tags
* **Skills** — Visual layout with icons or progress bars
* **Blog** — List of latest blog posts (Title, preview, read more)
* **GitHub Stats** — GitHub Readme Stats or GitHub API display
* **Contact** — Form (non-functional for now), social icons
* **404 Page** — Custom not-found design
* **Scroll to top button** — Appears after scrolling down

---

## 🔧 Tech Stack & Tools

* **HTML + CSS + JS** (Vanilla — no frontend frameworks)
* **Tailwind CSS** for styling (allowed by your instructor)
* **GSAP** for animations (scroll reveal, fade-in)
* **Vanta.js** for animated background
* **Google Fonts** (Inter)
* **FontAwesome / Lucide Icons**
* **LocalStorage** or `data.json` files for dummy content (optional)

---

## 🧩 Feature-Specific UX Notes

* **Dark/Light Toggle**:

  * Floating in top navbar.
  * State persists with localStorage.
* **Filtering in Projects Section**:

  * Filter by tech stack/tag (e.g., React, ASP.NET, Python).
* **Blog Section**:

  * Keep structure clean and easy to plug into backend later.
  * Consider markdown rendering approach in future.

---

## 🔐 Admin Panel (Backend Placeholder for Now)

* The admin panel will later manage all inputs for every section.
* Hosted separately.
* For now, **all input fields/components must be developed in a way that their data can be dynamically updated later** (via API or props).

---

## 🚀 Git Workflow (As Advised by Course Teacher)

* Start from Day 1:

  * Initialize a GitHub repo (e.g., `portfolio-client`)
  * `git init` → connect to remote → commit initial structure
  * Structure folders for components, assets, dummy data, etc.
* Recommended Commits:

  * `Initial commit: Project setup & folder structure`
  * `Setup Inter font and base styles`
  * `Add navbar and theme toggle`
  * `Add hero section with dummy content`
  * `Add timeline and projects with dummy data`
  * ...continue component by component

---

## ✅ Final Checklist Before Coding

* [x] Font (Inter) configured
* [x] Crimson red palette confirmed
* [x] Background (Vanta.js) selected
* [x] Tailwind + GSAP installed
* [x] GitHub repo ready for continuous commits
* [x] Dummy data strategy clear
* [x] Future backend integration plan understood

---


