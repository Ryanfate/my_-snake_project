# 03 — Game core engine

**What to build:** A pure JavaScript game engine module that handles all snake game logic — snake movement, food placement, obstacle generation, collision detection, and scoring. This module has zero DOM or framework dependencies and is fully testable. No visual rendering yet.

**Blocked by:** #01 — Project scaffolding

**Status:** ready-for-agent

- [ ] Create `frontend/src/game/engine.js` as a pure module exporting a `createGame(initialState)` factory function
- [ ] Game state: `{ snake: [{x, y}], direction: 'RIGHT', food: {x, y}, obstacles: [{x, y}], score: number, gameOver: boolean, difficulty: 'low'|'medium'|'high', gridSize: 40 }`
- [ ] Implement `tick()` — moves snake one step in current direction (head added, tail removed unless eating), checks all collisions, returns new state
- [ ] Implement `changeDirection(dir)` — ignores 180° reversal (e.g., going RIGHT cannot switch to LEFT)
- [ ] Implement collision detection: hitting wall (x<0 or x≥40 or y<0 or y≥40), hitting self (head enters own body), hitting any obstacle
- [ ] Implement food generation: random position not on snake body or obstacles
- [ ] Implement obstacle generation: N random positions (5 for high, 3 for medium, 0 for low), not overlapping food or snake
- [ ] Implement `startGame(difficulty)` — initializes state with difficulty settings (speed: low=200ms, medium=150ms, high=100ms; obstacles: low=0, medium=3, high=5)
- [ ] Each food eaten: +10 points, snake grows by 1
- [ ] Write vitest unit tests covering: tick movement, direction change cannot reverse, wall collision, self collision, obstacle collision, food placement avoids snake/obstacles, obstacle count per difficulty, score increment on eating
- [ ] Push to `feature/game-engine` branch, verify tests pass, merge to `main_dev`
