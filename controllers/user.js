const User=require("../models/user.js");
module.exports.getSignupPage=(req,res)=>{
    res.render("users/signup.ejs");
};
module.exports.signup=async(req,res)=>{
    let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err)
        {
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings");
    });
};
module.exports.getLoginPage=(req,res)=>{
    res.render("users/login.ejs");
};
module.exports.login=async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust");
    res.redirect("/listings");
};
module.exports.logout=(req,res)=>{
    req.logout(
        (err)=>
            {
                if(err)
                {
                    return next(err);
                }
            });
    req.flash("success","Logged Out Succesfully");
    res.redirect("/listings");
};