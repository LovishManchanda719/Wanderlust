const Listing=require("../models/listing");
module.exports.index= async function(request,response)
{
    let listings=await Listing.find();
    response.render("listings/index.ejs", {listings });
};
module.exports.getCreatePage=function(request,response)
{
    response.render("listings/create.ejs");
};
module.exports.createPage=async function(request,response,next)
{
        const newListing=new Listing(request.body.listing);
        newListing.owner=request.user._id;
        await newListing.save(); 
        request.flash("success","New listing created successfully");
        response.redirect("/listings");
    };
    module.exports.viewPage = async function(request, response) {
        let { id } = request.params;
    
        try {
            let listing = await Listing.findById(id).populate({
                path: 'reviews',
                populate: { path: 'owner' } // Populate the owner field of each review
            }).populate("owner");
    
            if (listing === null) {
                request.flash("error", "Listing doesn't exist");
                response.redirect("/listings");
            } else {
                    response.render("listings/show.ejs", { listing});
            }
        } catch (error) {
            console.error(error);
            response.status(500).send("Internal Server Error");
        }
    };
    
module.exports.getUpdatePage=async function(request,response){
    let { id }= request.params;
    let listing=await Listing.findById(id);
    if(listing===null){
        request.flash("error","Listing doesn't exist");
        response.redirect("/listings");
    }
    else{
        response.render("listings/edit.ejs");
    }
};
module.exports.updatePage=async function(request,response)
{
    let { id }= request.params;
    let listing=await Listing.findByIdAndUpdate(id,request.body.listing);
    response.redirect(`/listings/${id}`);
};
module.exports.deletePage=async function(request,response)
{
    let { id }= request.params;
    await Listing.findByIdAndDelete(id);
    request.flash("success","Listing Deleted Succesfully");
    response.redirect("/listings");  
};