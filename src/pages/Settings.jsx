import { useState, useEffect } from 'react';
import settingsService from '../services/settingsService';
import { Settings as SettingsIcon, Save, RefreshCw, Clock, ToggleLeft, ToggleRight } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    refreshInterval: 30, // saniye cinsinden
    autoRefreshEnabled: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.getSettings();
      setSettings({
        refreshInterval: data.refreshInterval || 30,
        autoRefreshEnabled: data.autoRefreshEnabled || false
      });
    } catch (err) {
      setError(err.message || 'Ayarlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage('');

      // Validasyon
      if (settings.refreshInterval < 5) {
        setError('Yenilenme süresi en az 5 saniye olmalıdır');
        setSaving(false);
        return;
      }

      if (settings.refreshInterval > 3600) {
        setError('Yenilenme süresi en fazla 3600 saniye (1 saat) olabilir');
        setSaving(false);
        return;
      }

      await settingsService.updateSettings(settings);
      setSuccessMessage('Ayarlar başarıyla kaydedildi');

      // Başarı mesajını 3 saniye sonra temizle
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Ayarlar kaydedilirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleRefreshIntervalChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setSettings({ ...settings, refreshInterval: value });
    }
  };

  const handleAutoRefreshToggle = () => {
    setSettings({ ...settings, autoRefreshEnabled: !settings.autoRefreshEnabled });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-transparent flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={48} className="mx-auto text-gray-400 mb-4 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Ayarlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <SettingsIcon size={32} className="text-gray-700 dark:text-gray-300" />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Gizli Ayarlar</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Sadece süper yöneticiler bu sayfayı görebilir ve düzenleyebilir.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-red-800 dark:text-red-200 font-medium">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <p className="text-green-800 dark:text-green-200 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Settings Form */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md border border-gray-200 dark:border-gray-700/50">
          <div className="p-6 space-y-6">
            {/* Refresh Interval Setting */}
            <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Clock size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                    Yenilenme Süresi
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Dashboard ekranında yazıcı durumlarının otomatik yenilenme aralığını belirleyin (saniye cinsinden).
                  </p>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      min="5"
                      max="3600"
                      value={settings.refreshInterval}
                      onChange={handleRefreshIntervalChange}
                      className="flex-1 max-w-xs px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      saniye
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Minimum: 5 saniye, Maksimum: 3600 saniye (1 saat)
                  </p>
                </div>
              </div>
            </div>

            {/* Auto Refresh Toggle Setting */}
            <div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  {settings.autoRefreshEnabled ? (
                    <ToggleRight size={20} className="text-green-600 dark:text-green-400" />
                  ) : (
                    <ToggleLeft size={20} className="text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                    Otomatik Yenileme
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Dashboard ekranında yazıcı durumlarının belirlenen sürede otomatik olarak yenilenmesini etkinleştirin veya devre dışı bırakın.
                  </p>
                  <button
                    onClick={handleAutoRefreshToggle}
                    className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors ${
                      settings.autoRefreshEnabled
                        ? 'bg-green-500'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform ${
                        settings.autoRefreshEnabled ? 'translate-x-11' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <p className="text-sm font-medium mt-2 text-gray-700 dark:text-gray-300">
                    Durum: {settings.autoRefreshEnabled ? (
                      <span className="text-green-600 dark:text-green-400">Aktif</span>
                    ) : (
                      <span className="text-gray-600 dark:text-gray-400">Pasif</span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-800 text-white rounded-lg transition-all font-medium"
              >
                {saving ? (
                  <>
                    <RefreshCw size={20} className="animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Kaydet
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Not:</strong> Bu ayarlar tüm sistem için geçerlidir ve değişiklikler anında uygulanır.
            Otomatik yenileme özelliği aktif edildiğinde, Dashboard ekranı belirlenen sürede bir güncellenir.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
