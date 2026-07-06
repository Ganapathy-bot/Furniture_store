import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isAuthenticated, isAdmin } from '../ducks/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const location = useLocation();
  const authenticated = useSelector(isAuthenticated);
  const admin = useSelector(isAdmin);

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !admin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;