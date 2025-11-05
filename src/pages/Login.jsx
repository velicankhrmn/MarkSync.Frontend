import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { LogIn, User, Lock } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Kullanıcı zaten giriş yapmışsa dashboard'a yönlendir
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Lütfen kullanıcı adı ve şifre giriniz');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Giriş başarısız. Lütfen kullanıcı adı ve şifrenizi kontrol ediniz.');
      }
    } catch (err) {
      setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="bg-white dark:bg-gray-800/70 rounded-2xl shadow-2xl p-8 sm:p-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <img src="/3SINK-LOGO.png" alt="3SINK Logo" className="h-16 w-auto mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            MarkSync Yönetim Paneli
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Yazıcı yönetim sistemine hoş geldiniz
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <User size={18} />
              Kullanıcı Adı
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600/50 bg-white dark:bg-gray-700/50 text-gray-800 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
              placeholder="Kullanıcı adınızı giriniz"
              autoComplete="username"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              <Lock size={18} />
              Şifre
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600/50 bg-white dark:bg-gray-700/50 text-gray-800 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none"
              placeholder="Şifrenizi giriniz"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 mt-6"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Giriş Yapılıyor...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Giriş Yap
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700/50">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Giriş yapmak için kullanıcı adı ve şifrenizi giriniz
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
