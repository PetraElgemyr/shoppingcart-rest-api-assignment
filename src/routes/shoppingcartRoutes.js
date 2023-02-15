const express = require("express");
const router = express.Router();
const {
  getAllShoppingcarts,
  createNewShoppingcart,
  getShoppingcartById,
  addProductToShoppingcart,
  deleteProductFromShoppingcart,
  reduceProductAmountFromShoppingcart,
  emptyShoppingcart,
} = require("../controllers/shoppingcart");

// GET /api/v1/shoppingcarts
router.get("/", getAllShoppingcarts);

router.get("/:cartId", getShoppingcartById);

// POST /api/v1/shoppingcarts - Create new shoppingcart
router.post("/", createNewShoppingcart);

router.post("/:cartId", addProductToShoppingcart);

router.delete("/:cartId", deleteProductFromShoppingcart);

router.put("/:cartId", reduceProductAmountFromShoppingcart);

router.put("/:cartId", emptyShoppingcart);

module.exports = router;
