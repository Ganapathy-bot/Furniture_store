import { formatCurrency } from '../../utils/formatCurrency';

const CartItem = ({ name, price, currency, quantity, onRemove, onUpdateQty, stock }) => {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-sand py-3 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-charcoal">{name}</p>
        <p className="text-sm text-charcoal/60">
          {formatCurrency(price, currency)} each
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onUpdateQty(quantity - 1)}
          className="flex h-7 w-7 items-center justify-center rounded border border-sand text-sm hover:bg-sand"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-5 text-center text-sm font-medium">{quantity}</span>
        <button
          type="button"
          onClick={() => onUpdateQty(quantity + 1)}
          disabled={quantity >= stock}
          className="flex h-7 w-7 items-center justify-center rounded border border-sand text-sm hover:bg-sand disabled:opacity-40"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <div className="text-right">
        <p className="font-semibold text-charcoal">
          {formatCurrency(price * quantity, currency)}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-red-600 hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;