/**
 * Merkezi API Servis
 * Tüm HTTP isteklerini yöneten temel servis sınıfı
 */

import { getCookie } from '../utils/cookies';
import logger from '../utils/logger';

class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    this.timeout = 30000; // 30 saniye
  }

  /**
   * Authorization header'ını al
   */
  getAuthHeader() {
    const token = getCookie('auth_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Genel HTTP isteği fonksiyonu
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
        ...options.headers,
      },
      ...options,
    };

    // GET istekleri için body ekleme
    if (config.method !== 'GET' && options.body) {
      config.body = JSON.stringify(options.body);
    }

    // Request log
    logger.apiRequest(config.method, url, options.body);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Yanıtı JSON olarak parse et
      const data = await response.json();

      // Hata durumunda özel hata fırlat
      if (!response.ok) {
        const error = {
          status: response.status,
          message: data.message || 'Bir hata oluştu',
          data: data,
        };
        logger.apiError(config.method, url, error);
        throw error;
      }

      // Response log
      logger.apiResponse(config.method, url, response.status, data);

      return data;
    } catch (error) {
      // Timeout hatası
      if (error.name === 'AbortError') {
        const timeoutError = {
          status: 408,
          message: 'İstek zaman aşımına uğradı',
          data: null,
        };
        logger.apiError(config.method, url, timeoutError);
        throw timeoutError;
      }

      // Network hatası
      if (error instanceof TypeError) {
        const networkError = {
          status: 0,
          message: 'Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.',
          data: null,
        };
        logger.apiError(config.method, url, networkError);
        throw networkError;
      }

      // Diğer hatalar zaten loglandı
      throw error;
    }
  }

  /**
   * GET isteği
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST isteği
   */
  async post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  /**
   * PUT isteği
   */
  async put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  /**
   * DELETE isteği
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * PATCH isteği
   */
  async patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }
}

// Singleton instance
const apiService = new ApiService();

export default apiService;
