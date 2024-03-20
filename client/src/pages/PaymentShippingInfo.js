import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { Store } from "../Store";
import CheckoutProcess from "../components/CheckoutProcess";

//Creating the Payment Shipping Info page
export default function PaymentShippingInfo() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  //Define state hooks we use below, read initial values from the current state
  //Define the full name state hook
  const [fullName, setFullName] = useState(shippingAddress.fullName || "");
  //Define the address state hook
  const [address, setAddress] = useState(shippingAddress.address || "");
  //Define the city state hook
  const [city, setCity] = useState(shippingAddress.city || "");
  //Define the city state hook
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );

  //Redirect user to sign-in page if they are not signed in and trying to fill out shipping information
  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
    }
  }, [userInfo, navigate]);

  //Define the city state hook
  const [country, setCountry] = useState(shippingAddress.country || "");

  const submitHandler = (e) => {
    //Prevent refreshing the page on submit
    e.preventDefault();
    //Dispatch an action to save shipping address
    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      //Info entered by the user in the text boxes on their screen
      payload: {
        fullName,
        address,
        city,
        postalCode,
        country,
      },
    });
    //Save the shipping address in user cookies
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({
        fullName,
        address,
        city,
        postalCode,
        country,
      })
    );
    //Navigate the user to payment screen
    navigate("/payment");
  };

  return (
    //The document's head section with, with title Shipping Information
    <div>
      <Helmet>
        <title>Shipping Information</title>
      </Helmet>
      {/*CheckoutProcess component used.*/}
      <CheckoutProcess step1 step2></CheckoutProcess>
      <div className="container small-container">
        <h1 className="my-3">Shipping Information</h1>
        {/*Form for user information to use in the shipping payment information.*/}
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="fullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              value={fullName}
              //Use a state hook to update the full name
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="city">
            <Form.Label>City</Form.Label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="postalCode">
            <Form.Label>Postal Code</Form.Label>
            <Form.Control
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="country">
            <Form.Label>Country</Form.Label>
            <Form.Control
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </Form.Group>
          <div className="mb-3">
            {/*Button for continuing in the payment process. */}
            <Button variant="primary" type="submit">
              Continue
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
