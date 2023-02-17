const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  addProductToShoppingcart,
  reduceProductAmountFromShoppingcart,
  deleteProductInShoppingcart,
} = require("../controllers/product");

//getAllProducts
router.get("/", getAllProducts);

router.get("/:productId", getProductById);

router.post("/:productId", addProductToShoppingcart);

router.delete("/:productId", deleteProductInShoppingcart);

router.put("/:productId", reduceProductAmountFromShoppingcart);

module.exports = router;
