import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import axios from "axios";
import { useContext } from "react";
import { Store } from "../Store";
//Function that exports bootstrap card HTML code
function ConsumerItems(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  //Event listener to add consumer item to cart 
  const addToCartHandler = async (item) => {
    // determine if current product already exists in the cart
    const existItem = cartItems.find((x) => x._id === product._id);
    //update quantity of a product in the cart, or add it if it didn't exist in the cart
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      //do this if item is not available
      window.alert("This item is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        <StarRating rating={product.rating} numReviews={product.numReviews} />
        <Card.Text>${product.price}</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled>
            Not available
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
        )}
      </Card.Body>
    </Card>
  );
}
//Consumer Item component, exports bootstrap card HTML code
export default ConsumerItems;
