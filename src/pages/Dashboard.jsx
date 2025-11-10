import { useState, useEffect } from 'react';
import printerService from '../services/printerService';
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
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const [activePrinterIds, setActivePrinterIds] = useState([]);
  const [printerStatuses, setPrinterStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Aktif yazıcı ID'lerini yükle
  useEffect(() => {
    loadActivePrinters();
  }, []);

  const loadActivePrinters = async () => {
    try {
      setLoading(true);
      setError(null);

      // Aktif yazıcı ID'lerini al (API'den array of GUIDs döner)
      const activeIds = await printerService.getActivePrinterIds();
      setActivePrinterIds(activeIds || []);

      // Her aktif yazıcı için status bilgilerini al
      await loadPrinterStatuses(activeIds || []);
    } catch (err) {
      setError(err.message || 'Yazıcılar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Her yazıcı için ayrı ayrı status bilgisi al
  const loadPrinterStatuses = async (printerIds) => {
    const statusPromises = printerIds.map(async (printerId) => {
      try {
        const status = await printerService.getPrinterStatus(printerId);
        return {
          printerId: printerId,
          status: status,
          error: null,
          loading: false
        };
      } catch (error) {
        return {
          printerId: printerId,
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

  // Field Type enum'ları ve görsel özellikleri
  const getFieldTypeInfo = (fieldType) => {
    switch (fieldType) {
      case 0:
        return {
          name: 'Metin',
          icon: Type,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800'
        };
      case 1:
        return {
          name: 'Saat',
          icon: Clock,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800'
        };
      case 2:
        return {
          name: 'Tarih',
          icon: Calendar,
          color: 'text-purple-600 dark:text-purple-400',
          bgColor: 'bg-purple-50 dark:bg-purple-900/20',
          borderColor: 'border-purple-200 dark:border-purple-800'
        };
      case 3:
        return {
          name: 'Tarih/Saat',
          icon: Calendar,
          color: 'text-indigo-600 dark:text-indigo-400',
          bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
          borderColor: 'border-indigo-200 dark:border-indigo-800'
        };
      case 4:
        return {
          name: 'Sayaç',
          icon: Hash,
          color: 'text-orange-600 dark:text-orange-400',
          bgColor: 'bg-orange-50 dark:bg-orange-900/20',
          borderColor: 'border-orange-200 dark:border-orange-800'
        };
      case 5:
        return {
          name: 'Değişken',
          icon: BarChart3,
          color: 'text-cyan-600 dark:text-cyan-400',
          bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
          borderColor: 'border-cyan-200 dark:border-cyan-800'
        };
      default:
        return {
          name: 'Bilinmiyor',
          icon: Type,
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-800',
          borderColor: 'border-gray-200 dark:border-gray-700'
        };
    }
  };

  // İstatistikleri hesapla
  const calculateStats = () => {
    const total = activePrinterIds.length;
    let ready = 0, printing = 0, offline = 0, errorCount = 0;

    Object.entries(printerStatuses).forEach(([printerId, statusData]) => {
      if (statusData.error || !statusData.data) {
        offline++;
      } else {
        switch (statusData.data.printerStatus) {
          case 1:
            ready++;
            break;
          case 2:
            printing++;
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
        <div className="mb-8 flex items-center justify-between">
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

          {activePrinterIds.length === 0 ? (
            <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md p-12 text-center border border-gray-200 dark:border-gray-700/50">
              <Printer size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Aktif yazıcı bulunamadı</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {activePrinterIds.map(printerId => {
                const statusData = printerStatuses[printerId];
                const hasError = statusData?.error;
                const isLoading = !statusData;
                const printerStatus = statusData?.data;
                const statusInfo = printerStatus ? getPrinterStatusText(printerStatus.printerStatus) : null;
                const StatusIcon = statusInfo?.icon || AlertCircle;

                return (
                  <div
                    key={printerId}
                    className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md border border-gray-200 dark:border-gray-700/50 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Card Header */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-700/30">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            hasError ? 'bg-red-100 dark:bg-red-900/30' :
                            isLoading ? 'bg-gray-100 dark:bg-gray-700' :
                            printerStatus?.printerStatus === 2 ? 'bg-blue-100 dark:bg-blue-900/30' :
                            printerStatus?.printerStatus === 1 ? 'bg-green-100 dark:bg-green-900/30' :
                            printerStatus?.printerStatus === 3 ? 'bg-red-100 dark:bg-red-900/30' :
                            'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            {isLoading ? (
                              <RefreshCw size={20} className="text-gray-600 dark:text-gray-400 animate-spin" />
                            ) : (
                              <Printer size={20} className={
                                hasError ? 'text-red-600 dark:text-red-400' :
                                printerStatus?.printerStatus === 2 ? 'text-blue-600 dark:text-blue-400' :
                                printerStatus?.printerStatus === 1 ? 'text-green-600 dark:text-green-400' :
                                printerStatus?.printerStatus === 3 ? 'text-red-600 dark:text-red-400' :
                                'text-gray-600 dark:text-gray-400'
                              } />
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                              {printerStatus?.printerName || 'Yükleniyor...'}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              ID: {printerId.substring(0, 8)}...
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
                        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <AlertCircle size={16} className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-red-700 dark:text-red-300">
                            {statusData.error}
                          </span>
                        </div>
                      )}

                      {!isLoading && !hasError && printerStatus && (
                        <>
                          {/* Active Template */}
                          {printerStatus.activeTemplate && printerStatus.activeTemplate.name ? (
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                              <div className="flex items-start gap-2 mb-2">
                                <FileText size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
                                    Aktif Şablon
                                  </p>
                                  <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                    {printerStatus.activeTemplate.name}
                                  </p>
                                  {printerStatus.activeTemplate.content && (
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                      {printerStatus.activeTemplate.content}
                                    </p>
                                  )}
                                  {printerStatus.activeTemplate.fields && printerStatus.activeTemplate.fields.length > 0 && (
                                    <div className="mt-3">
                                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                                        Şablon İçeriği:
                                      </p>
                                      <div className="space-y-2">
                                        {printerStatus.activeTemplate.fields.map((field, index) => {
                                          const fieldInfo = getFieldTypeInfo(field.fieldType);
                                          const FieldIcon = fieldInfo.icon;
                                          return (
                                            <div
                                              key={index}
                                              className={`flex items-center gap-2 p-2 rounded-lg border ${fieldInfo.bgColor} ${fieldInfo.borderColor}`}
                                            >
                                              <FieldIcon size={14} className={fieldInfo.color} />
                                              <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                  <span className={`text-xs font-medium ${fieldInfo.color}`}>
                                                    {field.name}
                                                  </span>
                                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    ({fieldInfo.name})
                                                  </span>
                                                </div>
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                                                  {field.value}
                                                </p>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
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
