const express= require ("express");
const app = express();
const mongoose = require ("mongoose");
const Listing = require("./models/listing.js");
const path= require("path");

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

//api
app.get("/", (req, res) => {
    res.send("Hi, I am root");
});

app.get("/listings", async (req, res) => {

    const allListings= await Listing.find({});
    res.render("/listings/index.ejs", {allListings});
});

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

app.listen(8080, () => {
    console.log("server is listening on port 8080");
});