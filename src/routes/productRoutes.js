const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  addProductToShoppingcart,
  reduceProductAmountFromShoppingcart,
} = require("../controllers/product");

//getAllProducts
router.get("/", getAllProducts);

router.get("/:productId", getProductById);

router.post("/:productId", addProductToShoppingcart);

// router.delete("/:productId", deleteProductFromShoppingcart);

router.put("/:productId", reduceProductAmountFromShoppingcart);

// router.post("/:productId", addProductToShoppingcart);

module.exports = router;
