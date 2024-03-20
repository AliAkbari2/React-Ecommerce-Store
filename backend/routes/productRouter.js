import express from "express";
import expressAsyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import { isAuth } from "../utils.js";

//Express router constant made
const productRouter = express.Router();

//Get request to return all products
productRouter.get("/", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

//Get request from backend api for returning product information based on the slug of the product
productRouter.get("/slug/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });

  if (product) {
    //If the products exists
    res.send(product);
  } else {
    //If product does not exits
    res.status(404).send({ message: "Product Not Found" });
  }
});

//Get request from api to get product based on item id
productRouter.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    //If the products exists
    res.send(product);
  } else {
    //If product does not exits
    res.status(404).send({ message: "Product Not Found" });
  }
});

//Post request to create a new product review in the database
productRouter.post(
  "/:id/reviews",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: "Not allowed to review multiple times." });
      }

      //Review object create
      const review = {
        name: req.user.name,
        //Cast rating to a number
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      //New review is added as the last review
      product.reviews.push(review);
      //Update the number of ratings for a product
      product.numReviews = product.reviews.length;
      //Update average rating of the product
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      //Update the product information in the database
      const updatedProduct = await product.save();
      //Send back the updated product information
      res.status(201).send({
        message: "Review Created",
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        numReviews: product.numReviews,
        rating: product.rating,
      });
    } else {
      //If the product does not exist in the database
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

export default productRouter;
