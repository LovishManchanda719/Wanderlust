//Basic setups
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passport=require("passport");
const LocalStrategy=require("passport-local");
const passportLocalMongoose=require("passport-local-mongoose");
const User=require("../models/user.js");
const session = require("express-session");
const flash = require("express-flash");
const asyncWrap=require("../utils/wrapAsync.js");
app.use(express.urlencoded({ extended: true }));
async function main()
{
    await mongoose.connect("mongodb://127.0.0.1:27017/random");
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
app.use(session({
    secret: "secretCode",
    resave: true,
    saveUninitialized: true
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

app.listen(3000,function()
{
    console.log("Server is listening on port 3000");
});
app.get("/home",(req,res)=>{
    res.send("This is home");
});
app.get("/signup",(req,res)=>{
    res.render("signup.ejs");
});
app.post("/signup",asyncWrap(async(req,res)=>{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.flash("success","Welcome To Wanderlust");
    res.redirect("/home");
}));
app.get("/login",(req,res)=>{
    res.render("login.ejs");
});
app.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), async (req, res) => {
    console.log(req.user);
    console.log("Inside async callback");
    req.flash("success", "Welcome back to Wanderlust");
    res.redirect("/home");
});

