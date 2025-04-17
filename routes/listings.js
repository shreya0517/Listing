const express= require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");



// validate listing
const validateListing = (req, res, next) => {
    let {error}= listingSchema.validate(req.body);
    if(error) {
        let errMsg= error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//index route
router.get("/", wrapAsync (async (req, res) => {

    const allListings= await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

//new route
//it has to be written above the show route as it search by id so
//we have to write it above so that it send the request to /new route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

//show route
router.get("/:id", wrapAsync (async (req, res) => {
    let {id} = req.params;
    const listing= await Listing.findById(id).populate({  
          path: "reviews",
        select: "_id rating comment"});
    res.render("listings/show.ejs", {listing});
}));

//Create route      
//let{title, description, Image, price, country, location}= req.body;
//or we can make an object so that we don't have to write things this long            
router.post("/", validateListing, wrapAsync (async (req, res, next) => {
    
    const newListing= new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}));

//Edit route
router.get("/:id/edit", wrapAsync ( async (req, res) => {
    let {id} = req.params;
    const listing= await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

//Update route
router.put("/:id",validateListing, wrapAsync (async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);//redirecting to the edited page by id
}));

//delte route
router.delete("/:id", wrapAsync (async (req, res) => {
    let {id} = req.params;
    let deletedListing= await Listing.findByIdAndDelete (id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports = router;