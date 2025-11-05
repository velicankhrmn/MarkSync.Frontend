/**
 * Authentication Servis
 * Kimlik doğrulama işlemlerini yöneten servis sınıfı
 */

import apiService from './apiService';
import { setCookie, getCookie, deleteCookie } from '../utils/cookies';
import logger from '../utils/logger';

class AuthService {
  /**
   * Kullanıcı girişi
   * @param {string} username - Kullanıcı adı
   * @param {string} password - Şifre
   * @returns {Promise<Object>} - { username, role, token }
   */
  async login(username, password) {
    try {
      logger.auth('Login attempt', { username });

      const response = await apiService.post('/auth/login', {
        username,
        password,
      });

      // API'den dönen yanıt: { username, role, token }
      if (response.token) {
        // Token'ı cookie'ye kaydet (7 gün geçerli)
        setCookie('auth_token', response.token, 7);
        logger.cookie('SET', 'auth_token', '***');

        // Kullanıcı bilgilerini cookie'ye kaydet
        const userInfo = {
          username: response.username,
          role: response.role,
        };
        setCookie('user_info', JSON.stringify(userInfo), 7);
        logger.cookie('SET', 'user_info', userInfo);

        logger.success('Login successful', { username: response.username, role: response.role });
      }

      return response;
    } catch (error) {
      logger.error('Login failed', error);
      throw error;
    }
  }

  /**
   * Kullanıcı çıkışı
   */
  logout() {
    logger.auth('Logout', { user: this.getCurrentUser() });
    deleteCookie('auth_token');
    deleteCookie('user_info');
    logger.cookie('DELETE', 'auth_token');
    logger.cookie('DELETE', 'user_info');
  }

  /**
   * Mevcut kullanıcıyı al
   * @returns {Object|null} - { username, role } veya null
   */
  getCurrentUser() {
    const userStr = getCookie('user_info');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Parse user error:', error);
      return null;
    }
  }

  /**
   * Token'ı al
   * @returns {string|null}
   */
  getToken() {
    return getCookie('auth_token');
  }

  /**
   * Kullanıcının oturum açıp açmadığını kontrol et
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getCurrentUser();
    const isAuth = !!(token && user);
    logger.debug('Auth check', { isAuthenticated: isAuth, hasToken: !!token, hasUser: !!user });
    return isAuth;
  }

  /**
   * Token'ı doğrula (Backend'e istek gönderilerek)
   * Bu fonksiyon isteğe bağlı - backend'de bir /auth/verify endpoint'i varsa kullanılabilir
   */
  async verifyToken() {
    try {
      const response = await apiService.get('/auth/verify');
      return response;
    } catch (error) {
      // Token geçersizse logout yap
      this.logout();
      return null;
    }
  }

  /**
   * Kullanıcının rolünü kontrol et
   * @param {string[]} allowedRoles - İzin verilen roller
   * @returns {boolean}
   */
  hasRole(allowedRoles) {
    const user = this.getCurrentUser();
    if (!user || !user.role) return false;
    return allowedRoles.includes(user.role);
  }
}

// Singleton instance
const authService = new AuthService();

export default authService;
