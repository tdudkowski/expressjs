const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: { type: String, required: [true, "TITLE is required"] },
  content: { type: String, required: [true, "CONTENT is required"] },
  created: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Articles", articleSchema);
