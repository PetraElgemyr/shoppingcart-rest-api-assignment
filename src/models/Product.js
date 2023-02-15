const mongoose = require("mongoose");

// const ProductSchema = new mongoose.Schema({
//   productName: {
//     type: String,
//     required: true,
//     minLength: 3,
//     maxLength: 50,
//   },
//   productPrice: {
//     type: Number,
//     required: true,
//   },
//   amount: {
//     type: Number,
//   },
//   // shoppingcart: {
//   //   type: mongoose.Schema.Types.ObjectId,
//   //   ref: "ShoppingCart",
//   //   required: true,
//   // },
// });

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
