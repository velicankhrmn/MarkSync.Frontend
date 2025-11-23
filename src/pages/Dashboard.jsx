import { useState, useEffect, useRef } from 'react';
import printerService from '../services/printerService';
import settingsService from '../services/settingsService';
import {
  Printer,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Droplet,
  Beaker,
  RefreshCw,
  WifiOff,
  Type,
  Hash,
  Calendar,
  Clock,
  BarChart3,
  Filter,
  Image,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const Dashboard = () => {
  const [activePrinters, setActivePrinters] = useState([]);
  const [printerStatuses, setPrinterStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [selectedPrinterIds, setSelectedPrinterIds] = useState(new Set());
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [expandedLines, setExpandedLines] = useState({}); // { "printerId-lineNumber": true/false }
  const intervalRef = useRef(null);

  // Line accordion toggle fonksiyonu
  const toggleLineExpand = (printerId, lineNumber) => {
    const key = `${printerId}-${lineNumber}`;
    setExpandedLines(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Line'ın açık olup olmadığını kontrol et
  const isLineExpanded = (printerId, lineNumber) => {
    const key = `${printerId}-${lineNumber}`;
    return expandedLines[key] || false;
  };

  // Ayarları yükle
  useEffect(() => {
    loadSettings();
  }, []);

  // Aktif yazıcıları yükle
  useEffect(() => {
    loadActivePrinters();
  }, []);

  // Otomatik yenileme
  useEffect(() => {
    // Mevcut interval'i temizle
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Eğer otomatik yenileme aktifse yeni interval başlat
    if (autoRefreshEnabled && refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        loadActivePrinters(false); // Otomatik yenilemelerde loading gösterme
      }, refreshInterval * 1000); // saniyeyi milisaniyeye çevir
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoRefreshEnabled, refreshInterval]);

  const loadSettings = async () => {
    try {
      const settings = await settingsService.getSettings();
      setAutoRefreshEnabled(settings.autoRefreshEnabled || false);
      setRefreshInterval(settings.refreshInterval || 30);
    } catch (err) {
      console.error('Ayarlar yüklenirken hata:', err);
      // Varsayılan değerleri kullan
      setAutoRefreshEnabled(false);
      setRefreshInterval(30);
    }
  };

  const loadActivePrinters = async (isInitialLoad = true) => {
    try {
      // Sadece ilk yüklemede loading göster, otomatik yenilemelerde gösterme
      if (isInitialLoad) {
        setLoading(true);
      }
      setError(null);

      // Aktif yazıcıları al (API'den array of {id, name} döner)
      const printers = await printerService.getActivePrinterIds();
      setActivePrinters(printers || []);

      // Filtrelenmiş yazıcılar için status bilgilerini al
      const filteredPrinters = getFilteredPrinters(printers || []);
      await loadPrinterStatuses(filteredPrinters);
    } catch (err) {
      setError(err.message || 'Yazıcılar yüklenirken bir hata oluştu');
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  };

  // Filtreleme fonksiyonu - Seçili yazıcıları döndür
  const getFilteredPrinters = (printers) => {
    if (selectedPrinterIds.size === 0) {
      return printers; // Hiç seçim yoksa hepsini döndür
    }

    return printers.filter(printer => selectedPrinterIds.has(printer.id));
  };

  // Yazıcı seçim/seçim kaldırma
  const togglePrinterSelection = (printerId) => {
    const newSelection = new Set(selectedPrinterIds);
    if (newSelection.has(printerId)) {
      newSelection.delete(printerId);
    } else {
      newSelection.add(printerId);
    }
    setSelectedPrinterIds(newSelection);
  };

  // Tümünü seç/kaldır
  const toggleSelectAll = () => {
    if (selectedPrinterIds.size === activePrinters.length) {
      setSelectedPrinterIds(new Set());
    } else {
      setSelectedPrinterIds(new Set(activePrinters.map(p => p.id)));
    }
  };

  // Her yazıcı için ayrı ayrı status bilgisi al
  const loadPrinterStatuses = async (printers) => {
    const statusPromises = printers.map(async (printer) => {
      try {
        const status = await printerService.getPrinterStatus(printer.id);
        return {
          printerId: printer.id,
          printerName: printer.name,
          status: status,
          error: null,
          loading: false
        };
      } catch (error) {
        return {
          printerId: printer.id,
          printerName: printer.name,
          status: null,
          error: error.message || 'Yazıcı durumu alınamadı',
          loading: false
        };
      }
    });

    // Tüm istekleri paralel olarak at
    const results = await Promise.all(statusPromises);

    // Sonuçları state'e kaydet
    const statusMap = {};
    results.forEach(result => {
      statusMap[result.printerId] = {
        name: result.printerName,
        data: result.status,
        error: result.error,
        loading: result.loading
      };
    });

    setPrinterStatuses(statusMap);
  };

  // Printer Status enum'ları (Backend PrinterStatus enum ile uyumlu)
  // Printing = 0, Ready = 1, Offline = 2, Error = 3
  const getPrinterStatusText = (statusCode) => {
    switch (statusCode) {
      case 0:
        return { text: 'Yazdırıyor', color: '#3b82f6', icon: Activity };
      case 1:
        return { text: 'Hazır', color: '#10b981', icon: CheckCircle };
      case 2:
        return { text: 'Kapalı', color: '#6b7280', icon: XCircle };
      case 3:
        return { text: 'Hata', color: '#ef4444', icon: AlertCircle };
      default:
        return { text: 'Bilinmiyor', color: '#6b7280', icon: AlertCircle };
    }
  };

  // MessageFieldType enum'ları ve görsel özellikleri
  // Text = 0, Variable = 1, Date = 2, Time = 3, Counter = 4, Logo = 5, Unknown = 6
  const getFieldTypeInfo = (fieldType) => {
    switch (fieldType) {
      case 0: // Text
        return {
          name: 'Metin',
          icon: Type,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800'
        };
      case 1: // Variable
        return {
          name: 'Değişken',
          icon: BarChart3,
          color: 'text-cyan-600 dark:text-cyan-400',
          bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
          borderColor: 'border-cyan-200 dark:border-cyan-800'
        };
      case 2: // Date
        return {
          name: 'Tarih',
          icon: Calendar,
          color: 'text-purple-600 dark:text-purple-400',
          bgColor: 'bg-purple-50 dark:bg-purple-900/20',
          borderColor: 'border-purple-200 dark:border-purple-800'
        };
      case 3: // Time
        return {
          name: 'Saat',
          icon: Clock,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800'
        };
      case 4: // Counter
        return {
          name: 'Sayaç',
          icon: Hash,
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800'
        };
      case 5: // Logo
        return {
          name: 'Logo',
          icon: Image,
          color: 'text-pink-600 dark:text-pink-400',
          bgColor: 'bg-pink-50 dark:bg-pink-900/20',
          borderColor: 'border-pink-200 dark:border-pink-800'
        };
      case 6: // Unknown
      default:
        return {
          name: 'Bilinmiyor',
          icon: HelpCircle,
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-800',
          borderColor: 'border-gray-200 dark:border-gray-700'
        };
    }
  };

  // İstatistikleri hesapla
  const calculateStats = () => {
    const total = activePrinters.length;
    let ready = 0, printing = 0, offline = 0, errorCount = 0;

    Object.entries(printerStatuses).forEach(([, statusData]) => {
      if (statusData.error) {
        // API isteği başarısız oldu, hata olarak say
        errorCount++;
      } else if (!statusData.data) {
        // Data yok ama hata da yok, offline say
        offline++;
      } else {
        switch (statusData.data.printerStatus) {
          case 0:
            printing++;
            break;
          case 1:
            ready++;
            break;
          case 2:
            offline++;
            break;
          case 3:
            errorCount++;
            break;
          default:
            offline++;
        }
      }
    });

    return { total, ready, printing, offline, error: errorCount };
  };

  const stats = calculateStats();

  // Loading durumu
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-transparent flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={48} className="mx-auto text-gray-400 mb-4 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Yazıcılar yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Error durumu
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-transparent p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={24} />
            <div className="flex-1">
              <p className="text-red-800 dark:text-red-200 font-medium">Hata</p>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
            <button
              onClick={loadActivePrinters}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
            >
              <RefreshCw size={16} />
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Aktif yazıcıların anlık durumlarını izleyin
              </p>
            </div>
            <button
              onClick={loadActivePrinters}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
            >
              <RefreshCw size={20} />
              <span className="hidden sm:inline">Yenile</span>
            </button>
          </div>

          {/* Filter Section */}
          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md border border-gray-200 dark:border-gray-700/50 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Yazıcı Filtresi</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ({selectedPrinterIds.size === 0 ? 'Tümü' : `${selectedPrinterIds.size} seçili`})
                </span>
              </div>
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
              >
                {showFilterPanel ? 'Gizle' : 'Göster'}
              </button>
            </div>

            {showFilterPanel && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={toggleSelectAll}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    {selectedPrinterIds.size === activePrinters.length ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                  </button>
                  {selectedPrinterIds.size > 0 && (
                    <button
                      onClick={() => setSelectedPrinterIds(new Set())}
                      className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      Filtreyi Temizle
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                  {activePrinters.map(printer => (
                    <label
                      key={printer.id}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPrinterIds.has(printer.id)}
                        onChange={() => togglePrinterSelection(printer.id)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                        {printer.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700/50">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Printer size={20} className="text-gray-600 dark:text-gray-400 sm:w-6 sm:h-6" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Aktif</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700/50">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Activity size={20} className="text-blue-600 dark:text-blue-400 sm:w-6 sm:h-6" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Yazdırıyor</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{stats.printing}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700/50">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle size={20} className="text-green-600 dark:text-green-400 sm:w-6 sm:h-6" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Hazır</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{stats.ready}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700/50">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <XCircle size={20} className="text-gray-600 dark:text-gray-400 sm:w-6 sm:h-6" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Kapalı</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{stats.offline}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700/50">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertCircle size={20} className="text-red-600 dark:text-red-400 sm:w-6 sm:h-6" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Hata</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">{stats.error}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Printer Status Cards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Yazıcı Durumları</h2>

          {activePrinters.length === 0 ? (
            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md p-12 text-center border border-gray-200 dark:border-gray-700/50">
              <Printer size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Aktif yazıcı bulunamadı</p>
            </div>
          ) : getFilteredPrinters(activePrinters).length === 0 ? (
            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md p-12 text-center border border-gray-200 dark:border-gray-700/50">
              <Filter size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Seçili yazıcı bulunamadı</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Lütfen yukarıdan yazıcı seçin</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {getFilteredPrinters(activePrinters).map(printer => {
                const statusData = printerStatuses[printer.id];
                const hasError = statusData?.error;
                const isLoading = !statusData;
                const printerStatus = statusData?.data;
                const statusInfo = printerStatus ? getPrinterStatusText(printerStatus.printerStatus) : null;
                const StatusIcon = statusInfo?.icon || AlertCircle;

                return (
                  <div
                    key={printer.id}
                    className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md border border-gray-200 dark:border-gray-700/50 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Card Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-700/30">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            hasError ? 'bg-red-100 dark:bg-red-900/30' :
                            isLoading ? 'bg-gray-100 dark:bg-gray-700' :
                            printerStatus?.printerStatus === 0 ? 'bg-blue-100 dark:bg-blue-900/30' :
                            printerStatus?.printerStatus === 1 ? 'bg-green-100 dark:bg-green-900/30' :
                            printerStatus?.printerStatus === 3 ? 'bg-red-100 dark:bg-red-900/30' :
                            'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            {isLoading ? (
                              <RefreshCw size={20} className="text-gray-600 dark:text-gray-400 animate-spin" />
                            ) : (
                              <Printer size={20} className={
                                hasError ? 'text-red-600 dark:text-red-400' :
                                printerStatus?.printerStatus === 0 ? 'text-blue-600 dark:text-blue-400' :
                                printerStatus?.printerStatus === 1 ? 'text-green-600 dark:text-green-400' :
                                printerStatus?.printerStatus === 3 ? 'text-red-600 dark:text-red-400' :
                                'text-gray-600 dark:text-gray-400'
                              } />
                            )}
                          </div>
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                              {statusData?.name || printer.name || 'Yükleniyor...'}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1" style={{ wordBreak: 'break-all' }}>
                              ID: {printer.id.substring(0, 8)}...
                            </p>
                            {printerStatus?.lastUpdated && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {new Date(printerStatus.lastUpdated).toLocaleTimeString('tr-TR')}
                              </p>
                            )}
                          </div>
                        </div>
                        {!isLoading && (
                          <span
                            className="px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1"
                            style={{ backgroundColor: hasError ? '#ef4444' : statusInfo?.color }}
                          >
                            {hasError ? (
                              <>
                                <WifiOff size={12} />
                                Bağlantı Hatası
                              </>
                            ) : (
                              <>
                                <StatusIcon size={12} />
                                {statusInfo?.text}
                              </>
                            )}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-4">
                      {isLoading && (
                        <div className="text-center py-4">
                          <RefreshCw size={32} className="mx-auto text-gray-400 mb-2 animate-spin" />
                          <p className="text-sm text-gray-500 dark:text-gray-400">Durum sorgulanıyor...</p>
                        </div>
                      )}

                      {hasError && (
                        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg overflow-hidden">
                          <AlertCircle size={16} className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-red-700 dark:text-red-300" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                            {statusData.error}
                          </span>
                        </div>
                      )}

                      {!isLoading && !hasError && printerStatus && (
                        <>
                          {/* Active Template */}
                          {printerStatus.activeTemplate && printerStatus.activeTemplate.name ? (
                            <div className="space-y-3">
                              {/* Template Header */}
                              <div className="flex items-center gap-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                                <FileText size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                                    Aktif Şablon
                                  </p>
                                  <p className="text-base font-semibold text-gray-800 dark:text-white" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                                    {printerStatus.activeTemplate.name}
                                  </p>
                                  {printerStatus.activeTemplate.content && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                                      {printerStatus.activeTemplate.content}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Lines - Her satır için ayrı card */}
                              {printerStatus.activeTemplate.lines && printerStatus.activeTemplate.lines.length > 0 ? (
                                <div className="space-y-3">
                                  {printerStatus.activeTemplate.lines.map((line) => {
                                    const isExpanded = isLineExpanded(printer.id, line.lineNumber);
                                    return (
                                      <div
                                        key={line.lineNumber}
                                        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800/50 overflow-hidden"
                                      >
                                        {/* Line Header with LineContent */}
                                        <div className="p-4">
                                          <div className="flex items-center gap-2 mb-2">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex-shrink-0">
                                              {line.lineNumber}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-800 dark:text-white" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                                              {line.lineName || `Satır ${line.lineNumber}`}
                                            </span>
                                          </div>

                                          {/* LineContent - Ana içerik */}
                                          {line.lineContent && (
                                            <div className="mt-2 p-3 bg-white/60 dark:bg-gray-800/40 rounded-lg border border-blue-100 dark:border-blue-700/30">
                                              <p className="text-base font-medium text-gray-800 dark:text-white" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                                                {line.lineContent}
                                              </p>
                                            </div>
                                          )}
                                        </div>

                                        {/* Fields Accordion Toggle */}
                                        {line.fields && line.fields.length > 0 && (
                                          <>
                                            <button
                                              onClick={() => toggleLineExpand(printer.id, line.lineNumber)}
                                              className="w-full flex items-center justify-between px-4 py-2 bg-blue-100/50 dark:bg-blue-800/30 border-t border-blue-200 dark:border-blue-700/50 hover:bg-blue-100 dark:hover:bg-blue-800/50 transition-all"
                                            >
                                              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                                Detaylar ({line.fields.length} alan)
                                              </span>
                                              {isExpanded ? (
                                                <ChevronUp size={18} className="text-blue-600 dark:text-blue-400" />
                                              ) : (
                                                <ChevronDown size={18} className="text-blue-600 dark:text-blue-400" />
                                              )}
                                            </button>

                                            {/* Collapsible Fields Section */}
                                            {isExpanded && (
                                              <div className="p-4 pt-3 border-t border-blue-200 dark:border-blue-700/50 bg-white/30 dark:bg-gray-800/20">
                                                <div className="space-y-2">
                                                  {line.fields.map((field, fieldIndex) => {
                                                    const fieldInfo = getFieldTypeInfo(field.fieldType);
                                                    const FieldIcon = fieldInfo.icon;
                                                    return (
                                                      <div
                                                        key={fieldIndex}
                                                        className={`flex items-start gap-2 p-3 rounded-lg border ${fieldInfo.bgColor} ${fieldInfo.borderColor}`}
                                                      >
                                                        <FieldIcon size={16} className={`${fieldInfo.color} flex-shrink-0 mt-0.5`} />
                                                        <div className="flex-1 min-w-0 overflow-hidden">
                                                          <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                                                            <span className={`text-xs font-medium ${fieldInfo.color}`} style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                                                              {field.name}
                                                            </span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap px-2 py-0.5 bg-white/50 dark:bg-gray-800/50 rounded">
                                                              {fieldInfo.name}
                                                            </span>
                                                          </div>
                                                          <p className="text-sm font-semibold text-gray-800 dark:text-white" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                                                            {field.value || '-'}
                                                          </p>
                                                        </div>
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              </div>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    Şablon satırı bulunamadı
                                  </p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-200 dark:border-gray-600/50">
                              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                                Aktif şablon yok
                              </p>
                            </div>
                          )}

                          {/* Levels */}
                          <div className="space-y-3">
                            {/* Ink Level */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Droplet size={16} className="text-cyan-500" />
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Mürekkep Seviyesi
                                  </span>
                                </div>
                                <span className={`text-sm font-semibold ${
                                  printerStatus.inkLevel < 20 ? 'text-red-600 dark:text-red-400' :
                                  printerStatus.inkLevel < 50 ? 'text-yellow-600 dark:text-yellow-400' :
                                  'text-green-600 dark:text-green-400'
                                }`}>
                                  {printerStatus.inkLevel}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-900 rounded-full h-2.5 overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${printerStatus.inkLevel}%`,
                                    backgroundColor: printerStatus.inkLevel < 20 ? '#ef4444' :
                                                   printerStatus.inkLevel < 50 ? '#f59e0b' : '#10b981'
                                  }}
                                />
                              </div>
                            </div>

                            {/* Solvent Level */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Beaker size={16} className="text-purple-500" />
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Solvent Seviyesi
                                  </span>
                                </div>
                                <span className={`text-sm font-semibold ${
                                  printerStatus.solventLevel < 20 ? 'text-red-600 dark:text-red-400' :
                                  printerStatus.solventLevel < 50 ? 'text-yellow-600 dark:text-yellow-400' :
                                  'text-green-600 dark:text-green-400'
                                }`}>
                                  {printerStatus.solventLevel}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 dark:bg-gray-900 rounded-full h-2.5 overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${printerStatus.solventLevel}%`,
                                    backgroundColor: printerStatus.solventLevel < 20 ? '#ef4444' :
                                                   printerStatus.solventLevel < 50 ? '#f59e0b' : '#10b981'
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
