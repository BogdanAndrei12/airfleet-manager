import { defineStore } from 'pinia';
import api from '../services/api';

export const useAircraftStore = defineStore('aircraft', {
  state: () => ({
    aircraft: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchAircraft() {
      this.loading = true;
      try {
        const response = await api.get('/api/aircraft');
        this.aircraft = response.data.data;
        this.error = null;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    
    async createAircraft(data) {
      try {
        const response = await api.post('/api/aircraft', data);
        this.aircraft.push(response.data.data);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || error.message;
        throw error;
      }
    },
    
    async deleteAircraft(id) {
      try {
        await api.delete(`/api/aircraft/${id}`);
        this.aircraft = this.aircraft.filter(a => a.id !== id);
      } catch (error) {
        this.error = error.message;
        throw error;
      }
    }
  }
});