/**
 * User Service
 * Kullanıcı yönetimi için API isteklerini yöneten servis
 */

import apiService from './apiService';
import logger from '../utils/logger';

class UserService {
  /**
   * Tüm kullanıcıları getir
   * GET /api/user
   */
  async getAllUsers() {
    try {
      logger.info('Fetching all users');
      const response = await apiService.get('/user');
      logger.success('Users fetched successfully', { count: response?.length });
      return response;
    } catch (error) {
      logger.error('Failed to fetch users', error);
      throw error;
    }
  }

  /**
   * Yeni kullanıcı ekle
   * POST /api/user
   * @param {Object} userData - Kullanıcı bilgileri
   * @param {string} userData.username - Kullanıcı adı
   * @param {string} userData.passwordHash - Şifre (hash'lenmiş)
   * @param {string} userData.role - Kullanıcı rolü (superadmin, admin, viewer)
   */
  async addUser(userData) {
    try {
      logger.info('Adding new user', { username: userData.username, role: userData.role });

      // API'ye uygun formatta data hazırla
      const payload = {
        username: userData.username,
        passwordHash: userData.passwordHash,
        role: userData.role
      };

      const response = await apiService.post('/user', payload);
      logger.success('User added successfully', { user: response });
      return response;
    } catch (error) {
      logger.error('Failed to add user', error);
      throw error;
    }
  }

  /**
   * Kullanıcı güncelle
   * PUT /api/user/{id}
   * @param {string} id - Kullanıcı ID (GUID)
   * @param {Object} userData - Güncellenecek kullanıcı bilgileri
   * @returns {Object} - Güncellenmiş kullanıcı bilgisi
   */
  async updateUser(id, userData) {
    try {
      logger.info(`Updating user with id: ${id}`, { userData });

      // API'ye uygun formatta data hazırla
      const payload = {
        username: userData.username,
        passwordHash: userData.passwordHash,
        role: userData.role
      };

      await apiService.put(`/user/${id}`, payload);
      logger.success(`User updated successfully`, { id });

      // Backend güncellenmiş veriyi döndürmediği için (204 No Content),
      // güncellenmiş veriyi kendimiz döndürelim
      return { id, ...payload };
    } catch (error) {
      logger.error(`Failed to update user with id: ${id}`, error);
      throw error;
    }
  }

  /**
   * Kullanıcı sil
   * DELETE /api/user/{id}
   * @param {string} id - Kullanıcı ID (GUID)
   */
  async deleteUser(id) {
    try {
      logger.info(`Deleting user with id: ${id}`);
      await apiService.delete(`/user/${id}`);
      logger.success(`User deleted successfully`, { id });
      return true;
    } catch (error) {
      logger.error(`Failed to delete user with id: ${id}`, error);
      throw error;
    }
  }
}

// Singleton instance
const userService = new UserService();

export default userService;
