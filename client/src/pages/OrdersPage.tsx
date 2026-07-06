import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';
import * as orderService from '../services/orderService';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const OrdersPage = () => {
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.fetchOrders,
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-charcoal/60">
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-red-600">
        Failed to load orders: {error.message}
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-charcoal">Your Orders</h1>
        <p className="mt-4 text-charcoal/60">You haven&apos;t placed any orders yet.</p>
        <Link to="/" className="mt-6 inline-block text-terracotta hover:underline">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-charcoal">Your Orders</h1>

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm text-charcoal/50">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                <p className="font-mono text-sm text-charcoal/70">#{order._id.slice(-8)}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                  statusColors[order.status] || 'bg-gray-100'
                }`}
              >
                {order.status}
              </span>
            </div>

            <ul className="mt-4 space-y-1 text-sm text-charcoal/80">
              {order.items.map((item, i) => (
                <li key={i}>
                  {item.name} x {item.quantity}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-sand pt-4">
              <span className="font-semibold text-terracotta">{formatCurrency(order.total)}</span>
              <span className="text-xs text-charcoal/50">
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
