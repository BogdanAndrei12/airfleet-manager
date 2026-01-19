<template>
  <nav class="navbar">
    <div class="container">
      <router-link to="/" class="logo">
        AirFleet Manager
      </router-link>
      
      <ul class="nav-links">
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/aircraft">Aircraft</router-link></li>
        <li><router-link to="/flights">Flights</router-link></li>
        <li><router-link to="/login">Login</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<style scoped>
.navbar {
  background: #2c3e50;
  padding: 1rem 0;
  color: white;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #42b983;
}
</style>