import jwt from "jsonwebtoken";

//Generate a token used for authenticating user requests
export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.idAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "10d",
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    //If authorization exists
    //Just get the token part of the string
    const token = authorization.slice(7, authorization.length);
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    //When there is no authorization present
    res.status(401).send({ message: "No Token" });
  }
};
