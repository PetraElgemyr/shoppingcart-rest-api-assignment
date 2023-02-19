const express = require("express");
const router = express.Router();
const {
  getAllShoppingcarts,
  createNewShoppingcart,
  getShoppingcartById,
  deleteShoppingcartById,
  emptyShoppingcart,
} = require("../controllers/shoppingcart");

// GET /api/v1/shoppingcarts
router.get("/", getAllShoppingcarts);

router.get("/:cartId", getShoppingcartById);

router.post("/", createNewShoppingcart);

router.put("/:cartId", emptyShoppingcart);

router.delete("/:cartId", deleteShoppingcartById);

module.exports = router;
