import Product from '../../containers/Product';

const ProductList = ({ products }) => {
  if (!products.length) {
    return (
      <div className="rounded-xl bg-white p-12 text-center text-charcoal/60">
        No products found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <Product key={product.id} {...product} />
      ))}
    </div>
  );
};

export default ProductList;