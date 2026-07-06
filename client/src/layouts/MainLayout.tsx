import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getItemCount } from '../ducks/cart';
import { clearAuth, getUser, isAuthenticated, isAdmin } from '../ducks/auth';
import * as authService from '../services/authService';

const MainLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = useSelector((state: { cart: { items: { quantity: number }[] } }) =>
    getItemCount(state)
  );
  const authenticated = useSelector(isAuthenticated);
  const admin = useSelector(isAdmin);
  const user = useSelector(getUser);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
      // proceed with local logout
    }
    dispatch(clearAuth());
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-sand/80 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="font-display text-2xl font-bold text-charcoal">
            Furni<span className="text-terracotta">Store</span>
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-charcoal/80 transition-colors hover:text-terracotta"
            >
              Shop
            </Link>
            <Link
              to="/cart"
              className="relative text-sm font-medium text-charcoal/80 transition-colors hover:text-terracotta"
            >
              Cart
              {cartCount > 0 && (
                <span className="absolute -right-4 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {admin && (
              <Link
                to="/admin"
                className="text-sm font-medium text-charcoal/80 transition-colors hover:text-terracotta"
              >
                Admin
              </Link>
            )}

            {authenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/orders"
                  className="text-sm font-medium text-charcoal/80 hover:text-terracotta"
                >
                  Orders
                </Link>
                <span className="hidden text-sm text-charcoal/60 sm:inline">
                  Hi, {user?.name?.split(' ')[0]}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm font-medium text-charcoal/80 hover:text-terracotta"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-charcoal/80 hover:text-terracotta"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-terracotta px-3 py-1.5 text-sm font-medium text-white hover:bg-terracotta/90"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-16 border-t border-sand bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <p className="text-center text-sm text-charcoal/50">
            © {new Date().getFullYear()} FurniStore. Crafted for modern living.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;