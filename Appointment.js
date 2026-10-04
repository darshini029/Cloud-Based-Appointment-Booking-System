const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  service: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  notes: { type: String, default: "" },
  status: {
    type: String,
    enum: ["Booked", "Completed", "Cancelled"],
    default: "Booked"
  }
}, { timestamps: true });

module.exports = mongoose.model("Appointment", appointmentSchema);