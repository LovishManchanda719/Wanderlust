const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
module.exports.createReview=async (req,res)=>{
    let {id}=req.params;
    console.log(id);//Extracting Id of listing
    let listing=await Listing.findById(id)//Extracting listing
    let {review}=req.body;
    console.log(review);//Extracting review
    let newReview=new Review(review);
    await newReview.save();//Saving Review
    listing.reviews.push(newReview);
    await listing.save();//Saving review in Listing
    req.flash("success","Review Created Successfully");
    res.redirect(`/listings/${id}`);
};
module.exports.deleteReview=async(req,res)=>
{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}