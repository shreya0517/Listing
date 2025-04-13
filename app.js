const express= require ("express");
const app = express();
const mongoose = require ("mongoose");
const Listing = require("./models/listing.js");
const path= require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressErrors = require("./utils/ExpressErrors.js");
const {listingSchema} = require("./schema.js");
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

//api
app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

// validate listing
const validateListing = (req, res, next) => {
    let {error}= listingSchema.validate(req.body);
    if(error) {
        let errMsg= error.details((el) => el.message).join(",");
        throw new ExpressErrors(400, errMsg);
    } else {
        next();
    }
};

//index route
app.get("/listings", wrapAsync (async (req, res) => {

    const allListings= await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

//new route
//it has to be written above the show route as it search by id so
//we have to write it above so that it send the request to /new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", wrapAsync (async (req, res) => {
    let {id} = req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
}));

//Create route      
//let{title, description, Image, price, country, location}= req.body;
//or we can make an object so that we don't have to write things this long            
app.post("/listings", validateListing, wrapAsync (async (req, res, next) => {
    
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

//Edit route
app.get("/listings/:id/edit", wrapAsync ( async (req, res) => {
    let {id} = req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

//Update route
app.put("/listings/:id",validateListing, wrapAsync (async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);//redirecting to the edited page by id
}));

//delte route
app.delete("/listings/:id", wrapAsync (async (req, res) => {
    let {id} = req.params;
    let deletedListing= await Listing.findByIdAndDelete (id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

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
    next(new ExpressErrors(404, "Page Not Found!"));
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