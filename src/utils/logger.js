/**
 * Logger Utility
 * Geliştirme ve production ortamlarında loglama işlemlerini yöneten utility
 */

class Logger {
  constructor() {
    this.isDevelopment = import.meta.env.VITE_APP_ENV === 'development';
    this.enableLogging = true; // Manuel olarak kapatmak için
  }

  /**
   * Prefix oluştur
   */
  getPrefix(level) {
    const timestamp = new Date().toLocaleTimeString('tr-TR');
    return `[${timestamp}] [${level}]`;
  }

  /**
   * Log mesajını formatla
   */
  formatMessage(prefix, message, data) {
    if (data !== undefined) {
      return [prefix, message, data];
    }
    return [prefix, message];
  }

  /**
   * Info log
   */
  info(message, data) {
    if (!this.enableLogging || !this.isDevelopment) return;
    const prefix = this.getPrefix('INFO');
    console.log(...this.formatMessage(prefix, message, data));
  }

  /**
   * Success log
   */
  success(message, data) {
    if (!this.enableLogging || !this.isDevelopment) return;
    const prefix = this.getPrefix('SUCCESS');
    console.log(
      `%c${prefix}`,
      'color: #10b981; font-weight: bold',
      message,
      data !== undefined ? data : ''
    );
  }

  /**
   * Warning log
   */
  warn(message, data) {
    if (!this.enableLogging) return;
    const prefix = this.getPrefix('WARN');
    console.warn(...this.formatMessage(prefix, message, data));
  }

  /**
   * Error log (her zaman çalışır)
   */
  error(message, error) {
    const prefix = this.getPrefix('ERROR');
    console.error(prefix, message, error);
  }

  /**
   * Debug log (sadece development'ta)
   */
  debug(message, data) {
    if (!this.enableLogging || !this.isDevelopment) return;
    const prefix = this.getPrefix('DEBUG');
    console.debug(...this.formatMessage(prefix, message, data));
  }

  /**
   * API request log
   */
  apiRequest(method, url, body) {
    if (!this.enableLogging || !this.isDevelopment) return;
    console.group(`%c🌐 API Request: ${method} ${url}`, 'color: #3b82f6; font-weight: bold');
    console.log('Method:', method);
    console.log('URL:', url);
    if (body) {
      console.log('Body:', body);
    }
    console.groupEnd();
  }

  /**
   * API response log
   */
  apiResponse(method, url, status, data) {
    if (!this.enableLogging || !this.isDevelopment) return;
    const color = status >= 200 && status < 300 ? '#10b981' : '#ef4444';
    console.group(`%c✓ API Response: ${method} ${url}`, `color: ${color}; font-weight: bold`);
    console.log('Status:', status);
    console.log('Data:', data);
    console.groupEnd();
  }

  /**
   * API error log
   */
  apiError(method, url, error) {
    console.group(`%c✗ API Error: ${method} ${url}`, 'color: #ef4444; font-weight: bold');
    console.error('Error:', error);
    console.groupEnd();
  }

  /**
   * Auth log
   */
  auth(action, data) {
    if (!this.enableLogging || !this.isDevelopment) return;
    console.group(`%c🔐 Auth: ${action}`, 'color: #f59e0b; font-weight: bold');
    console.log('Action:', action);
    if (data) {
      console.log('Data:', data);
    }
    console.groupEnd();
  }

  /**
   * Cookie log
   */
  cookie(action, name, value) {
    if (!this.enableLogging || !this.isDevelopment) return;
    console.log(
      `%c🍪 Cookie ${action}:`,
      'color: #8b5cf6; font-weight: bold',
      name,
      value !== undefined ? value : ''
    );
  }

  /**
   * Navigation log
   */
  navigate(from, to) {
    if (!this.enableLogging || !this.isDevelopment) return;
    console.log(
      `%c🧭 Navigation:`,
      'color: #06b6d4; font-weight: bold',
      `${from} → ${to}`
    );
  }

  /**
   * Component lifecycle log
   */
  lifecycle(component, action) {
    if (!this.enableLogging || !this.isDevelopment) return;
    console.log(
      `%c⚛️ ${component}:`,
      'color: #0ea5e9; font-weight: bold',
      action
    );
  }

  /**
   * Table formatında log
   */
  table(data) {
    if (!this.enableLogging || !this.isDevelopment) return;
    console.table(data);
  }

  /**
   * Loglama durumunu değiştir
   */
  setEnabled(enabled) {
    this.enableLogging = enabled;
    this.info('Logging', enabled ? 'enabled' : 'disabled');
  }
}

// Singleton instance
const logger = new Logger();

// Global erişim için (tarayıcı konsolundan debug yapmak için)
if (typeof window !== 'undefined') {
  window.logger = logger;
}

export default logger;
