const Product = require("../models/Product");
const Shoppingcart = require("../models/Shoppingcart");

exports.getAllProducts = async (req, res, next) => {
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

  // Get all products; filter according to "limit" and "offset" query params
  const products = await Product.find().limit(limit).skip(offset);
  // Get total number of projects available in database
  const totalProductsInDatabase = await Product.countDocuments();
  // Create and send our response
  return res.json({
    data: products, // Send projects result
    meta: {
      // meta information about request
      total: totalProductsInDatabase, // Total num projects available in db
      limit: limit, // Num of projects asked for
      offset: offset, // Num or projects asked to skip
      count: products.length, // Num of projects sent back
    },
  });
};

exports.getProductById = async (req, res, next) => {
  const productId = req.params.productId;

  // Find project with that id
  const product = await Product.findById(productId);

  // IF(no project) return 404
  if (!product) throw new NotFoundError("Sorry! This product does not exist");

  // respond with project data (200 OK)
  return res.json(product);
};

/*
exports.addProductToShoppingcart = async (req, res, next) => {
  try {
    //dessa skickas in i bodyn i postman (name, price, cartId)
    // const productName = req.body.productName || "";
    // const productPrice = req.body.productPrice;
    const cartId = req.body.cartId;
    const productId = req.params.productId;

    //does shoppingcart exists?
    const cart = await Shoppingcart.findById(cartId);

    if (!cart) {
      throw new NotFoundError("Sorry! This shoppingcart does not exist");
    }

    //if productName is not provided
    // if (!productName) {
    //   return res.status(400).json({
    //     message: "You must provide a product name",
    //   });
    // }

    //if product does not exist
    const productToAdd = await Product.findById(productId);

    if (!productToAdd) {
      throw new NotFoundError("Sorry! This product does not exist");
    }

    console.log(productToAdd);

    //om cart och product existerar

    // const myResponse = await Shoppingcart.find(productId);
    // if (!myResponse) {
    //   cart.productList.push(productToAdd);
    //   await cart.save();
    //   return res.status(201).json(cart);
    // }

    // if (myResponse) {
    //   cart.productList.amount++;
    // }

    for (let i = 0; i < cart.products.length; i++) {
      if (cart.products[i].productId === productId) {
        cart.products[i].amount++;

        return console.log(cart);
      }
    }

    cart.products.push(productToAdd);
    return cart;

    //om produkten inte finns i varukorgen redan
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "oh no something went wrong",
      // message: error.message,
    });
  }
};*/

exports.deleteProductInCart = async (req, res, next) => {};
