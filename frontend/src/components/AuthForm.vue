<template>
  <div class="auth-form">
    <h2>{{ isLogin ? "登录" : "注册" }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">用户名</label>
        <input
          id="username"
          v-model="username"
          type="text"
          minlength="3"
          maxlength="50"
          required
          placeholder="至少3个字符"
        />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input
          id="password"
          v-model="password"
          type="password"
          minlength="6"
          required
          placeholder="至少6个字符"
        />
      </div>
      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit" :disabled="loading">
        {{ loading ? "请稍候..." : isLogin ? "登录" : "注册" }}
      </button>
    </form>
    <p class="toggle">
      {{ isLogin ? "还没有账号？" : "已有账号？" }}
      <a href="#" @click.prevent="toggleMode">{{ isLogin ? "去注册" : "去登录" }}</a>
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api";

const router = useRouter();
const isLogin = ref(true);
const username = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

function toggleMode() {
  isLogin.value = !isLogin.value;
  error.value = "";
}

async function handleSubmit() {
  error.value = "";
  loading.value = true;

  try {
    const endpoint = isLogin.value ? "/auth/login" : "/auth/register";
    const { data } = await api.post(endpoint, {
      username: username.value,
      password: password.value,
    });

    if (isLogin.value) {
      localStorage.setItem("token", data.access_token);
      router.push("/game");
    } else {
      // After registration, auto-login
      const { data: loginData } = await api.post("/auth/login", {
        username: username.value,
        password: password.value,
      });
      localStorage.setItem("token", loginData.access_token);
      router.push("/game");
    }
  } catch (err) {
    error.value = err.response?.data?.detail || "操作失败，请重试";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-form {
  max-width: 360px;
  margin: 60px auto;
  padding: 32px;
  border: 1px solid #333;
  border-radius: 8px;
  background: #1a1a1a;
}
h2 {
  text-align: center;
  margin-bottom: 24px;
}
.form-group {
  margin-bottom: 16px;
}
label {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
}
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #444;
  border-radius: 4px;
  background: #222;
  color: #fff;
  font-size: 16px;
  box-sizing: border-box;
}
button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background: #4caf50;
  color: white;
  font-size: 16px;
  cursor: pointer;
  margin-top: 8px;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.error {
  color: #f44336;
  font-size: 14px;
  margin: 8px 0 0;
}
.toggle {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
}
.toggle a {
  color: #4caf50;
}
</style>
