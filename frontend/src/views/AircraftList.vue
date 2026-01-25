<template>
  <div class="aircraft-page">
    <div class="header">
      <h1>Aircraft Fleet</h1>
      <button @click="showForm = true" class="btn-primary">Add Aircraft</button>
    </div>
    
    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else class="aircraft-list">
      <table>
        <thead>
          <tr>
            <th>Registration</th>
            <th>Model</th>
            <th>Manufacturer</th>
            <th>Airline</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="aircraft in aircraftList" :key="aircraft.id">
            <td>{{ aircraft.registration }}</td>
            <td>{{ aircraft.model }}</td>
            <td>{{ aircraft.manufacturer }}</td>
            <td>{{ aircraft.airline?.name }}</td>
            <td>
              <span :class="aircraft.status?.operational ? 'status-active' : 'status-inactive'">
                {{ aircraft.status?.operational ? 'Operational' : 'Inactive' }}
              </span>
            </td>
            <td>
              <button @click="viewDetails(aircraft)" class="btn-view">View</button>
              <button @click="deleteAircraft(aircraft.id)" class="btn-delete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Modal CREATE -->
    <div v-if="showForm" class="modal">
      <div class="modal-content">
        <h2>Add New Aircraft</h2>
        <form @submit.prevent="handleCreate">
          <input v-model="form.registration" placeholder="Registration (e.g., YR-ABC)" required />
          <input v-model="form.model" placeholder="Model (e.g., Boeing 737-800)" required />
          <input v-model="form.manufacturer" placeholder="Manufacturer" required />
          <input v-model="form.airlineName" placeholder="Airline Name" required />
          
          <div class="form-actions">
            <button type="submit" class="btn-primary">Create</button>
            <button type="button" @click="closeForm" class="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal DETAILS -->
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
          
          <div class="detail-section" v-if="selectedAircraft.metadata">
            <h3>Metadata</h3>
            <div class="detail-grid">
              <div class="detail-item" v-if="selectedAircraft.metadata.createdAt">
                <span class="label">Created:</span>
                <span class="value">{{ formatDate(selectedAircraft.metadata.createdAt) }}</span>
              </div>
              <div class="detail-item" v-if="selectedAircraft.metadata.updatedAt">
                <span class="label">Last Updated:</span>
                <span class="value">{{ formatDate(selectedAircraft.metadata.updatedAt) }}</span>
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
import { useAircraftStore } from '../stores/aircraft';

export default {
  name: 'AircraftList',
  setup() {
    const store = useAircraftStore();
    const showForm = ref(false);
    const selectedAircraft = ref(null);
    const form = ref({
      registration: '',
      model: '',
      manufacturer: '',
      airlineName: ''
    });
    
    onMounted(() => {
      store.fetchAircraft();
    });
    
    const handleCreate = async () => {
      if (!form.value.registration.trim()) {
        alert('Registration is required');
        return;
      }
      
      if (form.value.registration.length < 3) {
        alert('Registration must be at least 3 characters');
        return;
      }
      
      if (!form.value.model.trim()) {
        alert('Model is required');
        return;
      }
      
      if (!form.value.manufacturer.trim()) {
        alert('Manufacturer is required');
        return;
      }
      
      if (!form.value.airlineName.trim()) {
        alert('Airline name is required');
        return;
      }
      
      try {
        await store.createAircraft({
          registration: form.value.registration,
          model: form.value.model,
          manufacturer: form.value.manufacturer,
          airline: {
            name: form.value.airlineName,
            iataCode: '',
            country: 'Romania'
          },
          specifications: {},
          status: { operational: true }
        });
        closeForm();
      } catch (error) {
        const errorMsg = error.response?.data?.error || error.message;
        alert('Error: ' + errorMsg);
      }
    };
    
    const deleteAircraft = async (id) => {
      if (confirm('Are you sure you want to delete this aircraft?')) {
        try {
          await store.deleteAircraft(id);
        } catch (error) {
          alert('Error: ' + error.message);
        }
      }
    };
    
    const viewDetails = (aircraft) => {
      selectedAircraft.value = aircraft;
    };
    
    const closeForm = () => {
      showForm.value = false;
      form.value = {
        registration: '',
        model: '',
        manufacturer: '',
        airlineName: ''
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
      aircraftList: computed(() => store.aircraft),
      loading: computed(() => store.loading),
      error: computed(() => store.error),
      showForm,
      selectedAircraft,
      form,
      handleCreate,
      deleteAircraft,
      viewDetails,
      closeForm,
      formatDate
    };
  }
}
</script>

<style scoped>
.aircraft-page {
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

.status-active {
  color: #28a745;
  font-weight: bold;
}

.status-inactive {
  color: #dc3545;
  font-weight: bold;
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

input {
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

.loading, .error {
  text-align: center;
  padding: 2rem;
}

.error {
  color: #dc3545;
}
</style>