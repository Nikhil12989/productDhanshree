import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import userModel from "../models/userModel.js";

// Add item to cart controller
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id; // Assuming you have user information stored in the request object

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if the user has an existing cart
    let cart = await Cart.findOne({ user: userId });

    // If the user doesn't have a cart, create a new one
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if the product already exists in the cart
    const existingItemIndex = cart.items.findIndex((item) =>
      item.product.equals(productId)
    );

    if (existingItemIndex !== -1) {
      // If the product already exists in the cart, update the quantity
      cart.items[existingItemIndex].quantity += parseInt(quantity);
    } else {
      // If the product doesn't exist in the cart, add it
      cart.items.push({ product: productId, quantity: parseInt(quantity) });
    }

    // Save the cart
    await cart.save();

    res
      .status(201)
      .json({ success: true, message: "Item added to cart", cart });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error adding item to cart", error });
  }
};

// Get user's cart controller
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have user information stored in the request object

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    res.status(200).json({ success: true, message: "User's cart", cart });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error getting user's cart", error });
  }
};

// Update item quantity in cart controller
export const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id; // Assuming you have user information stored in the request object

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });

    // Find the index of the item in the cart
    const itemIndex = cart.items.findIndex((item) => item._id.equals(itemId));

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    // Update the quantity of the item
    cart.items[itemIndex].quantity = parseInt(quantity);

    // Save the cart
    await cart.save();

    res
      .status(200)
      .json({ success: true, message: "Item quantity updated", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating item quantity in cart",
      error,
    });
  }
};

// Remove item from cart controller
export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id; // Assuming you have user information stored in the request object

    // Find the user's cart
    const cart = await Cart.findOne({ user: userId });

    // Filter out the item to be removed
    cart.items = cart.items.filter((item) => !item._id.equals(itemId));

    // Save the cart
    await cart.save();

    res
      .status(200)
      .json({ success: true, message: "Item removed from cart", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error removing item from cart",
      error,
    });
  }
};
