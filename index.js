const express = require("express");
const mongoose = require("mongoose");
const path = require ("path");
const userRoute = require("./routes/user");

const app = express();
const PORT = 8000;

mongoose.connect("mongodb://localhost:27017/nlogify")
.then((e)=> console.log("MongoDB Connected"));

app.set("view engine","ejs");
app.set("views", path.resolve("./views"));

app.get("/",(req,res)=>{
    return res.render("home");
})

app.use("/user" , userRoute);

app.listen(PORT,()=>console.log(`Server Statrted at PORT:${PORT}`));