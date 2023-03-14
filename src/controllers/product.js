const { json } = require("express");
const Product = require("../models/Product");
const Shoppingcart = require("../models/Shoppingcart");
const { NotFoundError, BadRequestError } = require("./../utils/errors");

exports.getAllProducts = async (req, res, next) => {
  const limit = Number(req.query?.limit || 10);
  const offset = Number(req.query?.offset || 0);
  const products = await Product.find().limit(limit).skip(offset);
  const totalProductsInDatabase = await Product.countDocuments();

  return res.json({
    data: products,
    meta: {
      total: totalProductsInDatabase,
      limit: limit,
      offset: offset,
      count: products.length,
    },
  });
};

exports.getProductById = async (req, res, next) => {
  const productId = req.params.productId;

  const product = await Product.findById(productId);

  if (!product) throw new NotFoundError("Sorry! This product does not exist");

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

    if (shoppingcart.products.length == 0) {
      shoppingcart.products.push(productToAdd);
      await shoppingcart.save();

      for (let i = 0; i < shoppingcart.products.length; i++) {
        shoppingcart.totalAmount +=
          shoppingcart.products[i].productPrice *
          shoppingcart.products[i].amount;
      }
      await shoppingcart.save();
      return res.status(201).json(shoppingcart);
    }

    if (shoppingcart.products.length > 0) {
      for (let i = 0; i < shoppingcart.products.length; i++) {
        if (shoppingcart.products[i]._id == productId) {
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
        if (shoppingcart.products[i]._id != productId) {
          shoppingcart.products.push(productToAdd);
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
    }
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "oh no something went wrong",
    });
  }
};

exports.reduceProductAmountFromShoppingcart = async (req, res, next) => {
  try {
    const cartId = req.body.cartId;
    const givenProductId = req.params.productId;

    const shoppingcart = await Shoppingcart.findById(cartId);
    if (!shoppingcart) {
      throw new NotFoundError("Sorry! This shoppingcart does not exist");
    }

    const productToRemove = await Product.findById(givenProductId);
    if (!productToRemove) {
      throw new NotFoundError("Sorry! This product does not exist");
    }

    shoppingcart.totalAmount = 0;
    await shoppingcart.save();

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
