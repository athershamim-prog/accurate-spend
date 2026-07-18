# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this is

Marketing / lead-gen website for **Accurate Spend** — a company offering managed federal (CMS Open Payments / Sunshine Act) and state transparency reporting for pharmaceutical manufacturers, plus two other product lines: **HCP Engage** (HCP engagement compliance platform) and **Accurate AI** (the AI engine powering Accurate Spend, also sold as custom AI-built compliance systems).

Live at **https://accuratespendhq.com**, hosted on Vercel (project `accurate-spend` under the `athers-projects-dc3c8312` team).

## Tech stack

- **No framework, no build step.** Plain HTML files at the repo root, one per page.
- **Tailwind CSS** via the CDN `<script src="https://cdn.tailwindcss.com">` on every page (config inlined per-page — navy/teal color tokens, see below).
- **Font Awesome 6.5.0** via CDN for all icons.
- **Google Fonts** (Inter) via CDN.
- `css/styles.css` — hand-written CSS for anything Tailwind utilities don't cover cleanly (nav dropdowns, mobile menu/accordion, hero gradients, animations).
- `js/main.js` — single shared script (sticky nav, mobile menu toggle, desktop dropdowns, mobile accordion, contact form submit, scroll reveals, animated counters). Loaded at the bottom of every page.
- `api/contact.js` — Vercel serverless function. Sends the contact/demo-request form via **nodemailer** over Hostinger SMTP. Requires env vars `SMTP_USER` and `SMTP_PASS` (set in Vercel project settings, not in this repo).
- `vercel.json` — `cleanUrls` (serve `/page` instead of `/page.html`), a rewrite for `/solutions/accurate-spend`, redirects for retired URLs, and security headers.

## Page map

| File | Route | Purpose |
|---|---|---|
| `index.html` | `/` | Homepage |
| `solutions-accurate-spend.html` | `/solutions-accurate-spend` | Accurate Spend product page (federal reporting) |
| `solutions-hcp-engage.html` | `/solutions-hcp-engage` | HCP Engage product page |
| `services-state-reporting.html` | `/services-state-reporting` | State reporting service page |
| `accurate-ai.html` | `/accurate-ai` | Accurate AI page — positioned as the AI engine behind Accurate Spend, solving compliance challenges. Formerly `services-compliance-hub.html` — old URL 301s here via `vercel.json`. |
| `contact.html` | `/contact` | General contact / demo request form (posts to `api/contact.js`) |
| `contact-hcp-engage.html` | `/contact-hcp-engage` | HCP Engage-specific demo request form |

## Site-wide conventions (important — no templating engine)

Every page **duplicates** its own `<nav>` and `<footer>` markup — there are no shared partials/includes. When changing nav or footer, the edit must be repeated across all 7 HTML pages (grep first, then apply the same change everywhere). This has bitten us before (inconsistent footers, a dead nav link) — always verify with `grep -rn` across `*.html` after editing shared chrome.

**Nav dropdowns** (desktop): "Solutions" (Accurate Spend, HCP Engage) and "Services" (State Reporting, Accurate AI), toggled via `#solutions-trigger`/`#solutions-dropdown` and `#services-trigger`/`#services-dropdown` in `js/main.js`.

**Mobile nav**: collapsible accordions, not flat repeated links. Pattern is a `<button class="mobile-nav-toggle" data-target="mobile-solutions">` / `data-target="mobile-services"` toggling `.mobile-submenu` divs containing `.mobile-nav-sublink` items. JS lives in the "Mobile nav accordions" block in `js/main.js`.

**Footer** — standardized across all pages as two link columns:
- **Product & Services**: Accurate Spend (Federal Reporting) → HCP Engage → State Reporting → Accurate AI (this exact order)
- **Company**: Expertise → About → Contact Us

The street address was deliberately removed from the footer sitewide — it now appears **only** in the contact-form sidebar on `contact.html` and `contact-hcp-engage.html`. Don't re-add it to the footer without being asked.

Contact links route contextually: `solutions-hcp-engage.html` and `contact-hcp-engage.html` point "Contact" to `contact-hcp-engage.html`; every other page uses `contact.html`.

**Colors**: navy `#1a3363` (dark `#0d1f3c`, light `#244a8a`) and teal `#00a896` (dark `#007f71`, light `#e6f7f6`) — defined per-page in the inline `tailwind.config` script and as CSS custom properties in `css/styles.css` (`--navy`, `--teal`, etc.).

## Deployment

Git remote: `https://github.com/athershamim-prog/accurate-spend.git` (branch `main`).

Standard flow used in this repo:
```bash
git add -A
git commit -m "..."
git push origin main
npx vercel --prod --yes
```
Don't assume the GitHub→Vercel integration auto-deploys on push — run `vercel --prod` explicitly to be sure production is updated (this is what's been done historically here).

## Local preview

No dev server script in `package.json`. Use `npx vercel dev` (the project is already linked via `.vercel/`) to serve the static pages plus `api/contact.js` exactly as in production, including `vercel.json` redirects/headers.
