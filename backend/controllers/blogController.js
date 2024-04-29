import slugify from "slugify";
import blogModel from "../models/blogModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";

// create blog controller

export const createBlog = async (req, res) => {
  try {
    const { title, description, author } = req.fields;
    const { photo } = req.files;

    //validation

    switch (true) {
      case !title:
        return res
          .status(400)
          .json({ error: { message: "Title is required" } });
      case !description:
        return res
          .status(400)
          .json({ error: { message: "Description is required" } });
      case !author:
        return res
          .status(400)
          .json({ error: { message: "Author is required" } });

      case photo && photo.size > 5242880:
        return res
          .status(413)
          .json({ error: { message: "Photo should be less than 5 MB" } });
    }

    const blog = new blogModel({ ...req.fields, slug: slugify(title) });

    if (photo) {
      blog.photo.data = fs.readFileSync(photo.path);
      blog.photo.contentType = photo.type;
    }

    await blog.save();

    res.status(201).json({
      success: true,
      message: "blog created successfully",
      blog: blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
      message: "Error in creating blog",
    });
  }
};

// Blog Photo Controller

export const blogPhotoController = async (req, res) => {
  try {
    const blog = await blogModel.findById(req.params.bid).select("photo");
    if (blog.photo.data) {
      res.set("Content-type", blog.photo.contentType);
      return res.status(200).send(blog.photo.data);
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

// delete blog controlller

export const deleteBlogController = async (req, res) => {
  try {
    await blogModel.findByIdAndDelete(req.params.bid).select("-photo");
    res.status(201).send({
      success: true,
      message: "blog Deleted succesfully",
    });
  } catch (error) {
    console.log(error);
    rea.status(500).send({
      success: false,
      message: "Error While deleting product",
    });
  }
};

// update Blog Controller

// update Blog Controller

export const updateBlogController = async (req, res) => {
  try {
    const { title, description, author } = req.fields;
    const { photo } = req.files;

    // Validation
    switch (true) {
      case !title:
        return res
          .status(400)
          .json({ error: { message: "Title is required" } });
      case !description:
        return res
          .status(400)
          .json({ error: { message: "Description is required" } });
      case !author:
        return res
          .status(400)
          .json({ error: { message: "Author is required" } });
      case photo && photo.size > 5242880:
        return res
          .status(413)
          .json({ error: { message: "Photo should be less than 5 MB" } });
    }

    const blog = await blogModel.findByIdAndUpdate(
      req.params.bid,
      { ...req.fields, slug: slugify(title) },
      { new: true }
    );

    if (photo) {
      blog.photo.data = fs.readFileSync(photo.path);
      blog.photo.contentType = photo.type;
    }

    await blog.save();

    res.status(201).json({
      success: true,
      message: "blog updated successfully",
      blog: blog,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error,
      message: "Error in Updating blog",
    });
  }
};

//Get Blog Controller

export const getBlogController = async (req, res) => {
  try {
    const blog = await blogModel
      .find({})
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      count: blog.length,
      message: "All blogs",
      blog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting blog",
      error: error.message,
    });
  }
};

export const getCounts = async (req, res) => {
  try {
    const blogCount = await blogModel.countDocuments();
    const categoryCount = await categoryModel.countDocuments();
    const orderCount = await orderModel.countDocuments();
    const productCount = await productModel.countDocuments();
    const userCount = await userModel.countDocuments();

    res.json({
      blogCount,
      categoryCount,
      orderCount,
      productCount,
      userCount,
    });
  } catch (error) {
    console.error("Error fetching counts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
