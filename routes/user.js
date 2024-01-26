//Basic setups
const express=require("express");
const app=express();
const router=express.Router();
const User=require("../models/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError=require("../utils/expressError.js");
const asyncWrap=require("../utils/wrapAsync.js");
const passport=require("passport");
const { getSignupPage } = require("../controllers/user.js");
const userController=require("../controllers/user.js");
router.get("/signup",userController.getSignupPage);
router.post("/signup",asyncWrap(userController.signup));
router.get("/login",userController.getLoginPage);
router.post("/login",
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true
    }),userController.login
);

//Logout User
router.get("/logout",userController.logout);
module.exports=router;