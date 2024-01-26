const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
module.exports.createReview = async (req, res) => {
    try {
        const { id } = req.params;// Extracting Id of listing
        // Extracting listing
        const listing = await Listing.findById(id);
        // Extracting review from request body
        const { review } = req.body;
        // Creating a new review
        const newReview = new Review(review);
        // Setting the owner of the review
        newReview.owner = req.user._id;
        // Check if the review owner is the same as the listing owner
        if (listing.owner.equals(req.user._id)) {
            req.flash("error", "You cannot post a review for your own listing.");
            return res.redirect(`/listings/${id}`);
        }
        // Saving the review
        await newReview.save();
        // Adding the review to the listing
        listing.reviews.push(newReview);
        // Saving the listing with the new review
        await listing.save();
        req.flash("success", "Review Created Successfully");
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        req.flash("error", "Error creating review.");
        res.redirect(`/listings/${id}`);
    }
};