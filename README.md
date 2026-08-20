<div align="center">

# Ryōma Development — Portfolio

**Personal portfolio & landing site for [Ryōma Development](https://ryomadev.com)**, a freelance web development brand focused on fast, accessible, and visually intentional websites.

🌐 [ryomadev.com](https://ryomadev.com)

</div>

---

## ✨ About

This is the source code for my personal/professional portfolio, built to showcase freelance web development work under the **Ryōma Development** brand. The site is built with performance, accessibility, and SEO as first-class concerns — not afterthoughts — and reflects a distinct visual identity built around a chromatic aberration / magenta-cyan aesthetic.

## 🧰 Tech Stack

| Layer           | Tech                                                              |
| --------------- | ----------------------------------------------------------------- |
| Framework       | [Astro v5](https://astro.build)                                   |
| UI Islands      | [React](https://react.dev)                                        |
| Styling         | [Tailwind CSS v4](https://tailwindcss.com) + custom design tokens |
| Language        | TypeScript                                                        |
| Hosting         | [Cloudflare Pages](https://pages.cloudflare.com)                  |
| Email           | [Resend](https://resend.com) (contact form + email routing)       |
| Package manager | [Bun](https://bun.sh)                                             |

## 🚀 Getting Started

```bash
# Install dependencies
bun install

# Start the dev server (localhost:4321)
bun dev

# Build for production
bun build

# Preview the production build locally
bun preview
```

## 📁 Project Structure

```
/
├── public/               # Static assets (images, favicons, etc.)
├── src/
│   ├── components/       # Astro/React components (ServiceCard, ProjectCard, TechIcon, etc.)
│   ├── layouts/          # Page layouts
│   ├── pages/            # File-based routes
│   └── styles/           # Global styles & design tokens
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

## 🧩 Key Features

- **Performance-first**: iterative Lighthouse audits driving fixes for Total Blocking Time, accessibility, and Best Practices scores. React islands are hydrated with `client:idle` / `client:visible` instead of `client:load` wherever possible to minimize JS execution on page load.
- **Accessible by default**: mobile navigation uses the `inert` attribute (instead of relying solely on `aria-hidden`) to correctly remove hidden menus from the accessibility tree and tab order.
- **SEO infrastructure**: structured metadata and JSON-LD schemas for rich search results.
- **Contact form**: powered by Resend, with Cloudflare Email Routing forwarding to Gmail.
- **Design system**: unified typographic and color token system, SVG theming via `currentColor` and CSS blend modes for consistent iconography across themes.
- **Deployment**: deployed on Cloudflare Pages via `@astrojs/cloudflare` (pinned to v12 for Astro v5 compatibility).

## 🎨 Design Philosophy

The visual identity leans into a chromatic aberration / magenta-cyan look, iterated closely against Figma designs. The goal is a portfolio that feels crafted rather than templated — every component (cards, icons, navigation) follows a shared token system rather than one-off styling.

## 📦 Deployment Notes

- Hosted on **Cloudflare Pages**.
- Uses `@astrojs/cloudflare` v12 (note: `output: 'hybrid'` was removed in Astro v5, so routing/rendering config was adjusted accordingly).
- Contact form email flow: Cloudflare Email Routing → Gmail, with "Send mail as" configured through Resend SMTP.

## 📄 License

This project is personal/portfolio code. Feel free to look around for inspiration, but please don't redistribute the design or content as your own.

## 📬 Contact

Built and maintained by **Damian Castro Andrich** — [ryomadev.com](https://ryomadev.com)

# Cambio test CI
