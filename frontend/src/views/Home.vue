<template>
  <div class="home">
    <div class="hero">
      <h1>Welcome to AirFleet Manager</h1>
      <p>Manage your aircraft fleet and flight schedules</p>
    </div>
    
    <!-- Statistici principale -->
    <div class="stats">
      <div class="stat-card">
        <h3>Total Aircraft</h3>
        <p class="number">{{ totalAircraft }}</p>
        <p class="subtitle">{{ operationalAircraft }} operational</p>
      </div>
      
      <div class="stat-card">
        <h3>Total Flights</h3>
        <p class="number">{{ totalFlights }}</p>
        <p class="subtitle">Scheduled flights</p>
      </div>
    </div>
    
    <!-- Quick Actions -->
    <div class="quick-actions">
      <h2>Quick Actions</h2>
      <div class="action-cards">
        <router-link to="/aircraft" class="action-card">
          <div class="icon">✈️</div>
          <h3>Manage Aircraft</h3>
          <p>View and manage your aircraft fleet</p>
        </router-link>
        
        <router-link to="/flights" class="action-card">
          <div class="icon">🛫</div>
          <h3>Flight Schedule</h3>
          <p>Plan and track your flights</p>
        </router-link>
      </div>
    </div>
    
    <!-- Fleet Overview (opțional) -->
    <div v-if="topManufacturers.length > 0" class="fleet-overview">
      <h2>Fleet Overview</h2>
      <div class="overview-stats">
        <div class="overview-item" v-for="mfr in topManufacturers" :key="mfr.name">
          <span class="mfr-name">{{ mfr.name }}</span>
          <span class="mfr-count">{{ mfr.count }} aircraft</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useAircraftStore } from '../stores/aircraft';
import { useFlightsStore } from '../stores/flights';

export default {
  name: 'Home',
  setup() {
    const aircraftStore = useAircraftStore();
    const flightsStore = useFlightsStore();
    
    onMounted(() => {
      aircraftStore.fetchAircraft();
      flightsStore.fetchFlights();
    });
    
    const totalAircraft = computed(() => aircraftStore.aircraft.length);
    const totalFlights = computed(() => flightsStore.flights.length);
    
    const operationalAircraft = computed(() => {
      return aircraftStore.aircraft.filter(a => a.status?.operational).length;
    });
    
    const topManufacturers = computed(() => {
      const counts = {};
      aircraftStore.aircraft.forEach(a => {
        counts[a.manufacturer] = (counts[a.manufacturer] || 0) + 1;
      });
      
      return Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
    });
    
    return {
      totalAircraft,
      totalFlights,
      operationalAircraft,
      topManufacturers
    };
  }
}
</script>

<style scoped>
.home {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.hero {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero p {
  font-size: 1.2rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card h3 {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1rem;
}

.number {
  font-size: 3rem;
  font-weight: bold;
  color: #42b983;
  margin: 0;
}

.subtitle {
  margin-top: 0.5rem;
  color: #999;
  font-size: 0.9rem;
}

.quick-actions {
  margin-bottom: 3rem;
}

.quick-actions h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.action-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s, box-shadow 0.3s;
  text-align: center;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.action-card h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.action-card p {
  color: #666;
  font-size: 0.9rem;
}

.fleet-overview {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.fleet-overview h2 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.overview-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.overview-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.mfr-name {
  font-weight: 500;
  color: #2c3e50;
}

.mfr-count {
  color: #42b983;
  font-weight: bold;
}
</style>