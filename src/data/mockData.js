// Mock data for printers - will be replaced with API calls later
// Matches PrinterEntity from backend
export const mockPrinters = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001', // Guid
    name: 'Yazıcı 1',
    model: 'Industrial Printer X1000',
    protocolType: 0, // 0: TCP, 1: DLL, 2: HTTP, 3: Serial
    address: '192.168.1.101',
    port: 9100,
    dllPath: null,
    isActive: true
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Yazıcı 2',
    model: 'Industrial Printer X1000',
    protocolType: 0, // TCP
    address: '192.168.1.102',
    port: 9100,
    dllPath: null,
    isActive: true
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Yazıcı 3',
    model: 'Industrial Printer X2000',
    protocolType: 2, // HTTP
    address: 'http://192.168.1.103',
    port: null,
    dllPath: null,
    isActive: false
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Yazıcı 4',
    model: 'Industrial Printer X1500',
    protocolType: 3, // Serial
    address: 'COM1',
    port: null,
    dllPath: null,
    isActive: false
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Yazıcı 5',
    model: 'Custom DLL Printer',
    protocolType: 1, // DLL
    address: '',
    port: null,
    dllPath: 'C:\\Printers\\CustomDriver.dll',
    isActive: false
  }
];

// Protocol types enum (matches backend ProtocolType enum)
export const ProtocolTypes = {
  0: 'TCP',
  1: 'DLL',
  2: 'HTTP',
  3: 'Serial'
};

export const getProtocolTypeName = (type) => {
  return ProtocolTypes[type] || 'Bilinmiyor';
};

// Printer Status - Real-time printer states for Dashboard
// This data would come from a separate status/monitoring API endpoint
export const mockPrinterStatus = [
  {
    printerId: '550e8400-e29b-41d4-a716-446655440001',
    printerName: 'Yazıcı 1',
    status: 'printing', // printing, ready, offline, error
    activeTemplate: {
      name: 'Ürün Etiketi A',
      content: 'Barkod, Ürün Adı, Tarih, Fiyat'
    },
    inkLevel: 78,
    solventLevel: 65,
    lastUpdated: new Date().toISOString()
  },
  {
    printerId: '550e8400-e29b-41d4-a716-446655440002',
    printerName: 'Yazıcı 2',
    status: 'ready',
    activeTemplate: {
      name: 'Paket Etiketi B',
      content: 'QR Kod, Sipariş No, Adres'
    },
    inkLevel: 92,
    solventLevel: 88,
    lastUpdated: new Date().toISOString()
  },
  {
    printerId: '550e8400-e29b-41d4-a716-446655440003',
    printerName: 'Yazıcı 3',
    status: 'printing',
    activeTemplate: {
      name: 'Seri No Etiketi',
      content: 'Seri No, Model, Üretim Tarihi'
    },
    inkLevel: 45,
    solventLevel: 52,
    lastUpdated: new Date().toISOString()
  },
  {
    printerId: '550e8400-e29b-41d4-a716-446655440004',
    printerName: 'Yazıcı 4',
    status: 'offline',
    activeTemplate: null,
    inkLevel: 0,
    solventLevel: 0,
    lastUpdated: new Date().toISOString()
  },
  {
    printerId: '550e8400-e29b-41d4-a716-446655440005',
    printerName: 'Yazıcı 5',
    status: 'error',
    activeTemplate: {
      name: 'Fiyat Etiketi',
      content: 'Fiyat, Barkod'
    },
    inkLevel: 12,
    solventLevel: 8,
    lastUpdated: new Date().toISOString(),
    errorMessage: 'Mürekkep seviyesi kritik düzeyde'
  }
];

// Printer status helpers
export const PrinterStatusTypes = {
  printing: { text: 'Yazdırıyor', color: '#3b82f6' },
  ready: { text: 'Hazır', color: '#10b981' },
  offline: { text: 'Kapalı', color: '#6b7280' },
  error: { text: 'Hata', color: '#ef4444' }
};

export const getPrinterStatusInfo = (status) => {
  return PrinterStatusTypes[status] || { text: 'Bilinmiyor', color: '#6b7280' };
};
