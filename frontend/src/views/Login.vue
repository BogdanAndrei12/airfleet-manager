<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2>Login</h2>
      
      <form @submit.prevent="handleLogin">
        <input 
          v-model="email" 
          type="email" 
          placeholder="Email" 
          required
        />
        
        <input 
          v-model="password" 
          type="password" 
          placeholder="Password" 
          required
        />
        
        <button type="submit">Login</button>
      </form>
      
      <p v-if="error" class="error">{{ error }}</p>
      
      <p>
        Don't have an account? 
        <router-link to="/register">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref('');
    const router = useRouter();
    
    const handleLogin = async () => {
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        router.push('/');
      } catch (err) {
        error.value = err.message;
      }
    };
    
    return { email, password, error, handleLogin };
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 0.75rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>