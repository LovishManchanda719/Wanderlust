//Using EXPRESS module and EXPRESS-ROUTER
const express=require("express");
const app=express();
const router=express.Router();
const footerController=require("../controllers/footer.js");
router.get("/privacy",footerController.getPrivacyPage);
router.get("/terms",footerController.getTermsPage);
router.get("/about",footerController.getAboutPage);
router.get("/contact",footerController.getContactPage);
module.exports=router;