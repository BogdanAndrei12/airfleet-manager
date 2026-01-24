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
              <button @click="deleteAircraft(aircraft.id)" class="btn-delete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
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
    
    const closeForm = () => {
      showForm.value = false;
      form.value = {
        registration: '',
        model: '',
        manufacturer: '',
        airlineName: ''
      };
    };
    
    return {
      aircraftList: computed(() => store.aircraft),
      loading: computed(() => store.loading),
      error: computed(() => store.error),
      showForm,
      form,
      handleCreate,
      deleteAircraft,
      closeForm
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