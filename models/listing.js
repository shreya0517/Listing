
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const imageSchema = new mongoose.Schema({
    url: {
        type: String,
        default: "https://thumbs.dreamstime.com/b/modern-house-interior-exterior-design-46517595.jpg",
        set: (v) =>
            v === "" ? "https://thumbs.dreamstime.com/b/modern-house-interior-exterior-design-46517595.jpg" : v,
        validate: {
            validator: function(v) {
              return /^https?:\/\/.+/.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        }        
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

listingSchema.post("findOneAndDelete", async(listing)=> {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports= Listing; 