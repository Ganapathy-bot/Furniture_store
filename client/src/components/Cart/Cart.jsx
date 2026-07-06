import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SHIPPING } from '@furnistore/shared';
import { formatCurrency } from '../../utils/formatCurrency';
import { isAuthenticated } from '../../ducks/auth';
import CartItem from './CartItem';

const Cart = ({ items, total, currency, removeFromCart, updateCartQty }) => {
  const authenticated = useSelector(isAuthenticated);
  const shipping =
    total >= SHIPPING.FREE_THRESHOLD ? 0 : items.length > 0 ? SHIPPING.FLAT_RATE : 0;
  const grandTotal = total + shipping;

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="font-display text-xl font-semibold text-charcoal">Your Cart</h2>

      {items.length === 0 ? (
        <p className="mt-6 rounded-lg bg-sand/50 p-4 text-center text-charcoal/60">
          Your cart is empty. Browse our collection to get started.
        </p>
      ) : (
        <>
          <div className="mt-4">
            {items.map((item) => (
              <CartItem
                key={item.id}
                {...item}
                onRemove={() => removeFromCart(item.id)}
                onUpdateQty={(qty) => updateCartQty(item.id, qty)}
              />
            ))}
          </div>

          <div className="mt-4 space-y-2 border-t border-sand pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-charcoal/70">Subtotal</span>
              <span>{formatCurrency(total, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal/70">Shipping</span>
              <span>
                {shipping === 0 && items.length > 0
                  ? 'Free'
                  : formatCurrency(shipping, currency)}
              </span>
            </div>
            {total > 0 && total < SHIPPING.FREE_THRESHOLD && (
              <p className="text-xs text-terracotta">
                Add {formatCurrency(SHIPPING.FREE_THRESHOLD - total, currency)} more for free
                shipping
              </p>
            )}
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span className="text-terracotta">{formatCurrency(grandTotal, currency)}</span>
            </div>
          </div>

          {authenticated ? (
            <Link
              to="/checkout"
              className="mt-6 block w-full rounded-lg bg-charcoal py-3 text-center text-sm font-medium text-white transition-colors hover:bg-charcoal/90"
            >
              Proceed to Checkout
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                state={{ from: { pathname: '/checkout' } }}
                className="mt-6 block w-full rounded-lg bg-charcoal py-3 text-center text-sm font-medium text-white transition-colors hover:bg-charcoal/90"
              >
                Sign in to Checkout
              </Link>
              <p className="mt-2 text-center text-xs text-charcoal/50">
                <Link to="/register" className="text-terracotta hover:underline">Create an account</Link> to place orders
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;