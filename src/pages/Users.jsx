import { useState, useEffect } from 'react';
import { UserRoles, getRoleName, getRoleOptions, getRoleOptionsWithoutSuperAdmin } from '../constants/userRoles';
import userService from '../services/userService';
import {
  User,
  Edit,
  Trash2,
  Plus,
  X,
  Save,
  Search,
  Shield,
  ShieldCheck,
  Eye,
  RefreshCw,
  AlertCircle,
  Key
} from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: UserRoles.VIEWER
  });

  // Kullanıcıları yükle
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAllUsers();
      setUsers(data || []);
    } catch (err) {
      setError(err.message || 'Kullanıcılar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setFormData({
      username: user.username,
      password: '',
      confirmPassword: '',
      role: user.role
    });
  };

  const handleSave = async (id) => {
    try {
      // Şifre kontrolü
      if (formData.password && formData.password !== formData.confirmPassword) {
        alert('Şifreler eşleşmiyor!');
        return;
      }

      setLoading(true);

      const updatedData = {
        username: formData.username,
        passwordHash: formData.password || '', // Boşsa backend mevcut şifreyi kullanır
        role: formData.role
      };

      await userService.updateUser(id, updatedData);

      setEditingUser(null);
      resetForm();

      // İşlem başarılı, sayfayı yenile
      await loadUsers();
    } catch (err) {
      alert(err.message || 'Kullanıcı güncellenirken bir hata oluştu');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        setLoading(true);
        await userService.deleteUser(id);

        // İşlem başarılı, sayfayı yenile
        await loadUsers();
      } catch (err) {
        alert(err.message || 'Kullanıcı silinirken bir hata oluştu');
        setLoading(false);
      }
    }
  };

  const handleAddUser = async () => {
    try {
      // Validasyon
      if (!formData.username || !formData.password) {
        alert('Kullanıcı adı ve şifre zorunludur!');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert('Şifreler eşleşmiyor!');
        return;
      }

      setLoading(true);

      const newUserData = {
        username: formData.username,
        passwordHash: formData.password,
        role: formData.role
      };

      await userService.addUser(newUserData);

      setIsAddingUser(false);
      resetForm();

      // İşlem başarılı, sayfayı yenile
      await loadUsers();
    } catch (err) {
      alert(err.message || 'Kullanıcı eklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      confirmPassword: '',
      role: UserRoles.VIEWER
    });
    setIsAddingUser(false);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case UserRoles.SUPERADMIN:
        return <ShieldCheck size={16} className="text-purple-600 dark:text-purple-400" />;
      case UserRoles.ADMIN:
        return <Shield size={16} className="text-blue-600 dark:text-blue-400" />;
      case UserRoles.VIEWER:
        return <Eye size={16} className="text-gray-600 dark:text-gray-400" />;
      default:
        return <User size={16} />;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case UserRoles.SUPERADMIN:
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case UserRoles.ADMIN:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case UserRoles.VIEWER:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-transparent p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Kullanıcı Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kullanıcıları yönetin ve yetkilendirin
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={24} />
            <div className="flex-1">
              <p className="text-red-800 dark:text-red-200 font-medium">Hata</p>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
            <button
              onClick={loadUsers}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
            >
              <RefreshCw size={16} />
              Tekrar Dene
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md p-4 sm:p-6 mb-6 border border-gray-200 dark:border-gray-700/50">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Kullanıcı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600/50 rounded-lg bg-white dark:bg-gray-700/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Filter and Add Button */}
            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="flex-1 sm:flex-initial px-4 py-2 border border-gray-300 dark:border-gray-600/50 rounded-lg bg-white dark:bg-gray-700/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="all">Tüm Roller</option>
                {getRoleOptions().map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setIsAddingUser(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all whitespace-nowrap"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Yeni Kullanıcı</span>
              </button>
            </div>
          </div>
        </div>

        {/* Add/Edit User Form */}
        {(isAddingUser || editingUser) && (
          <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                {isAddingUser ? 'Yeni Kullanıcı Ekle' : 'Kullanıcıyı Düzenle'}
              </h3>
              <button
                onClick={() => {
                  setIsAddingUser(false);
                  setEditingUser(null);
                  resetForm();
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Kullanıcı Adı */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kullanıcı Adı *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600/50 rounded-lg bg-white dark:bg-gray-700/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="kullanici_adi"
                />
              </div>

              {/* Rol */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rol *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600/50 rounded-lg bg-white dark:bg-gray-700/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {getRoleOptionsWithoutSuperAdmin().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {getRoleOptionsWithoutSuperAdmin().find(opt => opt.value === formData.role)?.description}
                </p>
              </div>

              {/* Şifre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Şifre {isAddingUser ? '*' : '(Boş bırakılabilir)'}
                </label>
                <div className="relative">
                  <Key size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600/50 rounded-lg bg-white dark:bg-gray-700/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Şifre Tekrar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Şifre Tekrar {isAddingUser ? '*' : '(Boş bırakılabilir)'}
                </label>
                <div className="relative">
                  <Key size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600/50 rounded-lg bg-white dark:bg-gray-700/50 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={isAddingUser ? handleAddUser : () => handleSave(editingUser)}
              disabled={!formData.username || (isAddingUser && !formData.password)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
            >
              <Save size={20} />
              Kaydet
            </button>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800/50 rounded-xl shadow-md border border-gray-200 dark:border-gray-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden md:table-cell">
                    Rol
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider hidden lg:table-cell">
                    Oluşturulma Tarihi
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User size={18} className="text-gray-400 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-gray-800 dark:text-white">{user.username}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400 md:hidden">
                            {getRoleName(user.role)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md ${getRoleBadgeClass(user.role)}`}>
                        {getRoleIcon(user.role)}
                        {getRoleName(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-all"
                          title="Düzenle"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
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
            {loading && filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <RefreshCw size={48} className="mx-auto text-gray-400 mb-4 animate-spin" />
                <p className="text-gray-600 dark:text-gray-400">Kullanıcılar yükleniyor...</p>
              </div>
            )}
            {!loading && filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <User size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Kullanıcı bulunamadı</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
