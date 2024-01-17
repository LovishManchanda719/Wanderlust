//Requiring mongoose
const mongoose=require("mongoose");
const Review=require("./review.js");
const Schema=mongoose.Schema;
//Listing Schema
const listingSchema= new mongoose.Schema(
    {
        title:
        {
            type:String,
            required: true
        },
        description:
        {
            type: String
        },
        image:
        {
            url: String,
            filename:String
        },
        price: Number,
        location: String,
        country: String,
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review"
            }
        ],
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
        }
    }
);
listingSchema.post("findOneAndDelete",async(listing)=>{
    await Review.deleteMany({_id:{$in: listing.reviews}});
});
const Listing=mongoose.model("Listing", listingSchema);
module.exports= Listing;