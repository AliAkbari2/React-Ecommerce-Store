import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  //get user info from local cookies
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null, //set to null if none are stored locally
  //get cart info from local cookies
  cart: {
    shippingAddress: localStorage.getItem("shippingAddress")
      ? JSON.parse(localStorage.getItem("shippingAddress")) //if localy stored address exists
      : {},
    paymentMethod: localStorage.getItem("paymentMethod")
      ? localStorage.getItem("paymentMethod") //if locally stored payment method exists, no need to JSON parse since it is already a string
      : "",
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems")) //if locally stored items exist
      : [],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case "CART_ADD_ITEM":
      //add to cart
      const newItem = action.payload; //save the item we are going to add to the cart

      const existItem = state.cart.cartItems.find(
        //get item based on the criteria that we used in the Item
        (item) => item._id === newItem._id
      );
      //update the item in the cart
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem]; //if the existItem is null then we need to add it to the cartItems array
      localStorage.setItem("cartItems", JSON.stringify(cartItems)); //store locally

      return { ...state, cart: { ...state.cart, cartItems } }; //update the cartItem based on the new values
    case "CART_REMOVE_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        //filter the item that was passed as the payload from the cart
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case "CART_CLEAR":
      return { ...state, cart: { ...state.cart, cartItems: [] } };
    //define an action for user login
    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload }; //only update the user info that is passed from the backend
    //define an action for user signout
    case "USER_SIGNOUT":
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: "",
        },
      };
    //define an action to save shipping address
    case "SAVE_SHIPPING_ADDRESS":
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload, //only update the shipping address in the state
        },
      };
    //define an action to save payment method
    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
