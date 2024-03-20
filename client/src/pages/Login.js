import Axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { getError } from "../utils";

//Creating login page
export default function Login() {
  //Use navigate to redirect the user
  const navigate = useNavigate();
  //Get email and password from state using react hooks
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  //Set the redirect url to home page
  const redirect = redirectInUrl ? redirectInUrl : "/";

  //Access data stored in Store
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    //Prevent refreshing this page when user clicks the Log in button
    e.preventDefault();
    try {
      //Send an ajax request to the backend server with the following body
      const { data } = await Axios.post("/api/users/signin", {
        email,
        password,
      });
      //Dispatch an action after a successfull login
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      //Save the user information in local cookies
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/"); //go to home page if url does not exist
    } catch (err) {
      window.alert(getError(err));
    }
  };

  //Do not show the log in screen if user is already logged in
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  return (
    //The document's head section with, with title Log in
    <Container className="small-container">
      <Helmet>
        <title>Log In</title>
      </Helmet>
      <h1 className="my-3">Log In</h1>
      <Form onSubmit={submitHandler}>
        {/* Form group to enter email */}
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        {/* Form group to enter password */}
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        {/* Log in button */}
        <div className="mb-3">
          <Button type="submit">Log In</Button>
        </div>
        {/* If create account redirect to create account page*/}
        <div className="mb-3">
          New customer?{" "}
          <Link to={`/signup?redirect=${redirect}`}>Create account</Link>
        </div>
      </Form>
    </Container>
  );
}
