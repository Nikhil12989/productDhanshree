import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Authroutes from "./routes/authRoutes.js";
import categoryRoute from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });


  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)


const app = express();

// Set the views directory
app.set("views", "F:/dhanshree/backend/views");

// Set EJS as the view engine
app.set("view engine", "ejs");

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname,'../frontend/build')))

app.use("/uploads", express.static("uploads"));

//Api Routes
app.use("/api/auth", Authroutes);
app.use("/api/category", categoryRoute);
app.use("/api/product", productRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/cart", cartRoutes);


app.use('*' , function(req , res){
 res.sendFile(path.join(__dirname , '../frontend/build/index.html' ))
})


// Render EJS views
app.get("/", (req, res) => {
  res.render("index", { message: "Hello, EJS!" });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
