module.exports.getPrivacyPage= async function(request,response)
{
    response.render("footer/privacy.ejs");
};
module.exports.getTermsPage=async function(request,response){
    response.render("footer/terms.ejs");
};
module.exports.getAboutPage=async function(request,response){
    response.render("footer/about.ejs");
};
module.exports.getContactPage=async function(request,response){
    response.render("footer/contact.ejs");
};