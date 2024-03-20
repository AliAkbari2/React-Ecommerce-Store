import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import CheckoutProcess from "../components/CheckoutProcess";
import { Store } from "../Store";

//Creating the Payment page
export default function Payment() {
  const navigate = useNavigate();
  //Get state and dispatch from the context
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  //Type of payment method
  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || "PayPal"
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      //Navigate user to the previous step if the shipping address is not available in state
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    //Prevent page refresh
    e.preventDefault();
    //Dispatch this action
    ctxDispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
    //Save payment method in local cookies
    localStorage.setItem("paymentMethod", paymentMethodName);
    //Redirect the user to the next step
    navigate("/placeorder");
  };
  return (
    //The document's head section with, with title Payment Method
    <div>
      <CheckoutProcess step1 step2 step3></CheckoutProcess>
      <div className="container small-container">
        <Helmet>
          <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3">Payment Method</h1>
        {/*Form for when for which method is used and submitted */}
        <Form onSubmit={submitHandler}>
          <div className="mb-3">
            {/*Form check for when for when paypal is used and submitted */}
            <Form.Check
              type="radio"
              id="PayPal"
              label="PayPal"
              value="PayPal"
              checked={paymentMethodName === "PayPal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            {/*Form check for when other methods are used and submitted */}
            <Form.Check
              type="radio"
              id="Stripe"
              label="Stripe"
              value="Stripe"
              checked={paymentMethodName === "Stripe"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
          </div>
          <div className="mb-3">
            {/*Button for continuing in the payment process. */}
            <Button type="submit">Continue</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
