const express = require("express");
const mongoose = require("mongoose");
const path = require ("path");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const Blog = require("./models/blog");

const app = express();
const PORT = 8000;

mongoose.connect("mongodb://localhost:27017/nlogify")
.then((e)=> console.log("MongoDB Connected"));

app.set("view engine","ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));
app.use(methodOverride('_method'));

app.get("/", async (req,res)=>{
    try{
         const allBlogs = await Blog.find({})
    return res.render("home",{
        user: req.user,
        blogs: allBlogs,
    });
    }catch (err) {
    console.error("Failed to load blogs:", err);
    return res.status(500).send("Internal Server Error");
  }
   
})

app.use("/user" , userRoute);
app.use("/blog",blogRoute);

app.listen(PORT,()=>console.log(`Server Started at PORT:${PORT}`));