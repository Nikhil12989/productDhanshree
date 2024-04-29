import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cartController.js";

const router = express.Router();

// Add item to cart route
router.post("/cart/add", addToCart);

// Get user's cart route
router.get("/cart", getCart);

// Update item quantity in cart route
router.put("/cart/update/:itemId", updateCartItem);

// Remove item from cart route
router.delete("/cart/remove/:itemId", removeCartItem);

export default router;
