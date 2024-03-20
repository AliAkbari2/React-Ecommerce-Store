import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { isAuth, generateToken } from "../utils.js";

//Express router constant made
const userRouter = express.Router();

//Post request to sign in a user
userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    //Get the user by email
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      //If user exists
      //Check password for a match
      if (bcrypt.compareSync(req.body.password, user.password)) {
        //Send the user info stored in mongodb to the front end
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Unregistered email or wrong password" }); //401 Unauthorized
  })
);

//Post request to create a new user in the mongodb database
userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    //Create a new user from a predefined mongoose model
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    //Save the user created above
    const user = await newUser.save();
    //Send the user info stored in mongodb to the front end, including the token
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

//Put request update user information in the database
userRouter.put(
  "/profile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      //Check if the user exists
      //Update or use the existing value
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        //Encrypt the new password value
        user.password = bcrypt.hashSync(req.body.password, 8);
      }

      const updatedUser = await user.save();
      res.send({
        //Send back the updated user profile information
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  })
);

export default userRouter;
