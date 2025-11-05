/**
 * User Roles Configuration
 * Kullanıcı rolleri ve yönetimi
 */

// Kullanıcı rolleri (Backend UserRole enum ile uyumlu)
export const UserRoles = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  VIEWER: 'viewer'
};

// Rol görünen isimleri
export const UserRoleNames = {
  [UserRoles.SUPERADMIN]: 'Süper Admin',
  [UserRoles.ADMIN]: 'Admin',
  [UserRoles.VIEWER]: 'Görüntüleyici'
};

// Rol açıklamaları
export const UserRoleDescriptions = {
  [UserRoles.SUPERADMIN]: 'Tüm yetkilere sahip, kullanıcı yönetimi yapabilir',
  [UserRoles.ADMIN]: 'Yazıcı yönetimi ve operasyon yetkileri',
  [UserRoles.VIEWER]: 'Sadece görüntüleme yetkisi'
};

/**
 * Rol adını görünen isme çevir
 * @param {string} role - Rol adı
 * @returns {string} Görünen isim
 */
export const getRoleName = (role) => {
  return UserRoleNames[role] || role;
};

/**
 * Rol açıklamasını al
 * @param {string} role - Rol adı
 * @returns {string} Açıklama
 */
export const getRoleDescription = (role) => {
  return UserRoleDescriptions[role] || '';
};

/**
 * Tüm rolleri al (array olarak)
 * @returns {Array} Rol listesi
 */
export const getAllRoles = () => {
  return Object.values(UserRoles);
};

/**
 * Rol seçenekleri (combobox için)
 * @returns {Array<{value: string, label: string, description: string}>}
 */
export const getRoleOptions = () => {
  return getAllRoles().map(role => ({
    value: role,
    label: UserRoleNames[role],
    description: UserRoleDescriptions[role]
  }));
};

// Export as default
export default {
  UserRoles,
  UserRoleNames,
  UserRoleDescriptions,
  getRoleName,
  getRoleDescription,
  getAllRoles,
  getRoleOptions
};
