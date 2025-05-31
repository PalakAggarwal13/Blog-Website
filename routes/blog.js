const {Router} = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const {checkForAuthenticationCookie} = require("../middlewares/authentication");

const router = Router();

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        const uploadPath = path.resolve(`./public/uploads/${req.user._id}`);
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null,uploadPath);
    },
    filename: function(req,file,cb){
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null,fileName);
    }
})  

const upload = multer({storage});

router.get("/add-new",(req,res)=>{
    return res.render("addBlog" , {
        user:req.user,
    })
})

router.post("/",upload.single("coverImage"),async(req,res)=>{
    try{
        const {title,body} = req.body
        if(!req.user){
            return res.status(401).send("Unauthorized");
        }
    
    
    const blog = await Blog.create({
        body,
        title,
        createdBy:req.user._id,
        coverImageURL:`/uploads/${req.user._id}/${req.file.filename}`
    });
    
   return res.redirect(`/blog/${blog._id}`);
} catch(error){
     console.error("Error creating blog:", error);
    return res.status(500).send("Internal Server Error");
}
});


router.get("/:id", async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId).populate("createdBy");
    const comments = await Comment.find({blogId:req.params.id}).populate("createdBy");
    if (!blog) {
      return res.status(404).send("Blog post not found");
    }

    return res.render("blog", {
      blog,
      user: req.user,
      comments,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    return res.status(500).send("Internal Server Error");
  }
});

router.post("/comment/:blogId", async(req,res)=>{
await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
})

module.exports = router;
