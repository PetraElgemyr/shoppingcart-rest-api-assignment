const mongoose = require("mongoose");
const Product = require("./Product");
const ProductSchema = require("./Product");

// const ShoppingcartSchema = new mongoose.Schema({
//   //Id genereras automatiskt
//   cartName: {
//     type: String,
//     required: true,
//   },
//   totalAmount: {
//     type: Number,
//     required: true,
//   },
//   productList: {
//     type: [mongoose.Schema.Types.ObjectId, Product.amount],
//     ref: "Product",
//     default: [],
//   },
// });

// people: {
//   name: String,
//   friends: [{firstName: String, lastName: String}]
//  }

const ShoppingcartSchema2 = new mongoose.Schema({
  cartName: String,
  totalAmount: { type: Number, required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId },
      productName: { type: String, required: true },
      productPrice: { type: Number, required: true },
      amount: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Shoppingcart", ShoppingcartSchema2);
