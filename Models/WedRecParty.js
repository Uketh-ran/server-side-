const mongoose = require("mongoose");

const WedLiveMusicSchema = new mongoose.Schema({
  description: String,
  images: [String]
});

module.exports = mongoose.model("Wedrecparty", WedLiveMusicSchema);
