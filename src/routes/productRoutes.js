const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  // addProductToShoppingcart,
} = require("../controllers/product");

//getAllProducts
router.get("/", getAllProducts);

router.get("/:productId", getProductById);

// router.post("/:productId", addProductToShoppingcart);

module.exports = router;
