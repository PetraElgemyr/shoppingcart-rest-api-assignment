const mongoose = require("mongoose");
const Product = require("./Product");
const ProductSchema = require("./Product");

const ShoppingcartSchema = new mongoose.Schema({
  cartName: String,
  totalAmount: { type: Number, required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      productName: { type: String, required: true },
      productPrice: { type: Number, required: true },
      amount: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Shoppingcart", ShoppingcartSchema);
