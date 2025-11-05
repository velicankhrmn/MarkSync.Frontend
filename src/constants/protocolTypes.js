/**
 * Protocol Types
 * API'deki ProtocolType enum'unu yansıtır
 */

export const ProtocolTypes = {
  TCP: 0,
  DLL: 1,
  HTTP: 2,
  SERIAL: 3,
};

export const ProtocolTypeNames = {
  [ProtocolTypes.TCP]: 'TCP/IP',
  [ProtocolTypes.DLL]: 'DLL',
  [ProtocolTypes.HTTP]: 'HTTP',
  [ProtocolTypes.SERIAL]: 'Serial Port',
};

/**
 * Protocol type adını al
 * @param {number} type - Protocol type enum değeri
 * @returns {string} - Protocol type adı
 */
export const getProtocolTypeName = (type) => {
  return ProtocolTypeNames[type] || 'Bilinmiyor';
};

/**
 * Protocol type select options
 */
export const getProtocolTypeOptions = () => {
  return Object.entries(ProtocolTypes).map(([key, value]) => ({
    value: value,
    label: ProtocolTypeNames[value],
  }));
};
