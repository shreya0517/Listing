//requiring mongoose
const mongoose = require("mongoose");
// we will store mongoose.Schema to Schema so that we don't have to write it everytime
const Schema = mongoose.Schema;
const Review = require("./review.js");

const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        default: "https://thumbs.dreamstime.com/b/modern-house-interior-exterior-design-46517595.jpg",
        set: (v) =>
            v === "" ? "https://thumbs.dreamstime.com/b/modern-house-interior-exterior-design-46517595.jpg" : v
    }
});

const listingSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: String,

    image: {
        type: imageSchema,
        default: () => ({}) // makes sure the default applies
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});

listingSchema.post("findOneAndDelete", async(lisitng)=> {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports= Listing; 