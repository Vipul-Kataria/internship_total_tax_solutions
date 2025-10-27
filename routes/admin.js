const express = require("express");
const Admin = require("../models/admin");
const passport = require("passport");

const adminRouter = express.Router();
const flash = require("connect-flash");
const { isLoggedIn } = require("../middleware");
const wrapAsync=require("../utils/wrapAsync");
const Service = require("../models/service");
const methodOverride = require("method-override");
const Enquiry=require("../models/enquiry")

adminRouter.get("/login", (req, res) => {
    res.render("adminLogin.ejs")
})

adminRouter.post("/login", passport.authenticate("local", { failureRedirect: "/admin/login", failureFlash: true }), async (req, res) => {
    req.flash("success", `Welcome back, You are now logged-in`);
    res.redirect("/admin");

})


adminRouter.get("/signup", (req, res) => {
    res.render("adminSignUp.ejs")
})
adminRouter.post("/signup", wrapAsync(async (req, res) => {
    let { username, email, password } = req.body;
    const newAdmin = new Admin({ email, username });
    let finalAdmin = await Admin.register(newAdmin, password);
    req.flash("success", `Your account has been created. Please login to continue`)
    res.redirect("/admin/login")

}))

adminRouter.get("/logout", isLoggedIn, (req, res) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "You are logged out.");
        res.redirect("/");
    })
})


adminRouter.get("/", isLoggedIn, (req, res) => {

    res.render("adminMain.ejs");
});

adminRouter.get("/service", isLoggedIn, async(req, res, next) => {
    // console.log(req)
    let service=await Service.find({ createdBy: req.user._id }).populate("createdBy");
    res.render("adminServicePage.ejs",{service})
})

adminRouter.get("/service/add",isLoggedIn,(req,res)=>{
    res.render("postServicePage.ejs")
})

adminRouter.get("/service/:id/show",isLoggedIn,wrapAsync(async(req,res,next)=>{
    let {id}=req.params;
    let service=await Service.findById(id);
    if (!service) {
        req.flash("error", "Service not found");
        return res.redirect("/admin/services"); // or wherever your services list is
    }
    let user=req.user.username;
    console.log(req.user)
    res.render("adminServiceShowPage.ejs",{service,user})
}))

adminRouter.delete("/service/:id/delete",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let delService=await Service.findByIdAndDelete(id);
    req.flash("success","Service Deleted Successfully")
    res.redirect("/admin/service")
}))
// adminRouter.get("/fakeService",isLoggedIn,async (req,res)=>{
//     const newService=new Service({
//         name:"Service test",
//         slug:"lawyer",
//         description:"i am a lawyer for ypur service",
//         createdBy:req.user._id
//     })
//     console.log(newService)
//     await newService.save();
// })

adminRouter.post("/service/add",isLoggedIn,wrapAsync(async(req,res,next)=>{
    let {name,slug,description,image}=req.body;
    const newService=new Service({
        name:name,
        slug:slug,
        description:description,
        image:image,
        createdBy:req.user._id
    })
    let createdService=await newService.save();
    req.flash("success","Your service is created successfully")
    res.redirect("/admin/service")
    console.log(createdService);
}))

adminRouter.get("/enquiry",isLoggedIn,wrapAsync(async(req,res)=>{
  let getEnquiry=await Enquiry.find();
  res.render("showEnquiries.ejs",{getEnquiry})
}))

adminRouter.delete("/enquiry/:id", isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Enquiry.findByIdAndDelete(id);
    req.flash("success", "Enquiry deleted successfully!");
    res.redirect("/admin/enquiry");
}));


module.exports = adminRouter;