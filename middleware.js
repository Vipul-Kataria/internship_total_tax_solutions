module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
    req.flash("error","Access Denied! You must be logged-in.")
    return res.redirect("/admin/login")
  }
  next();
}