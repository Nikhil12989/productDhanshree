import express from "express";

import {
  createProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  deleteProductController,
  updateProductController,
  productFilterController,
  productCountController,
  productListController,
  searchProductController,
  realtedProductController,
  productCategoryController,
} from "../controllers/productController.js";
import formidable from "express-formidable";

const router = express.Router();

//Routes
``;
//create product route

router.post("/create-product", formidable(), createProductController);

//update  product route

router.put("/update-product/:pid", formidable(), updateProductController);

//Get all Products

router.get("/get-product", getProductController);

//Get single products

router.get("/get-product/:slug", getSingleProductController);

//Get Single photo

router.get("/product-photo/:pid", productPhotoController);

//Delete product

router.delete("/delete-product/:pid", deleteProductController);

//filter product

router.post("/product-filters", productFilterController);

//Count  pagination

router.get("/product-count", productCountController);

//product per page pagination

router.get("/product-list/:page", productListController);

//search product

router.get("/search/:keyword", searchProductController);

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);

//categorywise product

router.get("/product-category/:slug", productCategoryController);

export default router;
