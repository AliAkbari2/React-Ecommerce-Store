import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
//Checkout process component
//Steps used to checkout 
export default function CheckoutProcess(props) {
  return (
    <Row className="checkout-process">
      <Col className={props.step1 ? "active" : ""}>Log-In</Col>
      <Col className={props.step2 ? "active" : ""}>Shipping Info</Col>
      <Col className={props.step3 ? "active" : ""}>Payment</Col>
      <Col className={props.step4 ? "active" : ""}>Submit Order</Col>
    </Row>
  );
}
