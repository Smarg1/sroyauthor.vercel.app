# sroyauthor.vercel.app

![CI](https://github.com/Smarg1/sroyauthor.vercel.app/actions/workflows/ci.yml/badge.svg)

A modern web application built with Next.js 16, React 19, and TypeScript 5.  
The architecture prioritizes reliability, strict validation, and continuous security enforcement.  
Deployment operates through Vercel with edge-optimized features and integrated analytics.

## Overview

The project integrates:

- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Supabase for data operations and authentication
- Vercel analytics and performance tooling
- Tailwind with PostCSS and Autoprefixer
- Eslint 6 and prettier with best web code standards
- Automated CI, CodeQL analysis, and security scanning via GitHub Actions
- Dependabot automation for dependency governance

Strict linting rules enforce zero warnings.  
TypeScript operates in strict, no-emit validation mode.  
Node 24.12.0 is the target runtime across CI and production.

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
