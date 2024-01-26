const mongoose=require("mongoose");//Requiring mongoose to access Mongodb
//Making a Schema
const Schema=mongoose.Schema;
const reviewSchema=new mongoose.Schema({
    comment: String,
    rating:{
        type: Number,
        min:1,
        max:5
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});
module.exports=mongoose.model("Review",reviewSchema);