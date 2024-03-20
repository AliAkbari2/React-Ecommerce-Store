import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import { isAuth } from "../utils.js";

//Express router constant made
const customerOrderRouter = express.Router();

//Post request to create a new order in the database
customerOrderRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      //Place product id into order items
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      //Using the isAuth middleware, defined in utils.js
      user: req.user._id,
    });
    //Save order in the database
    const order = await newOrder.save();
    //End on successful creation
    res.status(201).send({ message: "New Order Created", order });
  })
);
//Get request to get all orders of the current user that are stored in the database
customerOrderRouter.get(
  "/mine",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

//Get request to get orders currently in the database
customerOrderRouter.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id); //search for the requested order in the database
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

//Put request to create/update orders in the database
customerOrderRouter.put(
  "/:id/pay",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    //Find the order in the database
    const order = await Order.findById(req.params.id);
    if (order) {
      //Check if the order exists and update the order parameters
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      //Save the order in the database
      const updatedOrder = await order.save();
      res.send({ message: "Order Paid", order: updatedOrder });
    } else {
      //If the order does not exist in the database
      res.status(404).send({ message: "Order Not Found" });
    }
  })
);

export default customerOrderRouter;
