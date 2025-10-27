const express=require("express");


const staticRoute=express.Router();

staticRoute.get("/contact",(req,res)=>{
    res.render("contact.ejs")
})

staticRoute.get("/about",(req,res)=>{
  res.render("about.ejs")
})

module.exports=staticRoute;