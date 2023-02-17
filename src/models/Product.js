const mongoose = require("mongoose");

const ProductSchema2 = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    min: 3,
    max: 50,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    default: 1,
  },
});

module.exports = mongoose.model("Product", ProductSchema2);
