# 01 — Project scaffolding

**What to build:** Initialize the complete project skeleton — backend FastAPI app, frontend Vue 3 + Vite app, MySQL database connection, and git branch setup. After this ticket, both `npm run dev` (frontend) and `uvicorn main:app` (backend) should start without errors, and the project is ready for feature development.

**Blocked by:** None — can start immediately.

**Status:** ready-for-agent

- [ ] Create `backend/` directory with FastAPI entry point (`main.py`), `requirements.txt` with fastapi, uvicorn, sqlalchemy, pymysql, passlib[bcrypt], python-jose, pydantic
- [ ] Create `database.py` with SQLAlchemy engine connecting to local MySQL, reading credentials from environment variables (MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE)
- [ ] Create empty `routers/` module and register a health check route `GET /api/health` returning `{ "status": "ok" }`
- [ ] Create `frontend/` directory via `npm create vite@latest frontend -- --template vue`, install axios + vue-router
- [ ] Configure Vite proxy so `/api/*` forwards to the FastAPI dev server
- [ ] Create `main_dev` branch and push to GitHub
- [ ] Verify: `uvicorn backend.main:app --reload` starts, `cd frontend && npm run dev` starts, visiting `/api/health` returns ok
