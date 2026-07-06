import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductList from '../components/ProductList/ProductList.jsx';
import {
  setProducts,
  setProductsLoading,
  setProductsError,
  getProducts,
  isProductsLoading,
  getProductsError,
  getProductsSource,
} from '../ducks/products';
import * as productsService from '../services/productsService';
import staticProducts from '../data/products';

const HomePage = () => {
  const dispatch = useDispatch();
  const products = useSelector(getProducts);
  const loading = useSelector(isProductsLoading);
  const error = useSelector(getProductsError);
  const source = useSelector(getProductsSource);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      dispatch(setProductsLoading());
      try {
        const data = await productsService.fetchProducts();
        if (!cancelled) {
          if (data.length > 0) {
            dispatch(setProducts(data));
          } else {
            dispatch(setProducts(staticProducts));
          }
        }
      } catch (err) {
        if (!cancelled) {
          dispatch(setProducts(staticProducts));
          dispatch(
            setProductsError(
              err instanceof Error ? err.message : 'Failed to load products from Atlas'
            )
          );
        }
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return (
    <>
      <section className="bg-charcoal px-4 py-16 text-white sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            Furniture for Modern Living
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">
            Discover curated chairs and sofas crafted for comfort, style, and everyday elegance.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-charcoal">
              Featured Collection
            </h2>
            <p className="mt-1 text-charcoal/60">
              {source === 'api'
                ? 'Loaded from MongoDB Atlas - furniture_shop.shop'
                : 'Handpicked pieces for your home'}
            </p>
          </div>
        </div>

        {loading && (
          <div className="rounded-xl bg-white p-12 text-center text-charcoal/60">
            Loading products from Atlas...
          </div>
        )}

        {!loading && error && source !== 'api' && (
          <div className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Atlas unavailable ({error}). Showing local fallback products.
          </div>
        )}

        {!loading && <ProductList products={products} />}
      </section>
    </>
  );
};

export default HomePage;
