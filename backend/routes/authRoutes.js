import express from "express";
import {
  createOrderController,
  deleteOrderController,
  deleteUser,
  getAllOrdersController,
  getUsers,
  loginController,
  registerController,
  updateOrderController,
} from "../controllers/authController.js";

// import { requireSignIn } from "./../middlewares/authMiddleware.js"; // dont use it

const router = express.Router();

//Signup Ai Router

router.post("/signup", registerController);

//Sign in Router

router.post("/signin", loginController);

// Get all users route
router.get("/users", getUsers);

// Delete user route
router.delete("/users/:userId", deleteUser);

// Route to create a new order
router.post("/create-order", createOrderController);

// Route to get all orders
router.get("/get-orders", getAllOrdersController);

//Delete Order

router.delete("/delete-order/:id", deleteOrderController);

//Update Order

router.put("/update-order/:id", updateOrderController);

export default router;
