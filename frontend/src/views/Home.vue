<template>
  <div class="home">
    <h1>Welcome to AirFleet Manager</h1>
    <p>Manage your aircraft fleet and flight schedules</p>
    
    <div class="stats">
      <div class="stat-card">
        <h3>Total Aircraft</h3>
        <p class="number">0</p>
      </div>
      <div class="stat-card">
        <h3>Total Flights</h3>
        <p class="number">0</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.stat-card {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}

.number {
  font-size: 3rem;
  font-weight: bold;
  color: #42b983;
  margin: 0;
}
</style>