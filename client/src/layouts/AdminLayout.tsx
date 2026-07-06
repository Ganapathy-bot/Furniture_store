import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuth, getUser } from '../ducks/auth';
import * as authService from '../services/authService';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(getUser);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // proceed with local logout
    }
    dispatch(clearAuth());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-charcoal text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="font-display text-xl font-bold">
              FurniStore <span className="text-terracotta">Admin</span>
            </Link>
            <nav className="hidden gap-4 sm:flex">
              <Link to="/admin" className="text-sm text-white/80 hover:text-white">
                Dashboard
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/70">{user?.name}</span>
            <Link to="/" className="text-sm text-white/80 hover:text-white">
              Store
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-terracotta px-3 py-1.5 text-sm font-medium hover:bg-terracotta/90"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;