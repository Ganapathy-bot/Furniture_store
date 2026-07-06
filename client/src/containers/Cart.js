import { connect } from 'react-redux';
import Cart from '../components/Cart';
import {
  getItems,
  getCurrency,
  getTotal,
  removeFromCart,
  updateCartQty,
} from '../ducks/cart';

const mapStateToProps = (state) => ({
  items: getItems(state),
  currency: getCurrency(state),
  total: getTotal(state),
});

const mapDispatchToProps = (dispatch) => ({
  removeFromCart: (id) => dispatch(removeFromCart(id)),
  updateCartQty: (id, qty) => dispatch(updateCartQty(id, qty)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);