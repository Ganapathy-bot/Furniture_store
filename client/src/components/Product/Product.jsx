import { formatCurrency } from '../../utils/formatCurrency';

const Product = ({
  name,
  price,
  currency,
  image,
  stock,
  quantity,
  addToCart,
  removeFromCart,
  updateCartQty,
}) => {
  const inCart = quantity > 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {stock <= 5 && stock > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-terracotta/90 px-2 py-0.5 text-xs font-medium text-white">
            Only {stock} left
          </span>
        )}
        {stock === 0 && (
          <span className="absolute inset-0 flex items-center justify-center bg-charcoal/50 text-sm font-medium text-white">
            Out of Stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-display text-lg font-semibold text-charcoal">{name}</h3>
        <p className="mt-1 text-lg font-semibold text-terracotta">
          {formatCurrency(price, currency)}
        </p>

        <div className="mt-auto flex items-center justify-between pt-4">
          {inCart ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateCartQty(quantity - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-sand text-charcoal hover:bg-sand"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-6 text-center font-medium">{quantity}</span>
              <button
                type="button"
                onClick={() => updateCartQty(quantity + 1)}
                disabled={quantity >= stock}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-sand text-charcoal hover:bg-sand disabled:opacity-40"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={addToCart}
              disabled={stock === 0}
              className="rounded-lg bg-terracotta px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-terracotta/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add to Cart
            </button>
          )}

          {inCart && (
            <button
              type="button"
              onClick={removeFromCart}
              className="text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default Product;