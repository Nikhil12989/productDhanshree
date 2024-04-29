import express from "express";
import {
  blogPhotoController,
  createBlog,
  deleteBlogController,
  getBlogController,
  getCounts,
  updateBlogController,
} from "../controllers/blogController.js";
import formidable from "express-formidable";

const router = express.Router();

//Create Blog Route

router.post("/create-blog", formidable(), createBlog);

// get single blog photo route

router.get("/blog-photo/:bid", blogPhotoController);

// delete blog route

router.delete("/delete-blog/:bid", deleteBlogController);

//update blog route

router.put("/update-blog/:bid", formidable(), updateBlogController);

// get all blogs

router.get("/get-blog", getBlogController);

// get all count

router.get("/getcount", getCounts);

export default router;
