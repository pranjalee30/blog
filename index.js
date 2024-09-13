require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");
const Blog = require("./models/blog");
const app = express();

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));


app.get("/", async (req,res)=>{
  const allBlogs =  await Blog.find({});
    res.render("home",{
      user: req.user,
      blogs:allBlogs,
    });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.resolve("./public")));

app.listen(PORT,()=>{
  console.log(`Server started at PORT: ${PORT}`);
});