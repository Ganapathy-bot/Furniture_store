const PRODUCTS_INIT = 'products/INIT';
const PRODUCTS_SET = 'products/SET';
const PRODUCTS_LOADING = 'products/LOADING';
const PRODUCTS_ERROR = 'products/ERROR';

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  source: 'static',
};

export default function products(state = initialState, action = {}) {
  switch (action.type) {
    case PRODUCTS_INIT:
      return {
        ...state,
        items: action.payload,
        isLoading: false,
        error: null,
        source: 'static',
      };
    case PRODUCTS_SET:
      return {
        ...state,
        items: action.payload,
        isLoading: false,
        error: null,
        source: 'api',
      };
    case PRODUCTS_LOADING:
      return { ...state, isLoading: true, error: null };
    case PRODUCTS_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
}

export function initProducts(items) {
  return { type: PRODUCTS_INIT, payload: items };
}

export function setProducts(items) {
  return { type: PRODUCTS_SET, payload: items };
}

export function setProductsLoading() {
  return { type: PRODUCTS_LOADING };
}

export function setProductsError(message) {
  return { type: PRODUCTS_ERROR, payload: message };
}

export function getProducts(state) {
  return state.products.items;
}

export function getProduct(state, props) {
  const id = String(props.id);
  return state.products.items.find((item) => String(item.id) === id);
}

export function isProductsLoading(state) {
  return state.products.isLoading;
}

export function getProductsError(state) {
  return state.products.error;
}

export function getProductsSource(state) {
  return state.products.source;
}