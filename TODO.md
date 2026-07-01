# Security hardening checklist - Peach & Dine

## Step 1: Baseline repo audit
- [x] Scan entire repo for secrets/keys/tokens/credentials in frontend + config
- [x] Identify auth/admin implementation currently in use (localStorage, passcode, etc.)
- [x] Run `npm audit` and note high/critical vulnerabilities

## Step 2: Add backend service
- [ ] Create `server/` with Express app

- [ ] Add secure config loading via env vars (`dotenv`) and `.env.example`
- [ ] Add security middleware: `helmet`, request size limits, generic error handler

## Step 3: Add database + models
- [ ] Choose persistence (SQLite for dev) and create schema/migrations
- [ ] Create tables for users, email verification tokens, password reset tokens, sessions/refresh tokens, reservations, reviews, messages, wastage, menu items

## Step 4: Authentication (server-side)
- [ ] Implement registration + email verification (tokens expire, single-use)
- [ ] Implement login with password hashing verification
- [ ] Implement logout
- [ ] Implement sessions or JWT with secure practices (expiry enforced, rotation, reject `alg=none`)
- [ ] Ensure auth secrets never reach frontend

## Step 5: Password reset flow end-to-end
- [ ] Generate cryptographically random reset token (hash stored in DB)
- [ ] Enforce 15-minute expiry and single-use
- [ ] Rate limit reset request + reset submission + verification endpoints
- [ ] Invalidate user sessions/old password immediately after successful reset

## Step 6: Authorization & IDOR prevention
- [ ] Add auth middleware attaching user to request
- [ ] Add ownership checks for every resource read/update/delete
- [ ] Add admin/role middleware at routing layer (not UI)

## Step 7: Rate limiting across app
- [ ] Add sliding window/token bucket rate limiting to all auth endpoints
- [ ] Add rate limiting to API endpoints (reservations, reviews, contact, admin CRUD)

## Step 8: CORS + security headers
- [ ] Implement explicit CORS allowlist with `credentials` settings
- [ ] Add HTTPS enforcement recommendation (behind proxy) and HSTS

## Step 9: Webhooks (if any routes exist/are introduced)
- [ ] Add HMAC verification + timestamp replay protection

## Step 10: File upload hardening (if feature exists/added)
- [ ] Server-side type validation, max size, random rename
- [ ] Store outside web root / object storage

## Step 11: Dependency audit + upgrades
- [ ] Run `npm audit` and upgrade high/critical packages
- [ ] Replace abandoned/unmaintained deps where applicable

## Step 12: Frontend refactor
- [ ] Remove localStorage-based auth and admin passcode
- [ ] Use backend endpoints + secure cookie/JWT handling
- [ ] Ensure no sensitive data in frontend bundle


