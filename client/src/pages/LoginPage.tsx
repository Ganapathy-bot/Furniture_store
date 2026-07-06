import { FormEvent, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth, setAuthLoading, setAuthError, isAuthLoading, getAuthError } from '../ducks/auth';
import * as authService from '../services/authService';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loading = useSelector(isAuthLoading);
  const error = useSelector(getAuthError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(setAuthLoading());

    try {
      const result = await authService.login(email, password);
      dispatch(setAuth(result));

      if (result.user.role === 'admin') {
        navigate(from?.startsWith('/admin') ? from : '/admin', { replace: true });
      } else {
        navigate(from && !from.startsWith('/admin') ? from : '/', { replace: true });
      }
    } catch (err) {
      dispatch(setAuthError(err instanceof Error ? err.message : 'Login failed'));
    }
  };

  return (
    <div className="rounded-xl bg-white p-8 shadow-sm">
      <h1 className="font-display text-2xl font-semibold text-charcoal">Sign In</h1>
      <p className="mt-1 text-sm text-charcoal/60">
        Customers and admins - use your account credentials
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-charcoal">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-sand px-4 py-2.5 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-charcoal">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-sand px-4 py-2.5 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
            placeholder="********"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-terracotta py-3 font-medium text-white transition-colors hover:bg-terracotta/90 disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-charcoal/60">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-terracotta hover:underline">
          Create one
        </Link>
      </p>

      <div className="mt-4 rounded-lg bg-sand/40 p-3 text-xs text-charcoal/60">
        <strong>Admin demo:</strong> admin@furnistore.com / Admin@123456
        <br />
        <span className="text-charcoal/50">(Run `npm run seed -w server` after MongoDB is up)</span>
      </div>
    </div>
  );
};

export default LoginPage;
