const express= require ("express");
const app = express();
const mongoose = require ("mongoose");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport= require("passport");
const LocalStategy= require("passport-local");
const User= require("./models/user.js");

const listings= require("./routes/listing.js");
const reviews= require("./routes/review.js");


const mongo_URL="mongodb://127.0.0.1:27017/wonderlst"

//calling main function
main().
then( () => {
    console.log("connect to db");
}) 
.catch((err) => {
    console.log(err);
});

//connectig to databse
async function main() {
    await mongoose.connect(mongo_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions= {
    secret: "summervacation",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 100,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
};

//api
app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.sucess= req.flash("success") || [];
    res.locals.error= req.flash("error") || [];
    next();
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// accessing listing
//  app.get("/testListing", async (req, res) => {
//    let sampleListing = new Listing({
//          title:"My New Villa",
//          description: "By the beach",
//          price: 1200,
//          location: "Calangute, Goa",
//          country: "India",
//      });

//     //saving sample listing and always use await with async function
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successful testing");
// });



// error handeling for all the routes except the above mentioned
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});


// error handeling middleware
app.use((err, req, res, next) => {
    let { statusCode=500, message= "something went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {err});
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("server is listening on port 8080");
});