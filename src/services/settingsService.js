import apiService from './apiService';

const settingsService = {
  // Tüm ayarları getir (API'den)
  async getSettings() {
    const response = await apiService.get('/Settings');
    return response;
  },

  // Ayarları güncelle (API'ye kaydet)
  async updateSettings(settings) {
    const response = await apiService.put('/Settings', settings);
    return response;
  }
};

export default settingsService;
