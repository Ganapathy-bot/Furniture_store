import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import cartReducer, { hydrateCart } from './ducks/cart';
import authReducer, { hydrateAuth } from './ducks/auth';
import productsReducer, { initProducts } from './ducks/products';
import productsData from './data/products';
import App from './App';
import './index.css';

const rootReducer = combineReducers({
  cart: cartReducer,
  auth: authReducer,
  products: productsReducer,
});

const store = createStore(rootReducer);

store.dispatch(initProducts(productsData));
store.dispatch(hydrateCart());
store.dispatch(hydrateAuth());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);