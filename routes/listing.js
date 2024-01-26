//Basic setups

//Using EXPRESS module and EXPRESS-ROUTER
const express=require("express");
const app=express();
const router=express.Router();

//Using SESSSION module
const session = require("express-session");
const asyncWrap=require("../utils/wrapAsync.js");
const listingSchema=require("../schema.js");
const ExpressError=require("../utils/expressError.js");
const Listing=require("../models/listing.js");
const flash = require("connect-flash");
const {isLoggedIn}=require("../middleware.js");
const {isOwner}=require("../middleware.js");
const {validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
router.use(session({
    secret: "secretCode",
    resave: true,
    saveUninitialized: true
}));
router.get("/new",isLoggedIn, (listingController.getCreatePage));
router.route("/")
    .get(asyncWrap(listingController.index))
    .post(isLoggedIn,validateListing,asyncWrap(listingController.createPage));
router.route("/:id")
    .get(isLoggedIn,asyncWrap(listingController.viewPage))
    .put(isLoggedIn,isOwner,validateListing,asyncWrap(listingController.updatePage))
    .delete(isLoggedIn,isOwner,asyncWrap(listingController.deletePage));
router.get("/:id/edit",isLoggedIn,isOwner,asyncWrap(listingController.getUpdatePage));
module.exports=router;