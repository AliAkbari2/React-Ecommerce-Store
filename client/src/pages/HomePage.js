import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ConsumerItems from "../components/ConsumerItems";
import { Helmet } from "react-helmet-async";
import LoadingSpinner from "../components/LoadingSpinner";
import AlertMessage from "../components/AlertMessage";

//Define the reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      //Set loading to true so that we are showing a loading box in the UI
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    //Just return the current state
    default:
      return state;
  }
};
//Creating home page
function HomePage() {
  //Save products from the backend using a react hook
  //Define reducer
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    //Set default value for product
    products: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get("/api/products");
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };
    fetchData();
  }, []);
  return (
    //The document's head section with, with title KeyStor
    <div>
      <Helmet>
        <title>KeyStor</title>
      </Helmet>
      <h1>Featured Products</h1>
      <div className="products">
        {
          //Use conditional rendering to show loading... message for slow connections
          loading ? (
            <LoadingSpinner />
          ) : error ? (
            <AlertMessage variant="danger">{error}</AlertMessage>
          ) : (
            <Row>
              {products.map((product) => (
                <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                  <ConsumerItems product={product}></ConsumerItems>
                </Col>
              ))}
            </Row>
          )
        }
      </div>
    </div>
  );
}

export default HomePage;
