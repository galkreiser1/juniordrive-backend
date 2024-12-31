// models/resource.js
const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["PLATFORM", "COMMUNITY", "GUIDE"],
  },
  description: { type: String, required: false },
  // For PLATFORM and COMMUNITY, or GUIDE with link
  link: { type: String, required: false },
  // For GUIDE with file
  fileUrl: { type: String, required: false },
  fileName: { type: String, required: false },
  isApproved: { type: Boolean, default: false },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Resource", resourceSchema);
