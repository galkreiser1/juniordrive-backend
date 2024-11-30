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
});

module.exports = mongoose.model("Resource", resourceSchema);
