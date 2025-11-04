import { useState } from 'react';
import { mockPrinters, ProtocolTypes, getProtocolTypeName } from '../data/mockData';
import {
  Printer,
  Edit,
  Trash2,
  Plus,
  X,
  Save,
  Search,
  Power,
  PowerOff
} from 'lucide-react';

const Printers = () => {
  const [printers, setPrinters] = useState(mockPrinters);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');
  const [isAddingPrinter, setIsAddingPrinter] = useState(false);
  const [editingPrinter, setEditingPrinter] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    protocolType: 0,
    address: '',
    port: 9100,
    dllPath: ''
  });

  const filteredPrinters = printers.filter(printer => {
    const matchesSearch = printer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         printer.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         printer.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === 'all' ||
                         (filterActive === 'active' && printer.isActive) ||
                         (filterActive === 'inactive' && !printer.isActive);
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (printer) => {
    setEditingPrinter(printer.id);
    setFormData({
      name: printer.name,
      model: printer.model,
      protocolType: printer.protocolType,
      address: printer.address,
      port: printer.port || 9100,
      dllPath: printer.dllPath || ''
    });
  };

  const handleSave = (id) => {
    setPrinters(printers.map(p =>
      p.id === id
        ? {
            ...p,
            name: formData.name,
            model: formData.model,
            protocolType: parseInt(formData.protocolType),
            address: formData.address,
            port: formData.port ? parseInt(formData.port) : null,
            dllPath: formData.dllPath || null
          }
        : p
    ));
    setEditingPrinter(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu yazıcıyı silmek istediğinizden emin misiniz?')) {
      setPrinters(printers.filter(p => p.id !== id));
    }
  };

  const handleToggleActive = (id) => {
    setPrinters(printers.map(p =>
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const handleAddPrinter = () => {
    const newPrinter = {
      id: crypto.randomUUID(),
      name: formData.name,
      model: formData.model,
      protocolType: parseInt(formData.protocolType),
      address: formData.address,
      port: formData.port ? parseInt(formData.port) : null,
      dllPath: formData.dllPath || null,
      isActive: false
    };
    setPrinters([...printers, newPrinter]);
    setIsAddingPrinter(false);
    setFormData({
      name: '',
      model: '',
      protocolType: 0,
      address: '',
      port: 9100,
      dllPath: ''
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      model: '',
      protocolType: 0,
      address: '',
      port: 9100,
      dllPath: ''
    });
    setIsAddingPrinter(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Yazıcı Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Yazıcılarınızı yapılandırın ve yönetin
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md p-4 sm:p-6 mb-6 border border-gray-200 dark:border-gray-700/50">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Yazıcı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600/50 rounded-lg bg-white dark:bg-gray-700/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Filter and Add Button */}
            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
                className="flex-1 sm:flex-initial px-4 py-2 border border-gray-300 dark:border-gray-600/50 rounded-lg bg-white dark:bg-gray-700/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">Tümü</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
              </select>
              <button
                onClick={() => setIsAddingPrinter(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all whitespace-nowrap"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Yeni Yazıcı</span>
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit Printer Form */}
        {(isAddingPrinter || editingPrinter) && (
          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {isAddingPrinter ? 'Yeni Yazıcı Ekle' : 'Yazıcıyı Düzenle'}
              </h3>
              <button
                onClick={() => {
                  setIsAddingPrinter(false);
                  setEditingPrinter(null);
                  resetForm();
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Yazıcı Adı */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Yazıcı Adı *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600/50 rounded-lg bg-white dark:bg-gray-700/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Örn: Üretim Hattı Yazıcı 1"
                />
              </div>

              {/* Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600/50 rounded-lg bg-white dark:bg-gray-700/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Örn: Industrial Printer X1000"
                />
              </div>

              {/* Protocol Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Protokol Tipi *
                </label>
                <select
                  value={formData.protocolType}
                  onChange={(e) => setFormData({ ...formData, protocolType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600/50 rounded-lg bg-white dark:bg-gray-700/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {Object.entries(ProtocolTypes).map(([key, value]) => (
                    <option key={key} value={key}>{value}</option>
                  ))}
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Adres *
                  <span className="text-xs text-gray-500 ml-1">
                    ({parseInt(formData.protocolType) === 0 ? 'IP Adresi' :
                      parseInt(formData.protocolType) === 1 ? 'USB Port' :
                      parseInt(formData.protocolType) === 2 ? 'COM Port' : 'Boş bırakılabilir'})
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600/50 rounded-lg bg-white dark:bg-gray-700/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder={
                    parseInt(formData.protocolType) === 0 ? '192.168.1.100' :
                    parseInt(formData.protocolType) === 1 ? 'USB001' :
                    parseInt(formData.protocolType) === 2 ? 'COM1' : ''
                  }
                />
              </div>

              {/* Port (sadece TCP/IP için) */}
              {parseInt(formData.protocolType) === 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Port
                  </label>
                  <input
                    type="number"
                    value={formData.port}
                    onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600/50 rounded-lg bg-white dark:bg-gray-700/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="9100"
                  />
                </div>
              )}

              {/* DLL Path (sadece Custom DLL için) */}
              {parseInt(formData.protocolType) === 3 && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    DLL Dosya Yolu
                  </label>
                  <input
                    type="text"
                    value={formData.dllPath}
                    onChange={(e) => setFormData({ ...formData, dllPath: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600/50 rounded-lg bg-white dark:bg-gray-700/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="C:\Printers\CustomDriver.dll"
                  />
                </div>
              )}
            </div>

            <button
              onClick={isAddingPrinter ? handleAddPrinter : () => handleSave(editingPrinter)}
              disabled={!formData.name || !formData.model || !formData.address}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
            >
              <Save size={20} />
              Kaydet
            </button>
          </div>
        )}

        {/* Printers Table */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md border border-gray-200 dark:border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Yazıcı
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                    Protokol
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                    Adres
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden xl:table-cell">
                    Port
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPrinters.map(printer => (
                  <tr key={printer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Printer size={18} className="text-gray-400 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-gray-800 dark:text-white">{printer.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{printer.model}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        {getProtocolTypeName(printer.protocolType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {printer.address || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden xl:table-cell">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {printer.port || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(printer.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          printer.isActive
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        title={printer.isActive ? 'Pasif yap' : 'Aktif yap'}
                      >
                        {printer.isActive ? <Power size={14} /> : <PowerOff size={14} />}
                        {printer.isActive ? 'Aktif' : 'Pasif'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(printer)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-all"
                          title="Düzenle"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(printer.id)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all"
                          title="Sil"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredPrinters.length === 0 && (
              <div className="text-center py-12">
                <Printer size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Yazıcı bulunamadı</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Printers;
