# Spec: Web Snake Game

## Problem Statement

用户想要一个网页版的贪吃蛇游戏，需要用户注册登录功能来保存和追踪游戏分数，并可以通过排行榜和其他玩家比较成绩。

## Solution

构建一个前后端分离的网页贪吃蛇游戏。前端使用 Vue 3 + Canvas 实现游戏渲染，后端使用 FastAPI 提供用户认证和分数管理 API，数据存储在 MySQL 中。用户注册登录后可以选择难度进行游戏，游戏结束后分数自动记录，首页展示排行榜。

## User Stories

1. As a visitor, I want to register an account with a username and password, so that I can save my game scores.
2. As a registered user, I want to log in with my credentials, so that I can access my personal data.
3. As a logged-in user, I want to select a difficulty level (low/medium/high) before starting, so that I can challenge myself at different skill levels.
4. As a player, I want the snake to move faster at higher difficulties, so that the challenge scales meaningfully.
5. As a player, I want obstacles to appear on the grid at medium and high difficulties, so that the game is more challenging.
6. As a player, I want obstacles to be placed randomly without overlapping the food, so that the game remains fair.
7. As a player, I want to control the snake using only keyboard arrow keys, so that I don't need to click on the page during gameplay.
8. As a player, I want the game to end when the snake hits a wall, itself, or an obstacle, so that the rules are clear.
9. As a player, I want my score to be automatically submitted when the game ends, so that I don't lose my record.
10. As a logged-in user, I want to view a leaderboard showing the top 10 scores across all users, so that I can see how I compare to others.
11. As a logged-in user, I want to view my own game history, so that I can track my progress over time.
12. As a developer, I want each feature developed on its own git branch and merged to main_dev after passing tests, so that the codebase stays stable.

## Implementation Decisions

### Architecture
- Frontend and backend are separate directories under `snake_project/frontend/` and `snake_project/backend/`
- Frontend communicates with backend via JSON HTTP API using Axios
- Authentication via JWT tokens, stored in localStorage on the frontend

### Database
- MySQL database with two tables: `users` and `scores`
- `users`: id (PK AUTO_INCREMENT), username (UNIQUE VARCHAR 50), password_hash (VARCHAR 255), created_at (DATETIME)
- `scores`: id (PK AUTO_INCREMENT), user_id (FK → users.id), score (INT), difficulty (ENUM: 'low','medium','high'), played_at (DATETIME)
- All game records are preserved (no overwrite)
- Passwords hashed with bcrypt

### API Endpoints
```
POST /api/auth/register     # { username, password } → { id, username }
POST /api/auth/login         # { username, password } → { access_token, token_type }
GET  /api/scores             # (auth required) → list of current user's scores
POST /api/scores             # (auth required) { score, difficulty } → created score record
GET  /api/scores/leaderboard # → top 10 scores with username and difficulty
```

### Game Mechanics
- Canvas rendering: 400×400px, grid cell size 10×10px → 40×40 grid
- Snake initial length: 3 cells, moving right
- Food: randomly placed, not on snake body or obstacles
- Difficulty settings:
  - Low: 200ms tick, 0 obstacles
  - Medium: 150ms tick, 3 obstacles
  - High: 100ms tick, 5 obstacles
- Game over conditions: hitting wall, self, or obstacle
- Each food eaten: +10 points
- Keyboard-only control (arrow keys), no mouse clicks during gameplay

### Frontend Routes
- `/` — Home page with login/register form
- `/game` — Game page (protected, requires login): Canvas game board, score display, difficulty selector, leaderboard panel
- Page navigation guards: unauthenticated users redirected to `/`

### Git Workflow
- `main` — production branch, merge only with user approval
- `main_dev` — development integration branch, feature branches merge here after tests pass
- `feature/<name>` — one branch per feature/ticket
- Tests must pass before merging feature branch to main_dev

## Testing Decisions

### What makes a good test
- Test external behavior only, not implementation details
- API tests: send HTTP requests and verify response status, body shape, and side effects in database
- Game logic tests: given initial state + input, assert final state — pure functions only
- Component tests: render component, interact, assert DOM output — don't test internal Vue state

### Modules to test
1. **Backend API** — pytest + httpx TestClient, test database fixture. Test all 5 endpoints for correct behavior, auth guards, and edge cases.
2. **Game core logic** (pure JS extraction from Vue) — vitest. Test snake movement, collision detection (wall/self/obstacle), food generation, scoring.
3. **Frontend components** — vitest + @vue/test-utils. Test AuthForm (validation, submit), Leaderboard (rendering), DifficultySelector.

### Prior art
- Greenfield project, no existing tests in the repo.

## Out of Scope

- Password reset / change password
- User profile editing
- Real-time multiplayer
- Mobile touch controls (swipe)
- Sound effects / music
- Advanced graphics (snake head direction, animations)
- Pause / resume during gameplay
- Levels / progressive difficulty within a single game
- Deployment to production server
- OAuth / third-party login

## Further Notes

- MySQL connection: user is running MySQL locally with root access. Backend should read credentials from environment variables, not hardcoded.
- GitHub repository: already created at `Ryanfate/my_-snake_project.git`
- The snake_project directory already exists with git initialized and remote configured.
