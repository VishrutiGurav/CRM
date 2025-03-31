
const express = require('express');
const router = express.Router();
const ClientDetails = require('../Models/ClientDetails');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables
const authMiddleware = require("../Middlewares/AuthMiddleware");
const User = require("../models/User");


router.get('/protected-route', authMiddleware, (req, res) => {
    res.json({ message: "You have accessed a protected route", success: true });
});


const otpStore = {}; // Temporary storage for OTPs (Use Redis in production)

// Nodemailer setup with environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});

// **1️ Send OTP to Email**
router.post('/sendOTP', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = otp; // Store OTP temporarily


    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Verification',
        text: `Your OTP is: ${otp}. It is valid for 5 minutes.`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Error sending OTP" });
    }
});

router.post('/verifyOTP', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
  }

  console.log("Stored OTP:", otpStore[email]); // Debugging
  console.log("Entered OTP:", otp);

  if (otpStore[email]?.toString().trim() === otp.toString().trim()) {
      delete otpStore[email]; // Remove OTP after successful verification
      return res.status(200).json({ message: "OTP verified successfully" });
  } else {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
  }
});


router.post('/saveDetails', async (req, res) => {
  try {
    console.log("Received request body:", req.body); // Debugging incoming data

    const { userId, personalDetails, instituteDetails, interestDetails } = req.body;

    // Ensure all required fields are present
    if (!userId || !personalDetails || !instituteDetails || !interestDetails) {
      console.log("Missing required fields:", { userId, personalDetails, instituteDetails, interestDetails });
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create new ClientDetails entry with userId
    const newDetails = new ClientDetails({ 
      userId, // Store ObjectId of logged-in user
      personalDetails, 
      instituteDetails, 
      interestDetails 
    });

    console.log("Saving data to database:", newDetails); // Debugging saved data

    await newDetails.save();
    console.log("Data saved successfully!"); // Confirm successful save

    // Email content
    const mailOptions = {
      from: "your-email@gmail.com",
      to: personalDetails.email, // Assuming client's email is inside personalDetails
      subject: "MoU Submission Confirmation",
      html: `
        <h2>MoU Submission Successful!</h2>
        <p>Dear ${personalDetails.name},</p>
        <p>Thank you for submitting your MoU details. Here are the details:</p>
        <ul>
          <li><strong>Business Type:</strong> ${interestDetails.businessType}</li>
          <li><strong>Start Date:</strong> ${interestDetails.startDate}</li>
          <li><strong>Duration:</strong> ${interestDetails.duration}</li>
          <li><strong>Purpose:</strong> ${interestDetails.purpose}</li>
        </ul>
        <p>We will review your request and get back to you soon.</p>
        <br>
        <p>Best Regards,<br> Rigel Infotech</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Details saved & email sent successfully!" });

  } catch (error) {
    console.error("Error saving details or sending email:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});



// Endpoint to fetch all client details
router.get('/getDetails', async (req, res) => {
  try {
    const clientDetails = await ClientDetails.find({});
    res.status(200).json(clientDetails);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching details");
  }
});

// Endpoint to check if email already exists
router.get('/checkEmail', async (req, res) => {
  const email = req.query.email;  // Get email from query params

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

   // Extract the part before '@' from the email
   const emailName = email.split('@')[0];

   try {
    // Use a regex to check if any stored email has the same part before '@'
    const client = await ClientDetails.findOne({
      "personalDetails.email": { 
        $regex: `^${emailName}@`,  // Match any domain after @
        $options: "i" // Case-insensitive search
      } 
    });
 
     if (client) {
       return res.status(200).json({ exists: true, message: "Email name already registered." });
     } else {
       return res.status(200).json({ exists: false, message: "Email name is available." });
     }
     
   } catch (error) {
     console.error("Error checking email:", error);
     res.status(500).json({ message: "Server error, please try again later." });
   }
 });


// Example: ClientRouter.js
router.post('/addClient', async (req, res) => {
  try {
      // Log incoming request data
      console.log('Incoming Request Body:', req.body);

      const client = new ClientDetails(req.body);

      // Log the constructed Mongoose document before saving
      console.log('Constructed Client Document:', client);

      await client.save();
      io.emit("newClientRequest", client); // Emit event
      res.status(201).send({ message: 'Client added successfully' });
  } catch (error) {
      // Log the error for debugging
      console.error('Validation Error:', error);
      res.status(400).send({ error: error.message });
  }
});

// ✅ Route to get client count
router.get("/count", async (req, res) => {
  try {
    const count = await ClientDetails.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching client count:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//
router.get("/client/getDetails", async (req, res) => {
  const email = req.query.email; // 🔹 Query se email le rahe hain
  if (!email) {
      return res.status(400).json({ message: "Email parameter is required" });
  }

  try {
      const client = await ClientModel.findOne({ "personalDetails.email": email }); // 🔹 Filter by email
      if (!client) {
          return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
  } catch (error) {
      res.status(500).json({ message: "Server error", error });
  }
});

// Get user ObjectId using first name and last name
router.get("/getUserId", async (req, res) => {
  try {
    const { firstName, lastName } = req.query;

    if (!firstName || !lastName) {
      return res.status(400).json({ error: "First name and last name are required." });
    }

    const user = await User.findOne({ firstName, lastName });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ userId: user._id });
  } catch (error) {
    console.error("Error fetching user ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/saveMouData", async (req, res) => {
  try {
      const { userId, mouData, formData } = req.body;

      if (!userId) {
          return res.status(400).json({ message: "User ID is required" });
      }

      // Find the existing client details document
      const clientDetails = await ClientDetails.findOne({ userId });

      if (!clientDetails) {
          return res.status(404).json({ message: "Client details not found" });
      }

      // Update only MoU details while keeping other fields untouched
      clientDetails.mouDetails = { mouData, formData };

      await clientDetails.save();

      res.status(200).json({ message: "MoU data saved successfully!" });
  } catch (error) {
      console.error("Error saving MoU data:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
});




module.exports = router;
