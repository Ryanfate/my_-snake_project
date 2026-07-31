<template>
  <canvas
    ref="canvasRef"
    :width="canvasSize"
    :height="canvasSize"
    class="game-canvas"
  />
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  snake: Array,
  food: Object,
  obstacles: Array,
  gridSize: { type: Number, default: 40 },
});

const canvasRef = ref(null);
const canvasSize = 400;
const cellSize = canvasSize / props.gridSize; // 10px

function draw() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Clear
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Draw obstacles (gray)
  ctx.fillStyle = "#666";
  for (const obs of props.obstacles) {
    ctx.fillRect(obs.x * cellSize, obs.y * cellSize, cellSize, cellSize);
  }

  // Draw food (red)
  const f = props.food;
  if (f) {
    ctx.fillStyle = "#e53935";
    ctx.fillRect(f.x * cellSize, f.y * cellSize, cellSize, cellSize);
  }

  // Draw snake (green, head brighter)
  for (let i = 0; i < props.snake.length; i++) {
    const s = props.snake[i];
    ctx.fillStyle = i === 0 ? "#4caf50" : "#388e3c";
    ctx.fillRect(s.x * cellSize, s.y * cellSize, cellSize - 1, cellSize - 1);
  }
}

watch(() => [props.snake, props.food, props.obstacles], draw, { deep: true });

onMounted(draw);
</script>

<style scoped>
.game-canvas {
  border: 2px solid #333;
  border-radius: 4px;
  display: block;
}
</style>
