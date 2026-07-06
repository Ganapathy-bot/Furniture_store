import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SHIPPING } from '@furnistore/shared';
import { getItems, getTotal, getCurrency } from '../ducks/cart';
import { formatCurrency } from '../utils/formatCurrency';
import * as orderService from '../services/orderService';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
];

const CheckoutPage = () => {
  const items = useSelector(getItems);
  const subtotal = useSelector(getTotal);
  const currency = useSelector(getCurrency);

  const shipping =
    subtotal >= SHIPPING.FREE_THRESHOLD ? 0 : items.length > 0 ? SHIPPING.FLAT_RATE : 0;
  const total = subtotal + shipping;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: 'Maharashtra',
    pinCode: '',
  });

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (!items.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-charcoal/60">Your cart is empty.</p>
        <Link to="/" className="mt-4 inline-block text-terracotta hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cartItems = items.map((item: { id: string; quantity: number }) => ({
        productId: item.id,
        quantity: item.quantity,
      }));

      const result = await orderService.createOrder(cartItems, form);

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        throw new Error('No checkout URL received from Stripe');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-charcoal">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-charcoal">Shipping Address</h2>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="mt-1 w-full rounded-lg border border-sand px-4 py-2.5 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input
                required
                type="tel"
                pattern="[0-9+\-\s]{10,15}"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="10-digit mobile"
                className="mt-1 w-full rounded-lg border border-sand px-4 py-2.5 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Address Line 1</label>
              <input
                required
                value={form.line1}
                onChange={(e) => update('line1', e.target.value)}
                className="mt-1 w-full rounded-lg border border-sand px-4 py-2.5 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Address Line 2 (optional)</label>
              <input
                value={form.line2}
                onChange={(e) => update('line2', e.target.value)}
                className="mt-1 w-full rounded-lg border border-sand px-4 py-2.5 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">City</label>
                <input
                  required
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-sand px-4 py-2.5 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">PIN Code</label>
                <input
                  required
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={form.pinCode}
                  onChange={(e) => update('pinCode', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-sand px-4 py-2.5 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">State</label>
              <select
                required
                value={form.state}
                onChange={(e) => update('state', e.target.value)}
                className="mt-1 w-full rounded-lg border border-sand px-4 py-2.5 focus:border-terracotta focus:outline-none focus:ring-1 focus:ring-terracotta"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-terracotta py-3 font-medium text-white hover:bg-terracotta/90 disabled:opacity-60"
          >
            {loading ? 'Redirecting to Stripe...' : `Pay ${formatCurrency(total, currency)} with Stripe`}
          </button>
          <p className="mt-2 text-center text-xs text-charcoal/50">
            Secure payment powered by Stripe
          </p>
        </form>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-charcoal">Order Summary</h2>
          <ul className="mt-4 space-y-3">
            {items.map((item: { id: string; name: string; price: number; quantity: number }) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>{formatCurrency(item.price * item.quantity, currency)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-sand pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatCurrency(shipping, currency)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span className="text-terracotta">{formatCurrency(total, currency)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
