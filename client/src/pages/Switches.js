import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ConsumerItems from "../components/ConsumerItems";
import { Helmet } from "react-helmet-async";
import LoadingSpinner from "../components/LoadingSpinner";
import AlertMessage from "../components/AlertMessage";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true }; //set loading to true so that we are showing a loading box in the UI
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default: //just return the current state
      return state;
  }
};

function Switches() {
  //save products from the backend using a react hook
  //define reducer
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    //set default value for product
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
    <div>
      <Helmet>
        <title>KeyStor</title>
      </Helmet>
      <h1>Switches</h1>
      <div className="products">
        {
          //use conditional rendering to show loading... message for slow connections
          loading ? (
            <LoadingSpinner />
          ) : error ? (
            <AlertMessage variant="danger">{error}</AlertMessage>
          ) : (
            <Row>
              {products
                .filter((product) => product.category == "Switches")
                .map((product) => (
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

export default Switches;
