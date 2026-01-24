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
            <th>Route</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="flight in flightsList" :key="flight.id">
            <td>{{ flight.flightNumber }}</td>
            <td>{{ flight.route?.departure?.iataCode }} → {{ flight.route?.arrival?.iataCode }}</td>
            <td>{{ flight.status }}</td>
            <td>
              <button @click="deleteFlight(flight.id)" class="btn-delete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="showForm" class="modal">
      <div class="modal-content">
        <h2>Add New Flight</h2>
        <form @submit.prevent="handleCreate">
          <input v-model="form.flightNumber" placeholder="Flight Number (e.g., RO453)" required />
          <input v-model="form.aircraftId" placeholder="Aircraft ID" required />
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
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useFlightsStore } from '../stores/flights';

export default {
  name: 'FlightsList',
  setup() {
    const store = useFlightsStore();
    const showForm = ref(false);
    const form = ref({
      flightNumber: '',
      aircraftId: '',
      departureCode: '',
      arrivalCode: '',
      status: 'Scheduled'
    });
    
    onMounted(() => {
      store.fetchFlights();
    });
    
    const handleCreate = async () => {
      if (!form.value.flightNumber.trim()) {
        alert('Flight number is required');
        return;
      }
      
      if (!form.value.aircraftId.trim()) {
        alert('Aircraft ID is required');
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
    
    return {
      flightsList: computed(() => store.flights),
      loading: computed(() => store.loading),
      error: computed(() => store.error),
      showForm,
      form,
      handleCreate,
      deleteFlight,
      closeForm
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

.btn-primary {
  background: #42b983;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
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
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
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