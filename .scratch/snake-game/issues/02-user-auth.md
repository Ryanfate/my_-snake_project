# 02 — User authentication

**What to build:** Complete user registration and login flow. A visitor can register with username + password, log in to receive a JWT token, and the frontend stores the token for authenticated requests. Protected pages redirect unauthenticated users to login.

**Blocked by:** #01 — Project scaffolding

**Status:** resolved

- [ ] Create `users` table in MySQL via SQLAlchemy model (id, username UNIQUE, password_hash, created_at)
- [ ] Implement `POST /api/auth/register` — validates username uniqueness, hashes password with bcrypt, returns user id + username
- [ ] Implement `POST /api/auth/login` — verifies credentials, returns JWT access token with user_id + username claims, 7-day expiry
- [ ] Implement JWT dependency for protected routes — extracts and verifies Bearer token from Authorization header
- [ ] Create AuthForm.vue component with login/register toggle, form validation (non-empty, minimum 3 chars username, minimum 6 chars password)
- [ ] Create HomeView.vue as the home page displaying AuthForm
- [ ] Create api/index.js with Axios instance, base URL pointing to backend, interceptor to attach JWT from localStorage
- [ ] Set up Vue Router with `/` (home, public) and `/game` (protected, placeholder for now), navigation guard redirecting to `/` if no token
- [ ] Write pytest tests for both auth endpoints (success + validation errors + duplicate username)
- [ ] Push to `feature/user-auth` branch, verify tests pass, merge to `main_dev`
