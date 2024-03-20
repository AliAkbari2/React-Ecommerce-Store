import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Item from "./pages/Item";
import Navbar from "react-bootstrap/Navbar";
import Badge from "react-bootstrap/Badge";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import { useContext } from "react";
import { Store } from "./Store";
import ShoppingCart from "./pages/ShoppingCart";
import Login from "./pages/Login";
import PaymentShippingInfo from "./pages/PaymentShippingInfo";
import CreateAccount from "./pages/CreateAccount";
import Payment from "./pages/Payment";
import OrderSubmission from "./pages/OrderSubmission";
import Checkout from "./pages/Checkout";
import PastPurchases from "./pages/PastPurchases";
import AccountInfo from "./pages/AccountInfo";
import Switches from "./pages/Switches";
import Keyboards from "./pages/Keyboards";
import Keycaps from "./pages/Keycaps";
import Footer from "./components/Footer";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  //signs out user when they select the dropdown item
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" }); //dispatch the action
    localStorage.removeItem("userInfo"); //remove user info from cookies
    localStorage.removeItem("shippingAddress"); //remove address info from cookies
    localStorage.removeItem("paymentMethod"); //remove payment method info from cookies
    window.location.href = "/signin"; //redirect the user to the signin screen
  };

  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <header>
          <Navbar bg="light" variant="light" expand="lg">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>KeyStor</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto w-100 justify-content-end">
                  <Link to="/keyboards" className="nav-link">
                    Keyboards
                  </Link>
                  <Link to="/keycaps" className="nav-link">
                    Keycaps
                  </Link>
                  <Link to="/switches" className="nav-link">
                    Switches
                  </Link>
                  <Link to="/cart" className="nav-link">
                    <span>Cart </span>
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Log In
                    </Link>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<Item />} />
              <Route path="/keyboards" element={<Keyboards />} />
              <Route path="/keycaps" element={<Keycaps />} />
              <Route path="/switches" element={<Switches />} />
              <Route path="/cart" element={<ShoppingCart />} />
              <Route path="/signin" element={<Login />} />
              <Route path="/signup" element={<CreateAccount />} />
              <Route path="/profile" element={<AccountInfo />} />
              <Route path="/placeorder" element={<OrderSubmission />} />
              <Route path="/order/:id" element={<Checkout />}></Route>
              <Route path="/orderhistory" element={<PastPurchases />}></Route>
              <Route path="/shipping" element={<PaymentShippingInfo />}></Route>
              <Route path="/payment" element={<Payment />}></Route>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </Container>
        </main>
        <Footer></Footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
