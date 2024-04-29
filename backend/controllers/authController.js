import { comparePassword, hashpassword } from "../helpers/authHelpers.js";
import userModel from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import JWT from "jsonwebtoken";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

//REGISTER USER || POST REQUEST

export const registerController = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;
    //validation
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!phone) {
      return res.send({ message: "phone number is required" });
    }
    if (!address) {
      return res.send({ message: "Address is required" });
    }

    //check user
    const existingUser = await userModel.findOne({ email });

    //existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please Login",
      });
    }
    //register user
    const hashedPassword = await hashpassword(password);

    //save

    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Succesfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};

//LOGIN || POST REQUEST

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation of user
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email or Password ",
      });
    }
    //Checking User
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is Not Registered",
      });
    }

    //User Matching
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    //Token Creation
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login Succesful",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

//Test Controller

export const testController = (req, res) => {
  res.send("Protected Route");
};

// Get all users controller
export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).send({
      success: true,
      message: "Users retrieved successfully",
      users: users,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error retrieving users",
      error: error,
    });
  }
};

// Delete user controller
export const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const deletedUser = await userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error deleting user",
      error: error,
    });
  }
};

//

//Reset Password contoller

// Confirm Password

// Confirm Password

// Create Order Controller

// orderController.js

// Controller function to create a new order
export const createOrder = async (req, res) => {
  try {
    const { user, products, totalPrice, shippingAddress } = req.body;

    // Create a new order
    const newOrder = new Order({
      user,
      products,
      totalPrice,
      shippingAddress,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order" });
  }
};

// Controller function to get all orders

export const createOrderController = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      pinCode,
      state,
      products,
      totalPrice,
    } = req.body;

    const newOrder = new Order({
      firstName,
      lastName,
      email,
      phone,
      address,
      pinCode,
      state,
      products,
      totalPrice,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//get all orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await Order.find().populate("products.product", "name"); // Populate product names
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete order by id

export const deleteOrderController = async (req, res) => {
  try {
    const { id } = req.params;

    //find order by Id
    const deleteOrder = await Order.findByIdAndDelete(id);

    if (!deleteOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order Deleted succesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update order controller

export const updateOrderController = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    //Find Order by ID and Update

    const updatedOrder = await Order.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
