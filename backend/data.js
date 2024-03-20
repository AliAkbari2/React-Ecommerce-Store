import bcrypt from "bcryptjs";

//Data object created
const data = {
  //Sample users created
  users: [
    {
      name: "Admin",
      email: "admin@example.com",
      //Store encrypted password in the mongodb database
      password: bcrypt.hashSync("123"),
      isAdmin: true,
    },
    {
      name: "Shopper",
      email: "shopper@example.com",
      //Store encrypted password in the mongodb database
      password: bcrypt.hashSync("123"),
      isAdmin: false,
    },
  ],

  //Sample products created
  products: [
    {
      //_id: '1',
      name: "Gray Keyboard",
      slug: "gray-keyboard",
      category: "Keyboards",
      //720x720 image
      image: "/images/grayKeyboard.webp",
      price: 200,
      countInStock: 9,
      brand: "Keyboard Store",
      rating: 4.5,
      numReviews: 0,
      description: "gray gaming keyboard",
    },

    {
      //_id: '2',
      name: "White Keyboard",
      slug: "white-keyboard",
      category: "Keyboards",
      image: "/images/whiteKeyboard.webp",
      price: 200,
      countInStock: 0,
      brand: "Keyboard Store",
      rating: 4.5,
      numReviews: 0,
      description: "white gaming keyboard",
    },

    {
      //_id: '3',
      name: "Black Keyboard",
      slug: "black-keyboard",
      category: "Keyboards",
      image: "/images/blackKeyboard.webp",
      price: 200,
      countInStock: 1000,
      brand: "Keyboard Store",
      rating: 4.5,
      numReviews: 0,
      description: "black gaming keyboard",
    },

    {
      //_id: '4',
      name: "Blue Keyboard",
      slug: "blue-keyboard",
      category: "Keyboards",
      image: "/images/blueKeyboard.webp",
      price: 200,
      countInStock: 1000,
      brand: "Keyboard Store",
      rating: 4.5,
      numReviews: 0,
      description: "blue gaming keyboard",
    },
    {
      //_id: '4',
      name: "Oil King Switches",
      slug: "oil-king-switches",
      category: "Switches",
      image: "/images/oil-king.webp",
      price: 95,
      countInStock: 1000,
      brand: "Keyboard Store",
      rating: 4.5,
      numReviews: 0,
      description: "Linear Switch",
    },
  ],
};

export default data;
