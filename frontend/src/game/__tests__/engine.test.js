import { describe, expect, it } from "vitest";
import { changeDirection, createGame, getDifficultyConfig, tick } from "../engine";

describe("createGame", () => {
  it("creates a game with initial snake of length 3", () => {
    const state = createGame("low");
    expect(state.snake).toHaveLength(3);
  });

  it("starts heading RIGHT", () => {
    const state = createGame("low");
    expect(state.direction).toBe("RIGHT");
  });

  it("starts with score 0", () => {
    const state = createGame("low");
    expect(state.score).toBe(0);
  });

  it("starts with gameOver false", () => {
    const state = createGame("low");
    expect(state.gameOver).toBe(false);
  });

  it("places food within grid bounds", () => {
    const state = createGame("low");
    expect(state.food.x).toBeGreaterThanOrEqual(0);
    expect(state.food.x).toBeLessThan(40);
    expect(state.food.y).toBeGreaterThanOrEqual(0);
    expect(state.food.y).toBeLessThan(40);
  });

  it("does not place food on the snake", () => {
    for (let i = 0; i < 50; i++) {
      const state = createGame("low");
      const onSnake = state.snake.some(
        (s) => s.x === state.food.x && s.y === state.food.y
      );
      expect(onSnake).toBe(false);
    }
  });

  it("creates 0 obstacles for low difficulty", () => {
    const state = createGame("low");
    expect(state.obstacles).toHaveLength(0);
  });

  it("creates 3 obstacles for medium difficulty", () => {
    const state = createGame("medium");
    expect(state.obstacles).toHaveLength(3);
  });

  it("creates 5 obstacles for high difficulty", () => {
    const state = createGame("high");
    expect(state.obstacles).toHaveLength(5);
  });

  it("obstacles do not overlap food", () => {
    for (let i = 0; i < 20; i++) {
      const state = createGame("high");
      for (const obs of state.obstacles) {
        expect(obs.x === state.food.x && obs.y === state.food.y).toBe(false);
      }
    }
  });

  it("sets correct speed per difficulty", () => {
    expect(createGame("low").speed).toBe(200);
    expect(createGame("medium").speed).toBe(150);
    expect(createGame("high").speed).toBe(100);
  });
});

describe("tick", () => {
  it("moves the snake one step in the current direction", () => {
    const state = createGame("low");
    const beforeHead = { ...state.snake[0] };
    const after = tick(state);
    // Snake moves RIGHT by default
    expect(after.snake[0].x).toBe(beforeHead.x + 1);
    expect(after.snake[0].y).toBe(beforeHead.y);
  });

  it("keeps same length when not eating", () => {
    const state = createGame("low");
    const after = tick(state);
    expect(after.snake).toHaveLength(3);
  });

  it("does not mutate the original state", () => {
    const state = createGame("low");
    const snapshot = JSON.stringify(state);
    tick(state);
    expect(JSON.stringify(state)).toBe(snapshot);
  });

  it("score increments by 10 when eating food", () => {
    const state = createGame("low");
    // Place food right in front of the snake head
    const head = state.snake[0];
    const modified = {
      ...state,
      food: { x: head.x + 1, y: head.y },
      obstacles: [],
    };
    const after = tick(modified);
    expect(after.score).toBe(10);
  });

  it("snake grows when eating food", () => {
    const state = createGame("low");
    const head = state.snake[0];
    const modified = {
      ...state,
      food: { x: head.x + 1, y: head.y },
      obstacles: [],
    };
    const after = tick(modified);
    expect(after.snake).toHaveLength(4);
  });
});

describe("collision detection", () => {
  it("game over when hitting left wall", () => {
    const state = createGame("low");
    // Force snake to left wall
    const s = { ...state, snake: [{ x: 0, y: 10 }], direction: "LEFT" };
    expect(tick(s).gameOver).toBe(true);
  });

  it("game over when hitting top wall", () => {
    const state = createGame("low");
    const s = { ...state, snake: [{ x: 10, y: 0 }], direction: "UP" };
    expect(tick(s).gameOver).toBe(true);
  });

  it("game over when hitting right wall", () => {
    const state = createGame("low");
    const s = { ...state, snake: [{ x: 39, y: 10 }], direction: "RIGHT" };
    expect(tick(s).gameOver).toBe(true);
  });

  it("game over when hitting bottom wall", () => {
    const state = createGame("low");
    const s = { ...state, snake: [{ x: 10, y: 39 }], direction: "DOWN" };
    expect(tick(s).gameOver).toBe(true);
  });

  it("game over when hitting self", () => {
    // Create a snake that is about to hit its own body
    const snake = [
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 6, y: 6 },
      { x: 5, y: 6 },
      { x: 4, y: 6 },
    ];
    const state = {
      ...createGame("low"),
      snake,
      direction: "DOWN",
      obstacles: [],
    };
    // Head at (5,5), moving DOWN to (5,6) which is body[2]
    expect(tick(state).gameOver).toBe(true);
  });

  it("game over when hitting obstacle", () => {
    const state = createGame("low");
    const s = {
      ...state,
      snake: [{ x: 5, y: 5 }],
      direction: "RIGHT",
      obstacles: [{ x: 6, y: 5 }],
    };
    expect(tick(s).gameOver).toBe(true);
  });

  it("tick does nothing if game is already over", () => {
    const state = { ...createGame("low"), gameOver: true, score: 50 };
    const after = tick(state);
    expect(after.gameOver).toBe(true);
    expect(after.score).toBe(50); // unchanged
  });
});

describe("changeDirection", () => {
  it("changes direction", () => {
    const state = createGame("low");
    const after = changeDirection(state, "DOWN");
    expect(after.direction).toBe("DOWN");
  });

  it("ignores 180° reversal from UP to DOWN", () => {
    const state = { ...createGame("low"), direction: "UP" };
    const after = changeDirection(state, "DOWN");
    expect(after.direction).toBe("UP");
  });

  it("ignores 180° reversal from LEFT to RIGHT", () => {
    const state = { ...createGame("low"), direction: "LEFT" };
    const after = changeDirection(state, "RIGHT");
    expect(after.direction).toBe("LEFT");
  });

  it("allows UP to LEFT", () => {
    const state = { ...createGame("low"), direction: "UP" };
    expect(changeDirection(state, "LEFT").direction).toBe("LEFT");
  });
});

describe("getDifficultyConfig", () => {
  it("returns correct config for each difficulty", () => {
    expect(getDifficultyConfig("low")).toEqual({ speed: 200, obstacles: 0 });
    expect(getDifficultyConfig("medium")).toEqual({ speed: 150, obstacles: 3 });
    expect(getDifficultyConfig("high")).toEqual({ speed: 100, obstacles: 5 });
  });
});
