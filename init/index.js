const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongo_URL="mongodb://127.0.0.1:27017/wonderlst"

//calling main function
main().
then( () => {
    console.log("connected to db");
}) 
.catch((err) => {
    console.log(err);
});

//connectig to databse
async function main() {
    await mongoose.connect(mongo_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();
