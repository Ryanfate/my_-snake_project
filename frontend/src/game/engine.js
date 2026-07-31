const GRID_SIZE = 40;

const DIFFICULTY_CONFIG = {
  low: { speed: 200, obstacles: 0 },
  medium: { speed: 150, obstacles: 3 },
  high: { speed: 100, obstacles: 5 },
};

const DIRECTION_VECTORS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const OPPOSITE_DIRECTIONS = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

/**
 * Get a random integer in [0, max).
 */
function randomInt(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Check if a position collides with any cell in the given array.
 */
function collidesWith(pos, cells) {
  return cells.some((c) => c.x === pos.x && c.y === pos.y);
}

/**
 * Generate a random grid position not occupied by given cells.
 */
function randomFreeCell(occupiedCells) {
  let cell;
  let attempts = 0;
  do {
    cell = { x: randomInt(GRID_SIZE), y: randomInt(GRID_SIZE) };
    attempts++;
    if (attempts > 1000) break; // fallback — grid nearly full
  } while (collidesWith(cell, occupiedCells));
  return cell;
}

/**
 * Create the initial game state for the given difficulty.
 */
export function createGame(difficulty) {
  const config = DIFFICULTY_CONFIG[difficulty];
  const center = Math.floor(GRID_SIZE / 2);

  // Snake starts at center, heading right, length 3
  const snake = [
    { x: center, y: center },
    { x: center - 1, y: center },
    { x: center - 2, y: center },
  ];

  // Place food not on the snake
  const food = randomFreeCell(snake);

  // Place obstacles not on snake or food
  const obstacles = [];
  for (let i = 0; i < config.obstacles; i++) {
    const occupied = [...snake, food, ...obstacles];
    const obs = randomFreeCell(occupied);
    obstacles.push(obs);
  }

  return {
    snake,
    direction: "RIGHT",
    food,
    obstacles,
    score: 0,
    gameOver: false,
    difficulty,
    gridSize: GRID_SIZE,
    speed: config.speed,
  };
}

/**
 * Move the snake forward one tick. Returns a new state object.
 * Does NOT mutate the original state.
 */
export function tick(state) {
  if (state.gameOver) return { ...state };

  const dir = DIRECTION_VECTORS[state.direction];
  const head = state.snake[0];
  const newHead = { x: head.x + dir.x, y: head.y + dir.y };

  // 1. Wall collision
  if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
    return { ...state, gameOver: true };
  }

  // 2. Self collision (check against current body, excluding the tail unless eating)
  // The tail will be removed unless we eat food, so exclude it from self-collision check.
  const bodyWithoutTail = state.snake.slice(0, -1);
  if (collidesWith(newHead, bodyWithoutTail)) {
    return { ...state, gameOver: true };
  }

  // 3. Obstacle collision
  if (collidesWith(newHead, state.obstacles)) {
    return { ...state, gameOver: true };
  }

  // 4. Check if eating food
  const eating = newHead.x === state.food.x && newHead.y === state.food.y;

  const newSnake = [newHead, ...state.snake];
  if (!eating) {
    newSnake.pop(); // remove tail
  }

  const newState = {
    ...state,
    snake: newSnake,
    score: eating ? state.score + 10 : state.score,
  };

  // Place new food after eating
  if (eating) {
    newState.food = randomFreeCell([...newSnake, ...state.obstacles]);
  }

  return newState;
}

/**
 * Change snake direction. Ignores 180° reversal.
 * Returns a new state object.
 */
export function changeDirection(state, newDirection) {
  if (OPPOSITE_DIRECTIONS[newDirection] === state.direction) {
    return state; // ignore reversal
  }
  return { ...state, direction: newDirection };
}

/**
 * Get the difficulty config for a given difficulty level.
 */
export function getDifficultyConfig(difficulty) {
  return DIFFICULTY_CONFIG[difficulty];
}

/**
 * Get all available difficulty levels.
 */
export function getDifficulties() {
  return Object.keys(DIFFICULTY_CONFIG);
}
