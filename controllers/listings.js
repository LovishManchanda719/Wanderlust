const Listing=require("../models/listing");
module.exports.index= async function(request,response)
{
    let listings=await Listing.find();
    response.render("listings/index.ejs", {listings});
};
module.exports.getCreatePage=function(request,response)
{
    response.render("listings/create.ejs");
};
module.exports.createPage=async function(request,response,next)
{
    // let result=listingSchema.validate(request.body);
    // if(result.error)
    // {
    //     throw new ExpressError(400,"Enter Valid Data");
    // }
    // else
    // {
        let url=request.file.path;
        let filename=request.file.filename;
        console.log(url,filename);
        const newListing=new Listing(request.body.listing);
        newListing.owner=request.user._id;
        newListing.image={url,filename};
        await newListing.save(); 
        request.flash("success","New listing created successfully");
        response.redirect("/listings");
    // }
};
module.exports.viewPage=async function(request,response)
{
    let { id }= request.params;
    let listing=await Listing.findById(id).populate("owner");
  
    if(listing===null){
        request.flash("error","Listing doesn't exist");
        response.redirect("/listings");
    }
    else{
        response.render("listings/show.ejs", {listing});
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
        let originalImageUrl=listing.image.url;
        originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250");
        response.render("listings/edit.ejs", {listing,originalImageUrl});
    }
};
module.exports.updatePage=async function(request,response)
{
    let { id }= request.params;
    let listing=await Listing.findByIdAndUpdate(id,request.body.listing);
    if(typeof request.file!=="undefined"){
        let url=request.file.path;
        let filename=request.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    
    response.redirect(`/listings/${id}`);
};
module.exports.deletePage=async function(request,response)
{
    let { id }= request.params;
    await Listing.findByIdAndDelete(id);
    response.redirect("/listings");  
};