//Basic setups
const express=require("express");
const app=express();
const router=express.Router({mergeParams:true});
const ExpressError=require("../utils/expressError.js");
const asyncWrap=require("../utils/wrapAsync.js");
const reviewSchema=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const session = require("express-session");
const flash = require("express-flash");
const {validateReview}=require("../middleware.js");
const reviewController=require("../controllers/review.js");
router.use(session({
    secret: "secretCode",
    resave: true,
    saveUninitialized: true
}));
router.use(flash());
router.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    errorMsg=req.flash("error");
    next();
});
//Reviews

//Create Review
router.post("/",validateReview,asyncWrap(reviewController.createReview));
//Delete Review
router.delete("/:reviewId",asyncWrap(reviewController.deleteReview));
module.exports=router;