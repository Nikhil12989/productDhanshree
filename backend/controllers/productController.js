import slugify from "slugify";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";

import fs from "fs";

import dotenv from "dotenv";

dotenv.config();

// Create Product Controller

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.fields;
    const { photo } = req.files;

    // Validation for creating products
    switch (true) {
      case !name:
        return res.status(400).json({ error: { message: "Name is required" } });
      case !description:
        return res
          .status(400)
          .json({ error: { message: "Description is required" } });
      case !price:
        return res
          .status(400)
          .json({ error: { message: "Price is required" } });
      case !category:
        return res
          .status(400)
          .json({ error: { message: "Category is required" } });
      case !quantity:
        return res
          .status(400)
          .json({ error: { message: "Quantity is required" } });
      case photo && photo.size > 5242880:
        return res
          .status(413)
          .json({ error: { message: "Photo should be less than 5 MB" } });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};

//Get  All Product Controller

export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      count: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting product",
      error: error.message,
    });
  }
};

//Get Single Product

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single product fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error in Getting single product",
      error,
    });
  }
};

//product Photo Controller

export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in fetching photo",
      error,
    });
  }
};

//delete Product Controller

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(201).send({
      success: true,
      message: "Product Deleted succesfully",
    });
  } catch (error) {
    console.log(error);
    rea.status(500).send({
      success: false,
      message: "Error While deleting product",
    });
  }
};

//update product controller

export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.fields;
    const { photo } = req.files;

    // Validation if the products  entered are correct
    switch (true) {
      case !name:
        return res.status(400).json({ error: { message: "Name is required" } });
      case !description:
        return res
          .status(400)
          .json({ error: { message: "Description is required" } });
      case !price:
        return res
          .status(400)
          .json({ error: { message: "Price is required" } });
      case !category:
        return res
          .status(400)
          .json({ error: { message: "Category is required" } });
      case !quantity:
        return res
          .status(400)
          .json({ error: { message: "Quantity is required" } });
      case photo && photo.size > 5242880:
        return res
          .status(413)
          .json({ error: { message: "Photo should be less than 5 MB" } });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();

    res.status(201).json({
      success: true,
      message: "Product updated successfully",
      product: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
      message: "Error in Updating product",
    });
  }
};

// Product Filter Product
export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};

    if (checked.length > 0) args.category = checked;

    // Check if radio is not null or undefined before accessing its length
    if (radio != null && radio.length) {
      args.price = { $gte: radio[0], $lte: radio[1] };
    }

    const products = await productModel.find(args);

    res.status(201).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in filter product",
      error,
    });
  }
};

// Product Count Controller

export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Counting product",
      error,
    });
  }
};

// Product List Controller

export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;

    // Fetch paginated products excluding the "photo" field and sorting by "createdAt" in descending order
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    // Send a successful response with the list of products
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    // Log the error and send an error response
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in Product List controller",
      error: error.message, // Provide the error message in the response
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// similar products
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

//product Category Controller

export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Product Category Controller",
    });
  }
};
