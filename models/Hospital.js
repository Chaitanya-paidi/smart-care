// models/Hospital.js
const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  hospitalName: { type: String, required: true },
  address: { type: String, required: true },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],
  admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approved: { type: Boolean, default: false },
  ratings: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      userName: { type: String },
      rating: Number,
      comment: String,
    },
  ],
  image: { type: String }, 
  hospitalDescription: { type: String},
});

module.exports = mongoose.model("Hospital", hospitalSchema);
