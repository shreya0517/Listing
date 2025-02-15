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
       url:{ type: String,
        default:
                "https://www.bing.com/images/search?view=detailV2&ccid=fytM3rSm&id=FF27231DBA5F61A01C3280E2DEF52C221137B601&thid=OIP.fytM3rSmgFsH0vGMKaXWxwHaEo&mediaurl=https%3a%2f%2fwallpaperaccess.com%2ffull%2f235592.jpg&exph=1200&expw=1920&q=random+cat+image+copyright+free&simid=608048768885936013&FORM=IRPRST&ck=2E925FF0E045778C63F92A7BD40076B6&selectedIndex=0&itb=0&ajaxhist=0&ajaxserp=0",
        //setting default pic
        set: (v) =>
            v === ""
        ? "https://www.bing.com/images/search?view=detailV2&ccid=fytM3rSm&id=FF27231DBA5F61A01C3280E2DEF52C221137B601&thid=OIP.fytM3rSmgFsH0vGMKaXWxwHaEo&mediaurl=https%3a%2f%2fwallpaperaccess.com%2ffull%2f235592.jpg&exph=1200&expw=1920&q=random+cat+image+copyright+free&simid=608048768885936013&FORM=IRPRST&ck=2E925FF0E045778C63F92A7BD40076B6&selectedIndex=0&itb=0&ajaxhist=0&ajaxserp=0"
        : v,}
    },
    price: Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports= Listing;