const express = require("express");
const app = express();
const PORT = 3000;

const methodOverride = require("method-override");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);


const wrapAsync=require("./utils/wrapAsync");
const ExpressError=require("./utils/expressError")
const Service=require("./models/service")
const Enquiry=require("./models/enquiry")


const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/total_tax_solution')
  .then(() => console.log('Connected!'));

const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
//SESSIONS CREATED
const session = require("express-session");
app.use(session({
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true
  }
}));
//FLASH METHODS
const flash = require("connect-flash");
app.use(flash());

//PASSPORT
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Admin = require("./models/admin");

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

app.get("/demoUser",async (req,res)=>{
  const adminUser=new Admin({
    email:"student@gmail.com",
    username:"student",
  })
  const finalUser=await Admin.register(adminUser,"123456");
  res.send(finalUser);

})



app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
})
//ROUTES
const staticRoute = require("./routes/static");
app.use("/", staticRoute);

const adminRouter = require("./routes/admin");
const enquiry = require("./models/enquiry");
app.use("/admin", adminRouter);


//API'S
app.get("/", (req, res) => {
  res.render("main.ejs");
});

app.get("/services",async (req,res,next)=>{
  let allService=await Service.find();
  
  res.render("service.ejs",{allService})
})

// app.get("/fakeEnquiry", async (req, res) => {
//     try {
//         const fakeEnquiry = new Enquiry({
//             name: "John Doe",
//             email: "john.doe@example.com",
//             phone: 9876543210,
//             message: "I want to know about GST registration."
//         });

//         const savedEnquiry = await fakeEnquiry.save();
//         console.log(savedEnquiry);

//         // Send response so the request doesn't hang
//         res.json(savedEnquiry);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error saving fake enquiry");
//     }
// });


app.post("/admin/enquiry", async(req,res,next)=>{
  let {name,email,phone,message}=req.body;
  const fakeEnquiry = new Enquiry({
            name: name,
            email: email,
            phone: phone,
            message: message,
        });
  const savedEnquiry = await fakeEnquiry.save();
  req.flash("success","Enquiry is registerd. We will connect to you shortly!")
  res.redirect("/")
})


app.listen(PORT, () => {
  console.log("App is listening");
});

app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something Went Wrong"}=err;
  res.status(statusCode).render("error.ejs",{err});
})