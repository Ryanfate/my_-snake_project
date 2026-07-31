<template>
  <div class="difficulty-selector">
    <h3>选择难度</h3>
    <div class="buttons">
      <button
        v-for="d in difficulties"
        :key="d.value"
        :class="{ active: modelValue === d.value }"
        :disabled="disabled"
        @click="$emit('update:modelValue', d.value)"
      >
        {{ d.label }}
        <span class="info">{{ d.info }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: String,
  disabled: Boolean,
});

defineEmits(["update:modelValue"]);

const difficulties = [
  { value: "low", label: "🟢 低", info: "200ms · 无障碍" },
  { value: "medium", label: "🟡 中", info: "150ms · 3障碍" },
  { value: "high", label: "🔴 高", info: "100ms · 5障碍" },
];
</script>

<style scoped>
.difficulty-selector {
  margin-bottom: 16px;
}
h3 {
  margin: 0 0 8px;
}
.buttons {
  display: flex;
  gap: 8px;
}
button {
  flex: 1;
  padding: 10px;
  border: 1px solid #444;
  border-radius: 4px;
  background: #1a1a1a;
  color: #fff;
  cursor: pointer;
  font-size: 14px;
}
button.active {
  border-color: #4caf50;
  background: #1b3a1b;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.info {
  display: block;
  font-size: 11px;
  color: #888;
  margin-top: 2px;
}
</style>
