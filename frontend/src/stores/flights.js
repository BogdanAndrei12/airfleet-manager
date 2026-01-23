import { defineStore } from 'pinia';
import api from '../services/api';

export const useFlightsStore = defineStore('flights', {
  state: () => ({
    flights: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchFlights() {
      this.loading = true;
      try {
        const response = await api.get('/api/flights');
        this.flights = response.data.data;
        this.error = null;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    
    async createFlight(data) {
      try {
        const response = await api.post('/api/flights', data);
        this.flights.push(response.data.data);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || error.message;
        throw error;
      }
    },
    
    async deleteFlight(id) {
      try {
        await api.delete(`/api/flights/${id}`);
        this.flights = this.flights.filter(f => f.id !== id);
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    }
  }
});