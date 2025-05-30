const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    body:{
        type:String,
        required:true,
    },
    coverImageURL:{
        type:String,
        required:false,
    }, 
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:"user",
    },
},{timestamps:true}
);

const Blog = model("blog",blogSchema);

module.exports = Blog;