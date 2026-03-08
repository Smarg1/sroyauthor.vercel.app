# Security Policy

## Supported Branches

Security updates apply **exclusively** to the `main` branch.

| Branch | Status                |
| ------ | --------------------- |
| main   | ✅ Actively supported |
| others | ❌ Unsupported        |

---

## Reporting a Vulnerability

Do not disclose security issues publicly.

Submit reports through GitHub’s private reporting channel:

**https://github.com/Smarg1/sroyauthor.vercel.app/security/advisories**

Responses occur privately, and all discussion remains confidential until resolution.

---

## Automated Security Enforcement

This repository uses multiple layers of automated protection:

### CodeQL Analysis

- Runs on every push, pull request, and scheduled interval
- Flags insecure patterns in JavaScript/TypeScript
- Blocks merging if critical issues are detected

### Dependency Review

- Evaluates dependency changes in pull requests
- Fails the PR on **any** severity vulnerability
- Prevents introduction of unsafe packages or versions

### Dependabot

- Weekly scans for outdated or vulnerable npm and GitHub Actions dependencies
- Automatically opens upgrade PRs for required patches

### CI Hardening

- Zero-warning enforcement for linting and TypeScript
- Build validation using Next.js strict mode
- Fail-fast pipeline to prevent flawed code from reaching deployment

---

## Security Expectations for Contributors

- Never commit environment variables, tokens, secrets, or private credentials.
- Validate external packages before adding them to `package.json`.
- Maintain compatibility with the enforced Node version and locked dependency set.
- Follow repository CI and security requirements; Pull Requests must pass all checks.

---

## Disclosure Policy

Any confirmed vulnerability will be:

1. Privately triaged
2. Patched in a dedicated security branch
3. Released to `main` with minimal exposure surface

Public disclosure occurs only after a fix is deployed and validated.

---

## Contact

Submit all security-related communication through GitHub’s private advisory system.  
No email or external channels are monitored for this project.
