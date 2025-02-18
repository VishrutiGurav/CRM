const mongoose = require('mongoose');
require('dotenv').config();

// Adjust path here if needed
const AdminModel = require('./Models/AdminModel'); 

mongoose.connect(process.env.MONGO_CONN, {
    useNewUrlParser: true, // This warning can be ignored for now
    useUnifiedTopology: true // Same for this one
})
.then(async () => {
    const email = "rigel@gmail.com";
    
    // Check all admins in the collection
    const admins = await AdminModel.find();
    console.log("All admins in collection:", admins); // This helps verify if there’s an issue with the collection name or data

    const admin = await AdminModel.findOne({ email });

    if (admin) {
        console.log("Admin found:", admin);
    } else {
        console.log("Admin not found");
    }
})
.catch((error) => console.error("Connection error:", error))
.finally(() => mongoose.disconnect());
