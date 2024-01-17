//Basic setups
if(process.env.NODE_ENV!="production"){
    require("dotenv").config()
}
console.log(process.env);
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const methodOverride= require("method-override");
const ejsMate=require("ejs-mate");
const asyncWrap=require("./utils/wrapAsync.js");
const { runMain } = require("module");
const ExpressError=require("./utils/expressError.js");
const { constants } = require("http2");
const flash=require("connect-flash");
const listingSchema=require("./schema.js");
const reviewSchema=require("./schema.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded( { extended: true } ));
app.use(methodOverride("_method"));
const session=require("express-session");
const MongoStore=require("connect-mongo");
app.engine("ejs",ejsMate);
const dbUrl=process.env.ATLASDB_URL;
//Defining parameters
const port=8080;
//To set up connection with monogodb through mongoose
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
//To listen on server
app.listen(port,function()
{
    console.log("Server is listening on port "+port);
});
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
    secret:process.env.SECRET,
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
app.get("/",function(request,response)
{
    response.send("Standard Get response");
});
//Test Page
app.get("/testListing",asyncWrap( async function(request,response)
{
    let sampleListing= new Listing({
        title:"My New Villa",
        description: "By the beach",
        price: 1200,
        location:"Calangute, Goa",
        country: "India"
    });
    await sampleListing
    .save()
    .then(function(response)
    {
        console.log(response);
    })
    .catch(function(error)
    {
        console.log(error);
    });
}));
app.get("/registerUser",async(req,res)=>{
    let fakeUser=new User({
        email:"student@gmail.com",
        username: "delta-student"
    });
    let newUser=await User.register(fakeUser,"helloworld");
    res.send(newUser);
});
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);
app.use((err, req, res, next) =>  {
    //   let { status = 500, message = "Some Error Occurred" } = err;
    //   res.status(status).send(message);
      res.render("listings/error.ejs",{err});
    });
  