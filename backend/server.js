import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import rootRouter from "./routes/rootRouter.js";
import productRouter from "./routes/productRouter.js";
import userRouter from "./routes/userRouter.js";
import customerOrderRouter from "./routes/customerOrderRouter.js";

//Fetch the environment variables
dotenv.config();

//Connect to the mongodb cloud database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

//Convert data to json object in the request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Access the paypal client ID saved in the backend .env file
app.get("/api/keys/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

//attach database routers to this server
app.use("/api/root", rootRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", customerOrderRouter);
//Get the directory name
const __dirname = path.resolve();
//Define this middleware to serve static files
app.use(express.static(path.join(__dirname, "/client/build")));
//Get request to serve everything from this html file
app.get("*", (req, res) =>
  res.sendFile(path.join(__dirname, "/client/build/index.html"))
);

//Define the error handling middleware for express
app.use((err, req, res, next) => {
  //500 is an internal server error
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
