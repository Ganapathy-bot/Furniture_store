import { getProduct } from './products';

const CART_ADD = 'cart/ADD';
const CART_REMOVE = 'cart/REMOVE';
const CART_UPDATE_QTY = 'cart/UPDATE_QTY';
const CART_CLEAR = 'cart/CLEAR';
const CART_HYDRATE = 'cart/HYDRATE';

const STORAGE_KEY = 'furnistore_cart';

const initialState = {
  items: [],
  currency: 'INR',
};

function saveToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
}

export function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export default function cart(state = initialState, action = {}) {
  let nextState;

  switch (action.type) {
    case CART_HYDRATE:
      return { ...state, items: action.payload.items };
    case CART_ADD:
      nextState = handleCartAdd(state, action.payload);
      break;
    case CART_REMOVE:
      nextState = handleCartRemove(state, action.payload);
      break;
    case CART_UPDATE_QTY:
      nextState = handleCartUpdateQty(state, action.payload);
      break;
    case CART_CLEAR:
      nextState = { ...state, items: [] };
      break;
    default:
      return state;
  }

  saveToStorage(nextState.items);
  return nextState;
}

function handleCartAdd(state, payload) {
  const existing = state.items.find((item) => item.productId === payload.productId);
  if (existing) {
    return {
      ...state,
      items: state.items.map((item) =>
        item.productId === payload.productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    };
  }
  return {
    ...state,
    items: [...state.items, { productId: payload.productId, quantity: 1 }],
  };
}

function handleCartRemove(state, payload) {
  return {
    ...state,
    items: state.items.filter((item) => item.productId !== payload.productId),
  };
}

function handleCartUpdateQty(state, payload) {
  const { productId, quantity } = payload;
  if (quantity <= 0) {
    return handleCartRemove(state, { productId });
  }
  return {
    ...state,
    items: state.items.map((item) =>
      item.productId === productId ? { ...item, quantity } : item
    ),
  };
}

export function hydrateCart() {
  return {
    type: CART_HYDRATE,
    payload: { items: loadCartFromStorage() },
  };
}

export function addToCart(productId) {
  return { type: CART_ADD, payload: { productId } };
}

export function removeFromCart(productId) {
  return { type: CART_REMOVE, payload: { productId } };
}

export function updateCartQty(productId, quantity) {
  return { type: CART_UPDATE_QTY, payload: { productId, quantity } };
}

export function clearCart() {
  return { type: CART_CLEAR };
}

export function getCartItem(state, productId) {
  return state.cart.items.find((item) => item.productId === productId);
}

export function isInCart(state, props) {
  return state.cart.items.some((item) => item.productId === props.id);
}

export function getCartQuantity(state, props) {
  const item = getCartItem(state, props.id);
  return item ? item.quantity : 0;
}

export function getItems(state) {
  return state.cart.items
    .map(({ productId, quantity }) => {
      const product = getProduct(state, { id: productId });
      if (!product) return null;
      return { ...product, quantity };
    })
    .filter(Boolean);
}

export function getItemCount(state) {
  return state.cart.items.reduce((acc, item) => acc + item.quantity, 0);
}

export function getCurrency(state) {
  return state.cart.currency;
}

export function getTotal(state) {
  return state.cart.items.reduce((acc, { productId, quantity }) => {
    const item = getProduct(state, { id: productId });
    return item ? acc + item.price * quantity : acc;
  }, 0);
}