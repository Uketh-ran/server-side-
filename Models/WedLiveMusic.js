const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema({
  description: { type: String, required: true },
  images: { type: [String], default: [] }
});

module.exports = mongoose.model("WedPhoto", themeSchema);
