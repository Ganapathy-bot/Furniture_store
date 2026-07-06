import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth, setAuthLoading, setAuthError, isAuthLoading, getAuthError } from '../ducks/auth';
import * as authService from '../services/authService';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(isAuthLoading);
  const error = useSelector(getAuthError);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }

    dispatch(setAuthLoading());

    try {
      const result = await authService.register(name, email, password);
      dispatch(setAuth(result));
      navigate('/', { replace: true });
    } catch (err) {
      dispatch(setAuthError(err instanceof Error ? err.message : 'Registration failed'));
    }
  };

  const displayError = formError || error;

  return (
    <div className="rounded-xl bg-white p-8 shadow-sm">
      <h1 className="font-display text-2xl font-semibold text-charcoal">Create Account</h1>
      <p className="mt-1 text-sm text-charcoal/60">Register as a customer to shop and checkout</p>

      {displayError && (
        <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {displayError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-charcoal">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-sand px-4 py-2.5 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
            placeholder="John Doe"
          />
        </div>

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
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-sand px-4 py-2.5 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
            placeholder="Min. 8 characters"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-charcoal">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-sand px-4 py-2.5 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
            placeholder="Repeat password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-terracotta py-3 font-medium text-white transition-colors hover:bg-terracotta/90 disabled:opacity-60"
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-charcoal/60">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-terracotta hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;