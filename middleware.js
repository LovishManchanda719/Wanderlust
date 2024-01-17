const Listing=require("./models/listing.js");
const ExpressError=require("./utils/expressError.js");
const listingSchema=require("./schema.js");
const reviewSchema=require("./schema.js");
module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","you must be logged in");
        return res.redirect("/login");
    }
    next();
};
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
//validateListing function
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error)
    {
        throw new ExpressError(400,error);
    }
    else
    {
        next();
    }
};
//validateReview function
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error)
    {
        throw new ExpressError(400,error);
    }
    else
    {
        next();
    }
};