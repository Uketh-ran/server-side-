const express = require("express");
const multer = require("multer");
const Theme = require("../Models/WedTheme");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/theme"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

// Create first entry (description + multiple images)
router.post("/", upload.array("images"), async (req, res) => {
  const imageNames = req.files.map(file => file.filename);
  const theme = await Theme.create({
    description: req.body.description,
    images: imageNames
  });
  res.json(theme);
});

// Fetch data
router.get("/", async (req, res) => {
  const theme = await Theme.findOne();
  res.json(theme);
});

// Edit description
router.put("/:id", async (req, res) => {
  const theme = await Theme.findByIdAndUpdate(req.params.id, { description: req.body.description }, { new: true });
  res.json(theme);
});

// Add extra images
router.post("/images/:id", upload.array("images"), async (req, res) => {
  const imageNames = req.files.map(file => file.filename);
  const theme = await Theme.findById(req.params.id);
  theme.images.push(...imageNames);
  await theme.save();
  res.json(theme);
});

// router.delete("/delete-image/:imageName", async (req, res) => {
//   try {
//     const { imageName } = req.params;

//     const theme = await Theme.findOne({});
//     if (!theme) {
//       return res.status(404).json({ message: "Theme not found" });
//     }

//     // Filter image from DB
//     theme.images = theme.images.filter(img => img !== imageName);
//     await theme.save();

//     // delete file from uploads folder
//     const filePath = path.join(__dirname, "..", "uploads", "theme", imageName);
//     fs.unlink(filePath, (err) => {
//       if (err) {
//         console.log("File delete error:", err.message);
//         return res.status(500).json({ message: "File delete failed" });
//       }
//       res.json({ success: true, message: "Image deleted successfully" });
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.delete("/delete-image/:imageName", async (req, res) => {
  try {
    const imageName = decodeURIComponent(req.params.imageName);

    const theme = await Theme.findOne({});
    if (!theme) return res.status(404).json({ message: "Theme not found" });

    // Remove from DB
    theme.images = theme.images.filter(img => img !== imageName);
    await theme.save();

    // Delete file safely
    const filePath = path.join(__dirname, "..", "uploads", "theme", imageName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ success: true, message: "Image deleted successfully" });
  } catch (err) {
    console.error("Delete failed:", err);
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
