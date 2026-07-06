import { connect } from 'react-redux';
import ProductList from '../components/ProductList';
import { getProducts } from '../ducks/products';

const mapStateToProps = (state) => ({
  products: getProducts(state),
});

export default connect(mapStateToProps)(ProductList);