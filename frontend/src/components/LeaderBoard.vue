<template>
  <div class="leaderboard">
    <h3>🏆 排行榜 Top 10</h3>
    <table v-if="entries.length">
      <thead>
        <tr>
          <th>#</th>
          <th>玩家</th>
          <th>分数</th>
          <th>难度</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="entry in entries" :key="entry.rank">
          <td>{{ entry.rank }}</td>
          <td>{{ entry.username }}</td>
          <td>{{ entry.score }}</td>
          <td>{{ difficultyLabel(entry.difficulty) }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else class="empty">暂无记录</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import api from "../api";

const entries = ref([]);
const error = ref("");

const DIFF_LABELS = { low: "低", medium: "中", high: "高" };
function difficultyLabel(d) {
  return DIFF_LABELS[d] || d;
}

async function fetchLeaderboard() {
  try {
    const { data } = await api.get("/scores/leaderboard");
    entries.value = data;
  } catch {
    error.value = "加载排行榜失败";
  }
}

defineExpose({ fetchLeaderboard });

onMounted(fetchLeaderboard);
</script>

<style scoped>
.leaderboard {
  margin-top: 16px;
}
h3 {
  margin: 0 0 8px;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
th,
td {
  padding: 6px 8px;
  text-align: left;
  border-bottom: 1px solid #333;
}
th {
  color: #888;
}
.empty {
  color: #666;
  font-size: 14px;
}
.error {
  color: #f44336;
  font-size: 13px;
}
</style>
