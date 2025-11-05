/**
 * Cookie Yönetim Utility
 * Cookie işlemlerini kolaylaştıran yardımcı fonksiyonlar
 */

/**
 * Cookie ayarla
 * @param {string} name - Cookie adı
 * @param {string} value - Cookie değeri
 * @param {number} days - Geçerlilik süresi (gün)
 * @param {Object} options - Ek seçenekler
 */
export const setCookie = (name, value, days = 7, options = {}) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  const defaults = {
    expires: date.toUTCString(),
    path: '/',
    sameSite: 'strict',
    secure: window.location.protocol === 'https:',
  };

  const cookieOptions = { ...defaults, ...options };

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (cookieOptions.expires) {
    cookieString += `; expires=${cookieOptions.expires}`;
  }

  if (cookieOptions.path) {
    cookieString += `; path=${cookieOptions.path}`;
  }

  if (cookieOptions.domain) {
    cookieString += `; domain=${cookieOptions.domain}`;
  }

  if (cookieOptions.sameSite) {
    cookieString += `; samesite=${cookieOptions.sameSite}`;
  }

  if (cookieOptions.secure) {
    cookieString += '; secure';
  }

  document.cookie = cookieString;
};

/**
 * Cookie'yi oku
 * @param {string} name - Cookie adı
 * @returns {string|null} - Cookie değeri veya null
 */
export const getCookie = (name) => {
  const nameEQ = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length, cookie.length));
    }
  }

  return null;
};

/**
 * Cookie'yi sil
 * @param {string} name - Cookie adı
 * @param {Object} options - Ek seçenekler
 */
export const deleteCookie = (name, options = {}) => {
  setCookie(name, '', -1, options);
};

/**
 * Tüm cookie'leri al
 * @returns {Object} - Tüm cookie'ler object olarak
 */
export const getAllCookies = () => {
  const cookies = {};
  const cookieArray = document.cookie.split(';');

  cookieArray.forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name) {
      cookies[decodeURIComponent(name)] = decodeURIComponent(value || '');
    }
  });

  return cookies;
};

/**
 * Cookie'nin var olup olmadığını kontrol et
 * @param {string} name - Cookie adı
 * @returns {boolean}
 */
export const hasCookie = (name) => {
  return getCookie(name) !== null;
};
