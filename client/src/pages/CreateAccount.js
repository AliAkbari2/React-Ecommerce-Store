import Axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { getError } from "../utils";

//Creating account Info page
export default function CreateAccount() {
  //Used to redirect the user
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  //Set the redirect url to home page
  const redirect = redirectInUrl ? redirectInUrl : "/";

  //Get email and password from state using react hooks
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //Access data stored in Store
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    //Prevent refreshing this page when user clicks the Log in button
    e.preventDefault();
    //Check if user entered matching password
    if (password !== confirmPassword) {
      window.alert("Passwords do not match");
      return;
    }
    try {
      //Send an ajax request to the backend server with the following body
      const { data } = await Axios.post("/api/users/signup", {
        name,
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
    <Container className="small-container">
      {/* The document's head section */}
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3">Sign Up</h1>
      <Form onSubmit={submitHandler}>
        {/*Form group to enter name */}
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control onChange={(e) => setName(e.target.value)} required />
        </Form.Group>
        {/* Form group to enter email */}
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        {/* Password form to enter password */}
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* Password input form to confirm password */}
          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>

          {/* Sign up/in form group */}
        </Form.Group>
        <div className="mb-3">
          {/* Sign Up button */}
          <Button type="submit">Sign Up</Button>
        </div>
        <div className="mb-3">
          Already have an account?{" "}
          <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
        </div>
      </Form>
    </Container>
  );
}
