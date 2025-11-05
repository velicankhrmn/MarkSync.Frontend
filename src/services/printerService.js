/**
 * Printer Service
 * Yazıcı yönetimi için API isteklerini yöneten servis
 */

import apiService from './apiService';
import logger from '../utils/logger';

class PrinterService {
  /**
   * Tüm yazıcıları getir
   * GET /api/printer
   */
  async getAllPrinters() {
    try {
      logger.info('Fetching all printers');
      const response = await apiService.get('/printer');
      logger.success('Printers fetched successfully', { count: response?.length });
      return response;
    } catch (error) {
      logger.error('Failed to fetch printers', error);
      throw error;
    }
  }

  /**
   * Yazıcıyı ID'ye göre getir
   * GET /api/printer/{id}
   * @param {string} id - Yazıcı ID (GUID)
   */
  async getPrinterById(id) {
    try {
      logger.info(`Fetching printer with id: ${id}`);
      const response = await apiService.get(`/printer/${id}`);
      logger.success('Printer fetched successfully', { printer: response });
      return response;
    } catch (error) {
      logger.error(`Failed to fetch printer with id: ${id}`, error);
      throw error;
    }
  }

  /**
   * Yeni yazıcı ekle
   * POST /api/printer
   * @param {Object} printerData - Yazıcı bilgileri
   * @param {string} printerData.name - Yazıcı adı
   * @param {string} printerData.model - Yazıcı modeli
   * @param {number} printerData.protocolType - Protokol tipi (0:TCP, 1:DLL, 2:HTTP)
   * @param {string} printerData.address - Yazıcı adresi
   * @param {number|null} printerData.port - Port numarası (TCP için)
   * @param {string|null} printerData.dllPath - DLL dosya yolu
   * @param {boolean} printerData.isActive - Aktif durumu
   */
  async addPrinter(printerData) {
    try {
      logger.info('Adding new printer', { printerData });

      // API'ye uygun formatta data hazırla
      const payload = {
        name: printerData.name,
        model: printerData.model,
        protocolType: parseInt(printerData.protocolType),
        address: printerData.address,
        port: printerData.port ? parseInt(printerData.port) : null,
        dllPath: printerData.dllPath || null,
        isActive: printerData.isActive || true
      };

      const response = await apiService.post('/printer', payload);
      logger.success('Printer added successfully', { printer: response });
      return response;
    } catch (error) {
      logger.error('Failed to add printer', error);
      throw error;
    }
  }

  /**
   * Yazıcı güncelle
   * PUT /api/printer/{id}
   * @param {string} id - Yazıcı ID (GUID)
   * @param {Object} printerData - Güncellenecek yazıcı bilgileri
   * @returns {Object} - Güncellenmiş yazıcı bilgisi
   */
  async updatePrinter(id, printerData) {
    try {
      logger.info(`Updating printer with id: ${id}`, { printerData });

      // API'ye uygun formatta data hazırla
      const payload = {
        name: printerData.name,
        model: printerData.model,
        protocolType: parseInt(printerData.protocolType),
        address: printerData.address,
        port: printerData.port ? parseInt(printerData.port) : null,
        dllPath: printerData.dllPath || null,
        isActive: printerData.isActive
      };

      await apiService.put(`/printer/${id}`, payload);
      logger.success(`Printer updated successfully`, { id });

      // Backend güncellenmiş veriyi döndürmediği için (204 No Content),
      // güncellenmiş veriyi kendimiz döndürelim
      return { id, ...payload };
    } catch (error) {
      logger.error(`Failed to update printer with id: ${id}`, error);
      throw error;
    }
  }

  /**
   * Yazıcı sil
   * DELETE /api/printer/{id}
   * @param {string} id - Yazıcı ID (GUID)
   */
  async deletePrinter(id) {
    try {
      logger.info(`Deleting printer with id: ${id}`);
      await apiService.delete(`/printer/${id}`);
      logger.success(`Printer deleted successfully`, { id });
      return true;
    } catch (error) {
      logger.error(`Failed to delete printer with id: ${id}`, error);
      throw error;
    }
  }

  /**
   * Yazıcı aktif/pasif durumunu değiştir
   * PUT /api/printer/{id}
   * @param {string} id - Yazıcı ID (GUID)
   * @param {boolean} isActive - Yeni aktif durumu
   */
  async togglePrinterStatus(id, isActive) {
    try {
      logger.info(`Toggling printer status: ${id}`, { isActive });

      // Önce mevcut yazıcıyı getir
      const printer = await this.getPrinterById(id);

      // Sadece isActive durumunu değiştir
      const payload = {
        ...printer,
        isActive: isActive
      };

      await apiService.put(`/printer/${id}`, payload);
      logger.success(`Printer status toggled successfully`, { id, isActive });
      return true;
    } catch (error) {
      logger.error(`Failed to toggle printer status: ${id}`, error);
      throw error;
    }
  }
}

// Singleton instance
const printerService = new PrinterService();

export default printerService;