<template>
  <div class="game-page">
    <div class="game-main">
      <GameBoard :snake="snake" :food="food" :obstacles="obstacles" :gridSize="40" />

      <div v-if="!gameStarted && !gameOver" class="overlay">
        <DifficultySelector v-model="difficulty" :disabled="false" />
        <button class="start-btn" @click="startGame">开始游戏</button>
      </div>

      <div v-if="gameOver" class="overlay">
        <div class="game-over-box">
          <h2>游戏结束</h2>
          <p>得分: <strong>{{ score }}</strong></p>
          <p v-if="submitting">提交分数中...</p>
          <p v-if="submitError" class="error">{{ submitError }}</p>
          <button @click="resetGame">再来一局</button>
        </div>
      </div>
    </div>

    <div class="game-sidebar">
      <div class="info-panel">
        <p>得分: <strong>{{ score }}</strong></p>
        <p v-if="gameStarted && !gameOver">难度: {{ difficultyLabel }}</p>
        <button v-if="gameStarted && !gameOver" class="quit-btn" @click="endGame">结束游戏</button>
      </div>

      <LeaderBoard ref="leaderboardRef" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import GameBoard from "../components/GameBoard.vue";
import DifficultySelector from "../components/DifficultySelector.vue";
import LeaderBoard from "../components/LeaderBoard.vue";
import { createGame, tick, changeDirection } from "../game/engine";
import api from "../api";

const snake = ref([]);
const food = ref(null);
const obstacles = ref([]);
const score = ref(0);
const gameOver = ref(false);
const gameStarted = ref(false);
const difficulty = ref("low");
const submitting = ref(false);
const submitError = ref("");
const leaderboardRef = ref(null);

let gameState = null;
let timerId = null;
const DIFF_LABELS = { low: "低", medium: "中", high: "高" };
const difficultyLabel = () => DIFF_LABELS[difficulty.value] || difficulty.value;

function startGame() {
  gameState = createGame(difficulty.value);
  syncState();
  gameStarted.value = true;
  gameOver.value = false;
  submitError.value = "";

  timerId = setInterval(() => {
    gameState = tick(gameState);
    syncState();
    if (gameState.gameOver) {
      endGame();
    }
  }, gameState.speed);
}

function syncState() {
  snake.value = [...gameState.snake];
  food.value = { ...gameState.food };
  obstacles.value = gameState.obstacles.map((o) => ({ ...o }));
  score.value = gameState.score;
}

function endGame() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  gameOver.value = true;
  gameStarted.value = false;
  submitScore();
}

async function submitScore() {
  submitting.value = true;
  try {
    await api.post("/scores/", {
      score: score.value,
      difficulty: difficulty.value,
    });
    if (leaderboardRef.value) {
      leaderboardRef.value.fetchLeaderboard();
    }
  } catch {
    submitError.value = "分数提交失败";
  } finally {
    submitting.value = false;
  }
}

function resetGame() {
  gameOver.value = false;
  gameStarted.value = false;
  snake.value = [];
  food.value = null;
  obstacles.value = [];
  score.value = 0;
  submitError.value = "";
  gameState = null;
}

function handleKeydown(e) {
  if (!gameStarted.value || gameOver.value) return;

  const keyMap = {
    ArrowUp: "UP",
    ArrowDown: "DOWN",
    ArrowLeft: "LEFT",
    ArrowRight: "RIGHT",
  };

  const dir = keyMap[e.key];
  if (dir) {
    e.preventDefault(); // prevent page scrolling
    gameState = changeDirection(gameState, dir);
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  if (timerId) clearInterval(timerId);
});
</script>

<style scoped>
.game-page {
  display: flex;
  gap: 24px;
  padding: 24px;
  max-width: 760px;
  margin: 0 auto;
  align-items: flex-start;
}

.game-main {
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 400px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.82);
  border-radius: 4px;
}

.game-over-box {
  text-align: center;
  padding: 24px;
}

.game-over-box h2 {
  margin: 0 0 12px;
  color: #f44336;
}

.start-btn {
  margin-top: 12px;
  padding: 12px 48px;
  font-size: 18px;
  border: none;
  border-radius: 6px;
  background: #4caf50;
  color: white;
  cursor: pointer;
}

.game-sidebar {
  min-width: 200px;
}

.info-panel {
  background: #1a1a1a;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #333;
  margin-bottom: 16px;
}

.info-panel p {
  margin: 0 0 8px;
}

.quit-btn {
  margin-top: 4px;
  padding: 6px 16px;
  border: 1px solid #f44336;
  border-radius: 4px;
  background: transparent;
  color: #f44336;
  cursor: pointer;
  font-size: 13px;
}

.error {
  color: #f44336;
  font-size: 13px;
}

.game-over-box button {
  margin-top: 12px;
  padding: 10px 32px;
  border: none;
  border-radius: 4px;
  background: #4caf50;
  color: white;
  font-size: 16px;
  cursor: pointer;
}
</style>
