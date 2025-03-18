const express = require("express");
const router = express.Router();
const MoUModel = require("../Models/MouModel"); // Import MoU Schema

// GET all MoU Data
router.get("/mou", async (req, res) => {
  try {
    const mouData = await MoUModel.find(); // Fetch all MoU documents
    if (mouData.length > 0) {
      res.json(mouData);
    } else {
      res.status(404).json({ error: "No MoU data found" });
    }
  } catch (error) {
    console.error("Error fetching MoU from DB:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;

