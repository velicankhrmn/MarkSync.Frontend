import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Moon, Sun, LogOut, Menu, X, Printer, LayoutDashboard, Users, UserCircle, Shield, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // User menüsü dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800/60 dark:backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          {/* Logo */}
          <Link to="https://3sink.com" className="flex-shrink-0">
            <img src="/3SINK-LOGO.png" alt="3SINK Logo" className="h-14 sm:h-16 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-2 flex-1 ml-8">
            <Link
              to="/dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/dashboard')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/printers"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                isActive('/printers')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
            >
              <Printer size={20} />
              <span>Yazıcılar</span>
            </Link>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3">
            {/* User Info with Dropdown - Hidden on mobile */}
            <div className="hidden sm:block relative" ref={userMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600/50 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all"
              >
                <UserCircle size={20} className="text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{user.name}</span>
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center gap-2 mb-1">
                      <UserCircle size={24} className="text-gray-600 dark:text-gray-400" />
                      <span className="font-semibold text-gray-800 dark:text-white">{user.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <Shield size={14} />
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      to="/users"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all"
                    >
                      <Users size={16} />
                      <span>Kullanıcı Yönetimi</span>
                    </Link>
                    {user.role === 'superadmin' && (
                      <Link
                        to="/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all"
                      >
                        <Settings size={16} />
                        <span>Gizli Ayarlar</span>
                      </Link>
                    )}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                    >
                      <LogOut size={16} />
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle - Hidden on mobile */}
            <button
              className="hidden sm:flex items-center justify-center p-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600/50 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-all"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden flex items-center justify-center p-2 text-gray-700 dark:text-gray-200"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/dashboard"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                isActive('/dashboard')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/printers"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                isActive('/printers')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Printer size={20} />
              <span>Yazıcılar</span>
            </Link>
            <Link
              to="/users"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                isActive('/users')
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Users size={20} />
              <span>Kullanıcılar</span>
            </Link>
            {user.role === 'superadmin' && (
              <Link
                to="/settings"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive('/settings')
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings size={20} />
                <span>Gizli Ayarlar</span>
              </Link>
            )}
            <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700/50 flex items-center gap-2">
              <button
                className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-gray-700 dark:text-gray-200"
                onClick={() => {
                  toggleTheme();
                  setIsMobileMenuOpen(false);
                }}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
                <span className="text-sm">{isDark ? 'Açık Mod' : 'Koyu Mod'}</span>
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                <span className="text-sm">Çıkış</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
