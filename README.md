# [sroyauthor.vercel.app](https://sroyauthor.vercel.app)

A fast, minimal personal blogging and portfolio website built for a single author. Optimized for speed, scalability, and modern web architecture.

---

## Table of Contents
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [License](#license)
- [Contact](#contact)

---

## About
SroyAuthor is a single-author blogging platform and personal portfolio. It uses **Supabase** for database and image storage, **Redis** for caching, and leverages Next.js 15 with TypeScript and App Router.  

The project uses **Server-Side Rendering (SSR)** for faster initial page loads, **image optimization** with Next.js `<Image>` component, and optimized navigation via Next.js `<Link>` for client-side routing.

---

## Features
- Fully dynamic blog and portfolio pages
- Supabase database integration for posts and metadata
- Supabase Storage for images
- Redis caching for ultra-fast content retrieval
- **Server-Side Rendering (SSR)** for SEO and performance
- Next.js `<Image>` component for automatic image optimization
- Next.js `<Link>` for client-side navigation
- Responsive and minimal design (CSS-based, no Tailwind)
- Next.js 15 with App Router and TypeScript
- Webpack-based build (default Next.js build)
- Vercel deployment for instant updates

---

## Tech Stack
| Component        | Technology / Tool          |
|-----------------|---------------------------|
| Framework        | Next.js 15 (App Router)    |
| Language         | TypeScript                 |
| Styling          | CSS                        |
| Database         | Supabase (Postgres)        |
| Image Storage    | Supabase Storage           |
| Cache            | Upstash Redis              |
| Deployment       | Vercel                     |
| Build Tool       | Webpack (Next.js default)  |

---

## Project Structure
```
sroyauthor.vercel.app/
├─ app/                     ← Next.js App Router pages & layouts
├─ public/                  ← Static assets like icons & images
├─ components/              ← Reusable React components
├─ lib/                     ← Utilities & Supabase/Redis clients
├─ styles/                  ← Global CSS files
├─ package.json             ← Project metadata & scripts
├─ tsconfig.json            ← TypeScript configuration
├─ next.config.js           ← Next.js configuration
└─ vercel.json              ← Vercel deployment config
```
---

## Deployment
- Deployed on **Vercel** with automatic updates on push to main branch
- **Supabase** for database and storage
- **Upstash Redis** for caching frequently accessed data
- Server-side rendering (SSR) ensures fast page loads and SEO optimization
- Image optimization handled automatically via Next.js `<Image>` component

---

## License
This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

---

## Contact
Reach out via GitHub Issues.