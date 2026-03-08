# sroyauthor.vercel.app

![CI](https://github.com/Smarg1/sroyauthor.vercel.app/actions/workflows/ci.yml/badge.svg)
![CodeQL](https://github.com/Smarg1/sroyauthor.vercel.app/actions/workflows/codeql.yml/badge.svg)

A modern web application built with Next.js 16, React 19, and TypeScript 5.  
The architecture prioritizes reliability, strict validation, and continuous security enforcement.  
Deployment operates through Vercel with edge-optimized features and integrated analytics.

## Overview

The project integrates:

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Supabase for data operations and authentication
- Upstash Redis for caching and rate-limiting
- Vercel analytics and performance tooling
- PostCSS with Autoprefixer
- Automated CI, CodeQL analysis, and security scanning via GitHub Actions
- Dependabot automation for dependency governance

Strict linting rules enforce zero warnings.  
TypeScript operates in strict, no-emit validation mode.  
Node 24.12.0 is the target runtime across CI and production.

## Structure

```

/
├─ src/
│  ├─ app/              # Routing and server components
│  ├─ components/       # UI systems and shared elements
│  ├─ lib/              # Internal utilities and logic modules
│  └─ styles/           # Styling and global definitions
│
├─ public/              # Static assets
├─ .github/             # CI, CodeQL, security, Dependabot configs
├─ package.json
├─ tsconfig.json
└─ next.config.js

```

## Technology Notes

The codebase uses:

- ESLint 9 with warnings treated as errors
- TypeScript strict mode
- Deterministic dependency installation
- Automated vulnerability detection
- Edge-optimized production runtime

## Security & Quality

- CodeQL scanning for JavaScript/TypeScript
- Dependency Review enforcement on any severity issue
- Scheduled and PR-based security checks
- CI enforcing lint, type, and build correctness before deployment
- Dependabot updates for npm packages and GitHub Actions

## License

Proprietary.  
All rights reserved.
