//Setting up the EXPRESS module.
const express=require("express");
const app=express();
const Joi=require("joi");
const port=8080;
if(process.env.NODE_ENV!="production"){
    require("dotenv").config()
}
const dbUrl=process.env.ATLASDB_URL;
//To listen on server
app.listen(port,function()
{
    console.log("Server is listening on port "+port);
});
//Setting up the PATH module
const path=require("path"); //To require the built-in path module which is used to access files from different paths of the directory. 
app.set("views",path.join(__dirname,"views"));  //This is used to set the views path.
app.use(express.static(path.join(__dirname,"public"))); //This is used to set the public path and access the static files like css and javascript.

//Requiring Collection Schemas from models directory.
const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const User=require("./models/user.js");
    //To require JOI module for validation of parameters. 
//Setting up the MONGOOSE module
const mongoose=require("mongoose");
async function main()
{
    await mongoose.connect(dbUrl);
};
main()
.then(function()
{
    console.log("connection succesful");
})
.catch(function(err)
{
    console.log(err);
});
const reviewSchema=Joi.object(
    {
        review: Joi.object({
            rating: Joi.number().required().min(1).max(5),
            comment: Joi.string().required()
        }).required()
    }
);
const listingSchema=Joi.object(
    {
        listing:Joi.object(
            {
                title: Joi.string().required(),
                description: Joi.string().required(),
                location: Joi.string().required(),
                country:Joi.string().required(),
                price: Joi.number().required().min(0),
                imageUrl: Joi.string().required()
            }
        ).required()
    }
);
//Using EJS module. It is used to access and view ejs templates
const ejsMate=require("ejs-mate");
app.set("view engine","ejs");
app.engine("ejs",ejsMate);
const methodOverride= require("method-override");//This is used to override the get and post methods to use put and delete methods.
const asyncWrap=require("./utils/wrapAsync.js");//Asyncwrap is an error-handling middleware which is used to move to next error handling middleware when an error occurs in asynchronous req-res cycle.
const ExpressError=require("./utils/expressError.js");//This is error handling middleware to throw an error.
const {isLoggedIn}=require("./middleware.js");
const flash=require("connect-flash");//To flash messages only once.

//Requiring Routes
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const footerRouter=require("./routes/footer.js");

const passport=require("passport");
const LocalStrategy=require("passport-local");

app.use(express.urlencoded( { extended: true } ));
app.use(methodOverride("_method"));
const session=require("express-session");
const MongoStore=require("connect-mongo");


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
});
store.on("error",()=>{
    console.log("ERROR in Mongo Session Store");
});
app.use(session
    ({ 
    store,
    secret:"Secret",
    resave: false, 
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true
    }
    }));
    app.use(flash());

    
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id)
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err, null);
            });
    });
    app.use((req, res, next) => {
        res.locals.successMsg = req.flash("success");
        res.locals.errorMsg = req.flash("error");
        res.locals.currentUser = req.user;
        next();
    });

    //Root page
    app.get("/", function (request, response) {
        request.flash("success","Welcome to Wanderlust");
        response.redirect("/listings");
    });
app.use("/footer",footerRouter);
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.use((err, req, res, next) =>  {
      res.render("listings/error.ejs",{err});
    });
app.delete("/listings/:id/reviews/:reviewId",isLoggedIn,async(req,res)=>{
    let {id,reviewId}=req.params;
    let listing=await Listing.findById(id);
    let review=await Review.findById(reviewId);
    if(!review.owner.equals(res.locals.currentUser._id)){
        req.flash("error","You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Succesfully");
    res.redirect(`/listings/${id}`);
});
// Search route
app.post('/search', asyncWrap(async (req, res) => {
    const searchTerm = req.body.search;
        const listings = await Listing.find({ title: { $regex: searchTerm, $options: 'i' } });

        if (listings.length === 0) {
            req.flash("error","No listing found");// You would need to create a view for this
            res.redirect("/listings");
        } else {
            res.render('listings/search.ejs', { listings });
        }
}));

