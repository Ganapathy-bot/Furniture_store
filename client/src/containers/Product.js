import { connect } from 'react-redux';
import Product from '../components/Product';
import {
  addToCart,
  removeFromCart,
  updateCartQty,
  getCartQuantity,
} from '../ducks/cart';

const mapStateToProps = (state, props) => ({
  quantity: getCartQuantity(state, props),
});

const mapDispatchToProps = (dispatch, props) => ({
  addToCart: () => dispatch(addToCart(props.id)),
  removeFromCart: () => dispatch(removeFromCart(props.id)),
  updateCartQty: (qty) => dispatch(updateCartQty(props.id, qty)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Product);