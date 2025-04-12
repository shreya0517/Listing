//requiring mongoose
const mongoose = require("mongoose");
// we will store mongoose.Schema to Schema so that we don't have to write it everytime
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: String,

    image: {
        url: {
       type: String,
        default:
            "https://thumbs.dreamstime.com/b/modern-house-interior-exterior-design-46517595.jpg",
        //setting default pic
        set: (v)=> 
             v === ""
            ?  "https://thumbs.dreamstime.com/b/modern-house-interior-exterior-design-46517595.jpg"
            : v,}
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports= Listing;