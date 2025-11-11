import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  // Token ve kullanıcı bilgisi kontrolü
  const isAuthenticated = authService.isAuthenticated();

  if (!user || !isAuthenticated) {
    // Token yoksa veya geçersizse login sayfasına yönlendir
    return <Navigate to="/login" replace />;
  }

  // Rol kontrolü
  if (requiredRole && user.role !== requiredRole) {
    // Gerekli role sahip değilse dashboard'a yönlendir
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
