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

exports.addProductToShoppingcart = async (req, res, next) => {
  try {
    const cartId = req.body.cartId;
    const productId = req.params.productId;

    const shoppingcart = await Shoppingcart.findById(cartId);

    if (!shoppingcart) {
      throw new NotFoundError("Sorry! This shoppingcart does not exist");
    }

    const productToAdd = await Product.findById(productId);

    if (!productToAdd) {
      throw new NotFoundError("Sorry! This product does not exist");
    }

    console.log("produkten", productToAdd);
    console.log("varukorgen", shoppingcart);

    shoppingcart.totalAmount = 0;

    for (let i = 0; i < shoppingcart.products.length; i++) {
      if (shoppingcart.products[i]._id == productId) {
        shoppingcart.products[i].amount++;
        await shoppingcart.save();
        return res.status(201).json(shoppingcart);
      }

      for (let i = 0; i < shoppingcart.products.length; i++) {
        shoppingcart.totalAmount +=
          shoppingcart.products[i].productPrice *
          shoppingcart.products[i].amount;
      }
      await shoppingcart.save();
      return res.status(201).json(shoppingcart);
    }

    for (let i = 0; i < shoppingcart.products.length; i++) {
      if (shoppingcart.products[i]._id != productId) {
        shoppingcart.products.push(productToAdd);
        await shoppingcart.save();
        return res.status(201).json(shoppingcart);
      }

      for (let i = 0; i < shoppingcart.products.length; i++) {
        shoppingcart.totalAmount +=
          shoppingcart.products[i].productPrice *
          shoppingcart.products[i].amount;
      }
      await shoppingcart.save();
      return res.status(201).json(shoppingcart);
    }
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "oh no something went wrong",
    });
  }
};

/**/

//doesn't work :(
exports.reduceProductAmountFromShoppingcart = async (req, res, next) => {
  try {
    const cartId = req.body.cartId;
    const givenProductId = req.params.productId;

    const shoppingcart = await Shoppingcart.findById(cartId);
    if (!shoppingcart) {
      throw new NotFoundError("Sorry! This shoppingcart does not exist");
    }

    const productToRemove = await Product.findById(productId);
    if (!productToRemove) {
      throw new NotFoundError("Sorry! This product does not exist");
    }

    shoppingcart.totalAmount = 0;
    await shoppingcart.save();
    // for (let i = 0; i < shoppingcart.products.length; i++) {
    //   if (shoppingcart.products[i]._id == productId) {
    //     shoppingcart.products[i].amount--;

    //     if (shoppingcart.products[i].amount < 1) {
    //       shoppingcart.products.splice([i], 1);
    //       await shoppingcart.save();
    //       return res.status(201).json(shoppingcart);
    //     }
    //   }

    //   for (let i = 0; i < shoppingcart.products.length; i++) {
    //     shoppingcart.totalAmount +=
    //       shoppingcart.products[i].productPrice *
    //       shoppingcart.products[i].amount;
    //   }

    //   await shoppingcart.save();
    //   return res.status(201).json(shoppingcart);
    // }

    for (let i = 0; i < shoppingcart.products.length; i++) {
      if (shoppingcart.products[i]._id == givenProductId) {
        shoppingcart.products[i].amount--;
        await shoppingcart.save();

        if (shoppingcart.products[i].amount < 1) {
          shoppingcart.products.splice([i], 1);
          await shoppingcart.save();
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
    /*

*/
  } catch (error) {
    return res.status(500).json({
      message: "oh no something went wrong",
    });
  }
};

exports.deleteProductInShoppingcart = async (req, res, next) => {
  try {
    const cartId = req.body.cartId;
    const givenProductId = req.params.productId;
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
  } catch (error) {
    return res.status(500).json({
      message: "oh no something went wrong",
    });
  }
};
