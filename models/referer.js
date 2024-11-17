const mongoose = require("mongoose");

const refererSchema = new mongoose.Schema({
  company: { type: String, required: true },
  name: { type: String, required: true },
  numReferrals: { type: Number, required: true },
  role: { type: String, required: true },
  email: { type: String, required: true },
  linkedin: { type: String, required: false },
  location: { type: String, required: false },
  availability: {
    type: String,
    enum: ["Available", "Unavailable"],
    required: true,
  },
});

module.exports = mongoose.model("Referer", refererSchema);
