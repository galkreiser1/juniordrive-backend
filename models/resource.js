const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ["PLATFORM", "COMMUNITY", "GUIDE"],
  },
  description: { type: String, required: false },
  link: { type: String, required: true },
});

module.exports = mongoose.model("Resource", resourceSchema);
