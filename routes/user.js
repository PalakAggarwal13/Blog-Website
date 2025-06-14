const {Router} = require("express");
const {User} = require("../models/user");

const router = Router();

router.get("/signup",(req,res)=>{
    return res.render("signup");
})


router.get("/signin",(req,res)=>{
    return res.render("signin");
})


router.post("/signup", async(req,res)=>{
  const {fullName,email,password} = req.body;
  try{
    await User.create({
    fullName,
    email,
    password,
  });
  return res.redirect("/");
  }catch(error){
     let message = "Something went wrong.";
    if (error.code === 11000) {
      message = "Email is already registered.";
  }
  return res.render("signup", { error: message });
}
});

router.post("/signin" , async(req,res)=>{
    const {email,password} = req.body;
    try{
    const token = await User.matchPasswordAndGenerateToken(email,password);
    return res.cookie("token",token).redirect("/");
    }catch(error){
        return res.render("signin",{
            error: "Incorect Email or Password",
        })
    }
  
})

router.get("/logout" , (req,res)=>{
    res.clearCookie("token").redirect("/");
})


module.exports = router;