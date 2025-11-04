import { useState, useEffect } from 'react';
import { mockPrinterStatus, getPrinterStatusInfo } from '../data/mockData';
import {
  Printer,
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Droplet,
  Beaker
} from 'lucide-react';

const Dashboard = () => {
  const [printerStatuses, setPrinterStatuses] = useState(mockPrinterStatus);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrinterStatuses(current =>
        current.map(printer => ({
          ...printer,
          inkLevel: printer.status === 'printing'
            ? Math.max(0, printer.inkLevel - Math.random() * 0.5)
            : printer.inkLevel,
          solventLevel: printer.status === 'printing'
            ? Math.max(0, printer.solventLevel - Math.random() * 0.3)
            : printer.solventLevel,
          lastUpdated: new Date().toISOString()
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: printerStatuses.length,
    printing: printerStatuses.filter(p => p.status === 'printing').length,
    ready: printerStatuses.filter(p => p.status === 'ready').length,
    offline: printerStatuses.filter(p => p.status === 'offline').length,
    error: printerStatuses.filter(p => p.status === 'error').length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Yazıcıların anlık durumlarını izleyin
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700/50">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Printer size={20} className="text-gray-600 dark:text-gray-400 sm:w-6 sm:h-6" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Toplam</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {printerStatuses.map(printer => {
              const statusInfo = getPrinterStatusInfo(printer.status);
              return (
                <div
                  key={printer.printerId}
                  className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md border border-gray-200 dark:border-gray-700/50 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-700/30">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          printer.status === 'printing' ? 'bg-blue-100 dark:bg-blue-900/30' :
                          printer.status === 'ready' ? 'bg-green-100 dark:bg-green-900/30' :
                          printer.status === 'error' ? 'bg-red-100 dark:bg-red-900/30' :
                          'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <Printer size={20} className={
                            printer.status === 'printing' ? 'text-blue-600 dark:text-blue-400' :
                            printer.status === 'ready' ? 'text-green-600 dark:text-green-400' :
                            printer.status === 'error' ? 'text-red-600 dark:text-red-400' :
                            'text-gray-600 dark:text-gray-400'
                          } />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                            {printer.printerName}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(printer.lastUpdated).toLocaleTimeString('tr-TR')}
                          </p>
                        </div>
                      </div>
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: statusInfo.color }}
                      >
                        {statusInfo.text}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Active Template */}
                    {printer.activeTemplate ? (
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-2 mb-2">
                          <FileText size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">
                              Aktif Şablon
                            </p>
                            <p className="text-sm font-semibold text-gray-800 dark:text-white">
                              {printer.activeTemplate.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {printer.activeTemplate.content}
                            </p>
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
                            printer.inkLevel < 20 ? 'text-red-600 dark:text-red-400' :
                            printer.inkLevel < 50 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-green-600 dark:text-green-400'
                          }`}>
                            {printer.inkLevel.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-900 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${printer.inkLevel}%`,
                              backgroundColor: printer.inkLevel < 20 ? '#ef4444' :
                                             printer.inkLevel < 50 ? '#f59e0b' : '#10b981'
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
                            printer.solventLevel < 20 ? 'text-red-600 dark:text-red-400' :
                            printer.solventLevel < 50 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-green-600 dark:text-green-400'
                          }`}>
                            {printer.solventLevel.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-900 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${printer.solventLevel}%`,
                              backgroundColor: printer.solventLevel < 20 ? '#ef4444' :
                                             printer.solventLevel < 50 ? '#f59e0b' : '#10b981'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Error Message */}
                    {printer.errorMessage && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <AlertCircle size={16} className="text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-red-700 dark:text-red-300">
                          {printer.errorMessage}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
