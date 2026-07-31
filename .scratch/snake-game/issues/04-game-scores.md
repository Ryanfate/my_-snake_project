# 04 — Game UI & Score system

**What to build:** Wire everything together — render the game on Canvas, add keyboard controls, implement the scores table and API, build the leaderboard, and create the full game page. After this ticket, a logged-in user can select difficulty, play a complete game, and see their score on the leaderboard.

**Blocked by:** #02 (User auth), #03 (Game engine)

**Status:** ready-for-agent

- [ ] Create `scores` table in MySQL via SQLAlchemy model (id, user_id FK→users, score, difficulty ENUM low/medium/high, played_at)
- [ ] Implement `POST /api/scores` (auth required) — accepts `{ score, difficulty }`, inserts record, returns created record
- [ ] Implement `GET /api/scores` (auth required) — returns current user's game records ordered by played_at DESC
- [ ] Implement `GET /api/scores/leaderboard` — returns top 10 scores with username and difficulty, ordered by score DESC
- [ ] Write pytest tests for all three score endpoints
- [ ] Create GameBoard.vue — renders game state on Canvas (400×400px): snake as green rectangles, food as red rectangle, obstacles as gray rectangles
- [ ] Create DifficultySelector.vue — three buttons (低/中/高), displays corresponding tick speed info
- [ ] Create LeaderBoard.vue — fetches and displays top 10 scores in a table (rank, username, score, difficulty)
- [ ] Build GameView.vue — orchestrates all game components: difficulty selection → start → game loop (setInterval with tick) → keyboard listener (arrow keys) → game over → auto-submit score → show leaderboard
- [ ] Keyboard controls: Arrow keys only, prevent default scroll, no mouse clicks during gameplay
- [ ] After game over: auto-call POST /api/scores with final score + difficulty, refresh leaderboard
- [ ] Push to `feature/game-scores` branch, verify all tests pass (pytest + vitest), merge to `main_dev`
