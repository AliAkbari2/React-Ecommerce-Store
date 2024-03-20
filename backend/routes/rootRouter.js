import express from "express";
import Product from "../models/productModel.js";
import data from "../data.js";
import User from "../models/userModel.js";

//Express router constant made
const rootRouter = express.Router();

//Get request from seed to set defaults based on database data
rootRouter.get("/", async (req, res) => {
  //Remove all previous records in the product model of our database
  await Product.deleteMany({}); //select all products indicated by the empty curly braces
  //Create new products in the database, pull them from data.js as an array  of products
  const createdProducts = await Product.insertMany(data.products);

  //Do the same for users in the database
  await User.deleteMany({});
  const createdUsers = await User.insertMany(data.users);

  //Send the products back to the front end from the database
  res.send({ createdProducts, createdUsers });
});

export default rootRouter;
