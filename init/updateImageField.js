const mongoose = require("mongoose");
const Listing = require("../models/listing");

const mongoURL = "mongodb://127.0.0.1:27017/wonderlst";

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
    console.log("Database connected");

    try {
        // Update all listings to ensure the image field is a string
        await Listing.updateMany({}, {
            $set: { image: "https://thumbs.dreamstime.com/b/modern-house-interior-exterior-design-46517595.jpg" },
        });
        console.log("All listings updated successfully.");
    } catch (err) {
        console.error("Error updating listings:", err);
    } finally {
        mongoose.connection.close();
    }
});