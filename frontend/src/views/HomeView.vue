<template>
  <div class="home">
    <h1>🐍 贪吃蛇</h1>
    <AuthForm />
  </div>
</template>

<script setup>
import AuthForm from "../components/AuthForm.vue";
</script>

<style scoped>
.home {
  text-align: center;
  padding-top: 20px;
}
h1 {
  font-size: 36px;
  margin-bottom: 8px;
}
</style>
