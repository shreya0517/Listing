//requiring mongoose
const mongoose = require("mongoose");
// we will store mongoose.Schema to Schema so that we don't have to write it everytime
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: String,

    image: {
        type: String,
        default: "https://thumbs.dreamstime.com/b/modern-house-interior-exterior-design-46517595.jpg",
        set: (v) => v === "" ? "https://thumbs.dreamstime.com/b/modern-house-interior-exterior-design-46517595.jpg" : v
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

listingSchema.post("findOneAndDelete", async(listing)=> {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports= Listing;