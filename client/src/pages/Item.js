import axios from "axios";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import StarRating from "../components/StarRating";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import LoadingSpinner from "../components/LoadingSpinner";
import AlertMessage from "../components/AlertMessage";
import { getError } from "../utils";
import { Store } from "../Store";
import FloatingLabel from "react-bootstrap/FloatingLabel";

//Define the reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "REFRESH_PRODUCT":
      return { ...state, product: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false };
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

//Creating item page
function Item() {
  let reviewsRef = useRef();
  //Set default rating to zero
  const [rating, setRating] = useState(0);
  //Empty by default
  const [comment, setComment] = useState("");

  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;
  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      //Set default value for product
      product: [],
      loading: true,
      error: "",
    });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
    //Product page updates when the slug value is changed
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const addToCartHandler = async () => {
    //Determine if current product already exists in the cart
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    //Update quantity of a product in the cart, or add it if it didn't exist in the cart
    const quantity = existItem ? existItem.quantity + 1 : 1;
    //Ajax request for the current product
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      //Do this if item is not available
      window.alert("This item is out of stock");
      return;
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity },
    });
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    //Prevent page refresh when submit button is clicked
    e.preventDefault();
    if (!comment || !rating) {
      window.alert("Please enter comment and rating");
      return;
    }
    try {
      //Send an AJAX request to the api
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: "CREATE_SUCCESS",
      });
      //Show that the review was submitted successfully
      window.alert("Thanks, the review was submitted");
      //Add new review above existing reviews
      product.reviews.unshift(data.review);
      //Update the number of reviews for this product based on the backend stored info
      product.numReviews = data.numReviews;
      //Update the rating of the current product
      product.rating = data.rating;
      //Update product information on the screen based on the entered information
      dispatch({ type: "REFRESH_PRODUCT", payload: product });

      window.scrollTo({
        //Scroll the user to their review
        behavior: "smooth",
        top: reviewsRef.current.offsetTop,
      });
    } catch (error) {
      window.alert(getError(error));
      dispatch({ type: "CREATE_FAIL" });
    }
  };

  //Return the UI
  return (
    //Use conditional rendering, if loading use the loading spinner component
    loading ? (
      <LoadingSpinner />
    ) : error ? (
      <AlertMessage variant="danger">{error}</AlertMessage>
    ) : (
      <div>
        <Row>
          {/* Column for image of the product */}
          <Col md={6}>
            <img
              className="img-large"
              src={product.image}
              alt={product.name}
            ></img>
          </Col>
          {/* Column for product information */}
          <Col md={3}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                {/* Add title of the page */}
                <Helmet>
                  <title>{product.name}</title>
                </Helmet>
                <h1>{product.name}</h1>
              </ListGroup.Item>
              <ListGroup.Item>
                {/* Add the rating component we previously created */}
                <StarRating
                  rating={product.rating}
                  numReviews={product.numReviews}
                ></StarRating>
              </ListGroup.Item>
              <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
              <ListGroup.Item>
                Description:
                <p>{product.description}</p>
              </ListGroup.Item>
            </ListGroup>
          </Col>
          {/* Column for product action */}
          <Col md={3}>
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price: </Col>
                      <Col>${product.price}</Col>
                    </Row>
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>Status: </Col>
                      <Col>
                        {product.countInStock > 0 ? (
                          <Badge bg="success">In Stock</Badge>
                        ) : (
                          <Badge bg="danger">Unavailable</Badge>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {/* Use conditional rendering to show to purchase button */}
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <div className="d-grid">
                        <Button onClick={addToCartHandler} variant="primary">
                          Add to Cart
                        </Button>
                      </div>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <div className="my-3">
          <h2 ref={reviewsRef}>Reviews</h2>
          <div className="mb-3">
            {product.reviews.length === 0 && (
              <AlertMessage>There are no reviews yet</AlertMessage>
            )}
          </div>
          {/* List group of reviews for item */}
          <ListGroup>
            {product.reviews.map((review) => (
              <ListGroup.Item key={review._id}>
                <strong>{review.name}</strong>
                <StarRating rating={review.rating} caption=" "></StarRating>
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <div className="my-3">
            {/* Form for user review to submit a review */}
            {userInfo ? (
              <form onSubmit={submitHandler}>
                <h2>Write a product review</h2>
                <Form.Group className="mb-3" controlId="rating">
                  <Form.Label>Rating</Form.Label>
                  <Form.Select
                    aria-label="Rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="1">1 - Bad</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very good</option>
                    <option value="5">5 - Amazing</option>
                  </Form.Select>
                </Form.Group>
                <FloatingLabel
                  controlId="floatingTextarea"
                  label="Comments"
                  className="mb-3"
                >
                  <Form.Control
                    as="textarea"
                    placeholder="Leave a comment here"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </FloatingLabel>

                <div className="mb-3">
                  <Button disabled={loadingCreateReview} type="submit">
                    Submit
                  </Button>
                  {loadingCreateReview && <LoadingSpinner></LoadingSpinner>}
                </div>
              </form>
            ) : (
              <AlertMessage>
                {/* Alert message if not signed in. */}
                Must be{" "}
                <Link to={`/signin?redirect=/product/${product.slug}`}>
                  Signed In
                </Link>{" "}
                to write a review
              </AlertMessage>
            )}
          </div>
        </div>
      </div>
    )
  );
}

export default Item;
