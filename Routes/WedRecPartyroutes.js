
const express = require("express");
const multer = require("multer");
const WedRecPartyModel = require("../Models/WedRecParty"); // rename model
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/Wedrecparty"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// CREATE first entry
router.post("/", upload.array("images"), async (req, res) => {
  try {
    const imageNames = req.files ? req.files.map(f => f.filename) : [];
    const doc = await WedRecPartyModel.create({
      description: req.body.description,
      images: imageNames,
    });
    res.json(doc);
  } catch (err) {
    console.error("Create error:", err);
    res.status(500).json({ message: err.message });
  }
});

// FETCH data
router.get("/", async (req, res) => {
  try {
    const doc = await WedRecPartyModel.findOne();
    res.json(doc);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: err.message });
  }
});

// EDIT description
router.put("/:id", async (req, res) => {
  try {
    const doc = await WedRecPartyModel.findByIdAndUpdate(
      req.params.id,
      { description: req.body.description },
      { new: true }
    );
    res.json(doc);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ADD extra images
router.post("/images/:id", upload.array("images"), async (req, res) => {
  try {
    const imageNames = req.files ? req.files.map(f => f.filename) : [];
    const doc = await WedRecPartyModel.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    doc.images.push(...imageNames);
    await doc.save();
    res.json(doc);
  } catch (err) {
    console.error("Add images error:", err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE image
router.delete("/delete-image/:imageName", async (req, res) => {
  try {
    const imageName = decodeURIComponent(req.params.imageName);
    const doc = await WedRecPartyModel.findOne();
    if (!doc) return res.status(404).json({ message: "Document not found" });

    doc.images = doc.images.filter((img) => img !== imageName);
    await doc.save();

    const filePath = path.join(__dirname, "..", "uploads", "Wedrecparty", imageName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ success: true, message: "Image deleted successfully" });
  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
