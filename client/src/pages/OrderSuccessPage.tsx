import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { Order } from '@furnistore/shared';
import { clearCart } from '../ducks/cart';
import { formatCurrency } from '../utils/formatCurrency';
import * as orderService from '../services/orderService';

const OrderSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const sessionId = searchParams.get('session_id');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setError('Missing payment session');
      setLoading(false);
      return;
    }

    orderService
      .verifyCheckoutSession(sessionId)
      .then((data) => {
        setOrder(data);
        dispatch(clearCart());
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [sessionId, dispatch]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center text-charcoal/60">
        Confirming your payment...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-charcoal">Payment Status Unknown</h1>
        <p className="mt-2 text-charcoal/60">{error || 'Could not verify order.'}</p>
        <Link to="/orders" className="mt-6 inline-block text-terracotta hover:underline">
          View your orders
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
          ✓
        </div>
        <h1 className="mt-4 font-display text-2xl font-semibold text-charcoal">Order Confirmed!</h1>
        <p className="mt-2 text-charcoal/60">
          Thank you for your purchase. A confirmation email has been sent.
        </p>
        <p className="mt-4 text-sm text-charcoal/50">
          Order ID: <span className="font-mono">{order._id}</span>
        </p>
        <p className="mt-2 text-lg font-semibold text-terracotta">
          {formatCurrency(order.total, order.items[0] ? 'INR' : 'INR')}
        </p>
        <p className="mt-1 text-sm capitalize text-charcoal/60">Status: {order.status}</p>

        <div className="mt-8 flex justify-center gap-4">
          <Link to="/orders" className="rounded-lg bg-charcoal px-6 py-2.5 text-sm font-medium text-white hover:bg-charcoal/90">
            View Orders
          </Link>
          <Link to="/" className="rounded-lg border border-sand px-6 py-2.5 text-sm font-medium text-charcoal hover:bg-sand/50">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;