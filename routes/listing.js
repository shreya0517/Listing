const express= require("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

// Middleware to ensure `image` field is in the correct format
const transformImageField = (req, res, next) => {
    const { listing } = req.body;

    console.log("Before transformation:", listing);

    if (listing && typeof listing.image === "string") {
        listing.image = { url: listing.image };
    }

    if (listing && (!listing.image.url || listing.image.url.trim() === "")) {
        listing.image.url = "https://thumbs.dreamstime.com/b/modern-house-interior-exterior-design-46517595.jpg";
    }

    console.log("After transformation:", listing);

    next();
};

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
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

//show route
router.get("/:id", 
    wrapAsync (async (req, res) => {
    let {id} = req.params;
    const listing= await Listing.findById(id).populate({  
        path: "reviews"
        // select: "_id rating comment"
    }).populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
        
    }
    res.render("listings/show.ejs", {listing});
}));

//Create route      
router.post("/", 
    isLoggedIn,
    transformImageField,
    validateListing, 
    wrapAsync(async (req, res) => {
        const { listing } = req.body;

        if (typeof listing.image === "string") {
            listing.image = { url: listing.image };
        } else if (!listing.image || !listing.image.url) {
            req.flash("error", "Image URL is required!");
            return res.redirect("/listings/new");
        }

        const newListing = new Listing(listing);
        newListing.owner = req.user._id;

        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
}));

//delte route
router.delete("/:id", 
    isLoggedIn, 
    isOwner,
    wrapAsync (async (req, res) => {
    let {id} = req.params;
    let deletedListing= await Listing.findByIdAndDelete (id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));

module.exports = router;