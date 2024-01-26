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
const flash = require("connect-flash");
const {isLoggedIn}=require("../middleware.js");
const {isOwner}=require("../middleware.js");
const {isOwnerOfReview}=require("../middleware.js");
const {validateReview}=require("../middleware.js");
const reviewController=require("../controllers/review.js");
router.use(session({
    secret: "secretCode",
    resave: true,
    saveUninitialized: true
}));
router.post("/",validateReview,asyncWrap(reviewController.createReview));
module.exports=router;