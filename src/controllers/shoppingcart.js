const { json } = require("express");
const Product = require("../models/Product");
const Shoppingcart = require("../models/Shoppingcart");
const { NotFoundError, BadRequestError } = require("./../utils/errors");

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

exports.deleteShoppingcartById = async (req, res, next) => {
  try {
    const cartId = req.params.cartId;
    const cartToDelete = await Shoppingcart.findById(cartId);

    if (!cartToDelete) {
      return res.sendStatus(404);
    }

    await cartToDelete.delete();

    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "oh no something went wrong",
    });
  }
};

exports.emptyShoppingcart = async (req, res, next) => {
  try {
    const cartId = req.params.cartId;
    const shoppingcart = await Shoppingcart.findById(cartId);

    if (shoppingcart.products.length > 0) {
      shoppingcart.products.splice(0, shoppingcart.products.length);
      shoppingcart.totalAmount = 0;
      await shoppingcart.save();
      return res.status(201).json(shoppingcart);
    }
  } catch (error) {
    return res.status(500).json({
      message: "oh no something went wrong",
    });
  }
};
