const { json } = require("express");
const Product = require("../models/Product");
const Shoppingcart = require("../models/Shoppingcart");

exports.getAllShoppingcarts = async (req, res, next) => {
  /* 
    Get only number of projects specified in "limit" query
    parameter. Default limit is 10 (aka unless told otherwise
    only get 10 projects at a time)
  */
  const limit = Number(req.query?.limit || 10);

  /* 
    Skip the number of projects specified in the "offset"
    query parameter according to default project sorting. 
    If no offset given, default is 0 (aka start from the
    beginning)
	*/
  const offset = Number(req.query?.offset || 0);

  // Get all carts; filter according to "limit" and "offset" query params
  const carts = await Shoppingcart.find().limit(limit).skip(offset);
  // Get total number of projects available in database
  const totalCartsInDatabase = await Shoppingcart.countDocuments();
  // Create and send our response
  return res.json({
    data: carts, // Send projects result
    meta: {
      // meta information about request
      total: totalCartsInDatabase, // Total num projects available in db
      limit: limit, // Num of projects asked for
      offset: offset, // Num or projects asked to skip
      count: carts.length, // Num of projects sent back
    },
  });
};

exports.getShoppingcartById = async (req, res, next) => {
  // Get our project id (put in local variable)
  const cartId = req.params.cartId;

  // Find project with that id
  const cart = await Shoppingcart.findById(cartId);

  // IF(no project) return 404
  if (!cart) throw new NotFoundError("Sorry! This shoppingcart does not exist");

  // respond with project data (200 OK)
  return res.json(cart);
};

exports.createNewShoppingcart = async (req, res, next) => {
  // Get data from req.body and place in local variables
  const cartName = req.body.cartName || "";
  //   const totalAmount = req.body.totalAmount;
  //   const products = req.body.products;

  // If (no name || name is empty string) respond bad request
  if (!cartName)
    throw new BadRequestError("You must provide a name for your cart");

  // Create cart
  const newCart = await Shoppingcart.create({
    cartName: cartName,
    totalAmount: 0,
    //new cart is empty, totalAmount is 0
    products: [],
    //new cart should be empty from the beginning
  });

  // Respond
  // prettier-ignore
  return res
    // Add Location header to response
    // Location header = URI pointing to endpoint where user can get new project
    .setHeader(
      'Location', 
      `http://localhost:${process.env.PORT}/api/v1/shoppingcarts/${newCart._id}`
    )
    .status(201)
    .json(newCart)
};

exports.addProductToShoppingcart = async (req, res, next) => {
  const cartId = req.params.cartId;
  const givenProductId = req.body.productId;

  const shoppingcart = await Shoppingcart.findById(cartId);

  if (!shoppingcart) {
    throw new NotFoundError("Sorry! This shoppingcart does not exist");
  }

  const productToAdd = await Product.findById(givenProductId);

  if (!productToAdd) {
    throw new NotFoundError("Sorry! This product does not exist");
  }

  shoppingcart.totalAmount = 0;

  for (let i = 0; i < shoppingcart.products.length; i++) {
    // return console.log(json(shoppingcart.products[i].productId));
    if (shoppingcart.products[i]._id == givenProductId) {
      shoppingcart.products[i].amount++;
      await shoppingcart.save();

      for (let i = 0; i < shoppingcart.products.length; i++) {
        shoppingcart.totalAmount +=
          shoppingcart.products[i].productPrice *
          shoppingcart.products[i].amount;
      }
      await shoppingcart.save();

      return res.status(201).json(shoppingcart);
    }
  }

  for (let i = 0; i < shoppingcart.products.length; i++) {
    if (shoppingcart.products[i]._id != givenProductId) {
      shoppingcart.products.push(productToAdd);
      // shoppingcart.products[i].amount = 1;
      await shoppingcart.save();

      for (let i = 0; i < shoppingcart.products.length; i++) {
        shoppingcart.totalAmount +=
          shoppingcart.products[i].productPrice *
          shoppingcart.products[i].amount;
      }
      await shoppingcart.save();

      return res.status(201).json(shoppingcart);
    }
  }
};

exports.reduceProductAmountFromShoppingcart = async (req, res, next) => {
  const cartId = req.params.cartId;
  const givenProductId = req.body.productId;
  const shoppingcart = await Shoppingcart.findById(cartId);

  shoppingcart.totalAmount = 0;

  for (let i = 0; i < shoppingcart.products.length; i++) {
    // return console.log(json(shoppingcart.products[i].productId));

    if (shoppingcart.products[i]._id == givenProductId) {
      shoppingcart.products[i].amount--;
      // await shoppingcart.save();

      if (shoppingcart.products[i].amount < 1) {
        shoppingcart.products.splice([i], 1);
        // await shoppingcart.save();
      }

      for (let i = 0; i < shoppingcart.products.length; i++) {
        shoppingcart.totalAmount +=
          shoppingcart.products[i].productPrice *
          shoppingcart.products[i].amount;
      }

      await shoppingcart.save();
      return res.status(201).json(shoppingcart);
    }
  }
};

exports.deleteProductFromShoppingcart = async (req, res, next) => {
  const cartId = req.params.cartId;
  const givenProductId = req.body.productId;
  const shoppingcart = await Shoppingcart.findById(cartId);

  shoppingcart.totalAmount = 0;

  for (let i = 0; i < shoppingcart.products.length; i++) {
    if (shoppingcart.products[i]._id == givenProductId) {
      shoppingcart.products.splice([i], 1);
      await shoppingcart.save();
    }
  }
  for (let i = 0; i < shoppingcart.products.length; i++) {
    shoppingcart.totalAmount +=
      shoppingcart.products[i].productPrice * shoppingcart.products[i].amount;
  }
  await shoppingcart.save();
  return res.status(201).json(shoppingcart);
};

// exports.emptyShoppingcart = async (req, res, next) => {
//   const cartId = req.params.cartId;
//   const shoppingcart = await Shoppingcart.findById(cartId);
//   shoppingcart.totalAmount = 0;
//   await shoppingcart.save();

//   return res.status(201).json(shoppingcart.products.length);
//   // shoppingcart.products.splice(0, shoppingcart.products.length);

//   // await shoppingcart.save();
//   // return res.status(201).json(shoppingcart);
// };
