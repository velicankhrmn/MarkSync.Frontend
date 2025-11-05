import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Cookie'den kullanıcı bilgilerini al
    return authService.getCurrentUser();
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Component mount olduğunda kullanıcı bilgilerini kontrol et
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  /**
   * Kullanıcı girişi
   * @param {string} username - Kullanıcı adı
   * @param {string} password - Şifre
   * @returns {Promise<boolean>} - Başarılı ise true, değilse false
   */
  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(username, password);

      // API yanıtı: { username, role, token }
      const userData = {
        username: response.username,
        name: response.username, // Backend'de name yoksa username kullan
        role: response.role,
      };

      setUser(userData);
      setLoading(false);
      return true;
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Giriş başarısız');
      console.error('Login error:', err);
      return false;
    }
  };

  /**
   * Kullanıcı çıkışı
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
