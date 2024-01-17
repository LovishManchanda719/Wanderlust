//Basic setups
const express=require("express");
const app=express();
const router=express.Router();
const session = require("express-session");
const asyncWrap=require("../utils/wrapAsync.js");
const listingSchema=require("../schema.js");
const ExpressError=require("../utils/expressError.js");
const Listing=require("../models/listing.js");
const flash = require("express-flash");
const {isLoggedIn}=require("../middleware.js");
const {isOwner}=require("../middleware.js");
const {validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage });
router.use(session({
    secret: "secretCode",
    resave: true,
    saveUninitialized: true
}));
router.use(flash());
router.use((req,res,next)=>{
    res.locals.successMsg=req.flash("success");
    res.locals.errorMsg=req.flash("error");
    next();
});
//Home Page
router.get("/new",isLoggedIn, (listingController.getCreatePage));
// router.get("/",asyncWrap(listingController.index));
router.route("/")
    .get(asyncWrap(listingController.index))
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,asyncWrap(listingController.createPage));
    // .post(upload.single("listing[image]"),(req,res)=>{
    //     res.send(req.file);
    // });
router.route("/:id")
    .get(asyncWrap(listingController.viewPage))
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),asyncWrap(listingController.updatePage))
    .delete(isLoggedIn,isOwner,asyncWrap(listingController.deletePage));
//Create Page

// router.post("/",isLoggedIn,validateListing,asyncWrap(listingController.createPage));
//View Page
// router.get("/:id",asyncWrap(listingController.viewPage));
//Update Page
router.get("/:id/edit",isLoggedIn,isOwner,asyncWrap(listingController.getUpdatePage));
// router.put("/:id",isLoggedIn,isOwner,asyncWrap(listingController.updatePage));
//Delete Command
// router.delete("/:id",isLoggedIn,isOwner,asyncWrap(listingController.deletePage));
module.exports=router;