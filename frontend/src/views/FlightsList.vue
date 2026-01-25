<template>
  <div class="flights-page">
    <div class="header">
      <h1>Flight Schedule</h1>
      <button @click="showForm = true" class="btn-primary">Add Flight</button>
    </div>
    
    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else-if="flightsList.length === 0" class="empty">
      No flights scheduled. Add your first flight!
    </div>
    
    <div v-else class="flights-list">
      <table>
        <thead>
          <tr>
            <th>Flight Number</th>
            <th>Aircraft</th>
            <th>Route</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="flight in flightsList" :key="flight.id">
            <td>{{ flight.flightNumber }}</td>
            <td>{{ getAircraftName(flight.aircraftId) }}</td>
            <td>{{ flight.route?.departure?.iataCode }} → {{ flight.route?.arrival?.iataCode }}</td>
            <td><span class="status-badge">{{ flight.status }}</span></td>
            <td>
              <button @click="viewFlightDetails(flight)" class="btn-view">View</button>
              <button @click="deleteFlight(flight.id)" class="btn-delete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Modal CREATE FLIGHT -->
    <div v-if="showForm" class="modal">
      <div class="modal-content">
        <h2>Add New Flight</h2>
        <form @submit.prevent="handleCreate">
          <input v-model="form.flightNumber" placeholder="Flight Number (e.g., RO453)" required />
          
          <select v-model="form.aircraftId" required>
            <option value="" disabled>Select Aircraft</option>
            <option v-for="aircraft in availableAircraft" :key="aircraft.id" :value="aircraft.id">
              {{ aircraft.registration }} - {{ aircraft.model }} ({{ aircraft.airline?.name }})
            </option>
          </select>
          
          <input v-model="form.departureCode" placeholder="Departure (e.g., OTP)" required />
          <input v-model="form.arrivalCode" placeholder="Arrival (e.g., LHR)" required />
          
          <select v-model="form.status" required>
            <option value="Scheduled">Scheduled</option>
            <option value="Boarding">Boarding</option>
            <option value="Departed">Departed</option>
            <option value="Landed">Landed</option>
          </select>
          
          <div class="form-actions">
            <button type="submit" class="btn-primary">Create</button>
            <button type="button" @click="closeForm" class="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal FLIGHT DETAILS -->
    <div v-if="selectedFlight" class="modal">
      <div class="modal-content modal-details">
        <div class="details-header">
          <h2>Flight {{ selectedFlight.flightNumber }}</h2>
          <button @click="selectedFlight = null" class="close-btn">&times;</button>
        </div>
        
        <div class="details-body">
          <div class="detail-section">
            <h3>Flight Information</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">Flight Number:</span>
                <span class="value">{{ selectedFlight.flightNumber }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Aircraft:</span>
                <span class="value">{{ getAircraftName(selectedFlight.aircraftId) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Status:</span>
                <span class="value status-badge">{{ selectedFlight.status }}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section" v-if="selectedFlight.route">
            <h3>Route Details</h3>
            <div class="detail-grid">
              <div class="detail-item" v-if="selectedFlight.route.departure">
                <span class="label">Departure:</span>
                <span class="value">{{ selectedFlight.route.departure.iataCode || 'N/A' }}</span>
              </div>
              <div class="detail-item" v-if="selectedFlight.route.arrival">
                <span class="label">Arrival:</span>
                <span class="value">{{ selectedFlight.route.arrival.iataCode || 'N/A' }}</span>
              </div>
              <div class="detail-item" v-if="selectedFlight.route.distance">
                <span class="label">Distance:</span>
                <span class="value">{{ selectedFlight.route.distance }}</span>
              </div>
              <div class="detail-item" v-if="selectedFlight.route.duration">
                <span class="label">Duration:</span>
                <span class="value">{{ selectedFlight.route.duration }}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section" v-if="selectedFlight.aircraftSnapshot">
            <h3>Aircraft Information</h3>
            <div class="detail-grid">
              <div class="detail-item" v-if="selectedFlight.aircraftSnapshot.registration">
                <span class="label">Registration:</span>
                <span class="value">{{ selectedFlight.aircraftSnapshot.registration }}</span>
              </div>
              <div class="detail-item" v-if="selectedFlight.aircraftSnapshot.model">
                <span class="label">Model:</span>
                <span class="value">{{ selectedFlight.aircraftSnapshot.model }}</span>
              </div>
              <div class="detail-item" v-if="selectedFlight.aircraftSnapshot.airline">
                <span class="label">Airline:</span>
                <span class="value">{{ selectedFlight.aircraftSnapshot.airline }}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h3>Associated Aircraft</h3>
            <p class="info-text">View full details of the aircraft operating this flight</p>
            <button @click="viewAircraftDetails(selectedFlight.aircraftId)" class="btn-link">
              🔍 View Aircraft Details
            </button>
          </div>
          
          <div class="detail-section" v-if="selectedFlight.timestamps">
            <h3>Metadata</h3>
            <div class="detail-grid">
              <div class="detail-item" v-if="selectedFlight.timestamps.created">
                <span class="label">Created:</span>
                <span class="value">{{ formatDate(selectedFlight.timestamps.created) }}</span>
              </div>
              <div class="detail-item" v-if="selectedFlight.timestamps.updated">
                <span class="label">Last Updated:</span>
                <span class="value">{{ formatDate(selectedFlight.timestamps.updated) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="details-footer">
          <button @click="selectedFlight = null" class="btn-secondary">Close</button>
        </div>
      </div>
    </div>
    
    <!-- Modal AIRCRAFT DETAILS (din flight) -->
    <div v-if="selectedAircraft" class="modal">
      <div class="modal-content modal-details">
        <div class="details-header">
          <h2>{{ selectedAircraft.registration }}</h2>
          <button @click="selectedAircraft = null" class="close-btn">&times;</button>
        </div>
        
        <div class="details-body">
          <div class="detail-section">
            <h3>Basic Information</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">Registration:</span>
                <span class="value">{{ selectedAircraft.registration }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Model:</span>
                <span class="value">{{ selectedAircraft.model }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Manufacturer:</span>
                <span class="value">{{ selectedAircraft.manufacturer }}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section" v-if="selectedAircraft.airline">
            <h3>Airline</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">Name:</span>
                <span class="value">{{ selectedAircraft.airline.name }}</span>
              </div>
              <div class="detail-item" v-if="selectedAircraft.airline.iataCode">
                <span class="label">IATA Code:</span>
                <span class="value">{{ selectedAircraft.airline.iataCode }}</span>
              </div>
              <div class="detail-item" v-if="selectedAircraft.airline.country">
                <span class="label">Country:</span>
                <span class="value">{{ selectedAircraft.airline.country }}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section" v-if="selectedAircraft.specifications">
            <h3>Specifications</h3>
            <div class="detail-grid">
              <div class="detail-item" v-if="selectedAircraft.specifications.passengers">
                <span class="label">Passengers:</span>
                <span class="value">{{ selectedAircraft.specifications.passengers }}</span>
              </div>
              <div class="detail-item" v-if="selectedAircraft.specifications.maxSpeed">
                <span class="label">Max Speed:</span>
                <span class="value">{{ selectedAircraft.specifications.maxSpeed }}</span>
              </div>
              <div class="detail-item" v-if="selectedAircraft.specifications.range">
                <span class="label">Range:</span>
                <span class="value">{{ selectedAircraft.specifications.range }}</span>
              </div>
              <div class="detail-item" v-if="selectedAircraft.specifications.engines">
                <span class="label">Engines:</span>
                <span class="value">{{ selectedAircraft.specifications.engines }}</span>
              </div>
              <div class="detail-item" v-if="selectedAircraft.specifications.wingspan">
                <span class="label">Wingspan:</span>
                <span class="value">{{ selectedAircraft.specifications.wingspan }}</span>
              </div>
              <div class="detail-item" v-if="selectedAircraft.specifications.length">
                <span class="label">Length:</span>
                <span class="value">{{ selectedAircraft.specifications.length }}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section" v-if="selectedAircraft.status">
            <h3>Status</h3>
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">Operational:</span>
                <span :class="selectedAircraft.status.operational ? 'value status-yes' : 'value status-no'">
                  {{ selectedAircraft.status.operational ? 'Yes' : 'No' }}
                </span>
              </div>
              <div class="detail-item" v-if="selectedAircraft.status.location">
                <span class="label">Location:</span>
                <span class="value">{{ selectedAircraft.status.location }}</span>
              </div>
              <div class="detail-item" v-if="selectedAircraft.status.flightHours">
                <span class="label">Flight Hours:</span>
                <span class="value">{{ selectedAircraft.status.flightHours.toLocaleString() }} hrs</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="details-footer">
          <button @click="selectedAircraft = null" class="btn-secondary">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useFlightsStore } from '../stores/flights';
import { useAircraftStore } from '../stores/aircraft';
import api from '../services/api';

export default {
  name: 'FlightsList',
  setup() {
    const store = useFlightsStore();
    const aircraftStore = useAircraftStore();
    const showForm = ref(false);
    const selectedFlight = ref(null);
    const selectedAircraft = ref(null);
    const form = ref({
      flightNumber: '',
      aircraftId: '',
      departureCode: '',
      arrivalCode: '',
      status: 'Scheduled'
    });
    
    onMounted(() => {
      store.fetchFlights();
      aircraftStore.fetchAircraft();
    });
    
    const handleCreate = async () => {
      if (!form.value.flightNumber.trim()) {
        alert('Flight number is required');
        return;
      }
      
      if (!form.value.aircraftId) {
        alert('Please select an aircraft');
        return;
      }
      
      if (!form.value.departureCode.trim() || !form.value.arrivalCode.trim()) {
        alert('Departure and arrival codes are required');
        return;
      }
      
      if (form.value.departureCode.length !== 3 || form.value.arrivalCode.length !== 3) {
        alert('Airport codes must be 3 characters (e.g., OTP, LHR)');
        return;
      }
      
      try {
        await store.createFlight({
          flightNumber: form.value.flightNumber,
          aircraftId: form.value.aircraftId,
          route: {
            departure: { iataCode: form.value.departureCode },
            arrival: { iataCode: form.value.arrivalCode }
          },
          status: form.value.status,
          schedule: {}
        });
        closeForm();
      } catch (error) {
        const errorMsg = error.response?.data?.error || error.message;
        alert('Error: ' + errorMsg);
      }
    };
    
    const deleteFlight = async (id) => {
      if (confirm('Are you sure you want to delete this flight?')) {
        try {
          await store.deleteFlight(id);
        } catch (error) {
          alert('Error: ' + error.message);
        }
      }
    };
    
    const viewFlightDetails = (flight) => {
      selectedFlight.value = flight;
    };
    
    const viewAircraftDetails = async (aircraftId) => {
      try {
        const response = await api.get(`/api/aircraft/${aircraftId}`);
        selectedAircraft.value = response.data.data;
      } catch (error) {
        alert('Could not load aircraft details: ' + error.message);
      }
    };
    
    const getAircraftName = (aircraftId) => {
      const aircraft = aircraftStore.aircraft.find(a => a.id === aircraftId);
      return aircraft ? `${aircraft.registration} (${aircraft.model})` : aircraftId.substring(0, 8) + '...';
    };
    
    const closeForm = () => {
      showForm.value = false;
      form.value = {
        flightNumber: '',
        aircraftId: '',
        departureCode: '',
        arrivalCode: '',
        status: 'Scheduled'
      };
    };
    
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    return {
      flightsList: computed(() => store.flights),
      loading: computed(() => store.loading),
      error: computed(() => store.error),
      availableAircraft: computed(() => aircraftStore.aircraft),
      showForm,
      selectedFlight,
      selectedAircraft,
      form,
      handleCreate,
      deleteFlight,
      viewFlightDetails,
      viewAircraftDetails,
      getAircraftName,
      closeForm,
      formatDate
    };
  }
}
</script>

<style scoped>
.flights-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

table {
  width: 100%;
  background: white;
  border-collapse: collapse;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

th, td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background: #f8f9fa;
  font-weight: bold;
}

.status-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.btn-primary {
  background: #42b983;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-view {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}

.btn-delete {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-link {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
}

.btn-link:hover {
  background: #0056b3;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: auto;
  padding: 2rem 0;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  margin: auto;
}

.modal-details {
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f0f0f0;
}

.details-header h2 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  line-height: 1;
  padding: 0;
  width: 30px;
  height: 30px;
}

.close-btn:hover {
  color: #000;
}

.details-body {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-section h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 0.5rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

.value {
  color: #2c3e50;
  font-weight: 600;
}

.status-yes {
  color: #28a745;
}

.status-no {
  color: #dc3545;
}

.info-text {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.details-footer {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 2px solid #f0f0f0;
  text-align: right;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input, select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  gap: 1rem;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.loading, .error, .empty {
  text-align: center;
  padding: 2rem;
}

.error {
  color: #dc3545;
}
</style>