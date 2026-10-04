const express = require("express");
const Appointment = require("../models/Appointment");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { user: req.user.id };
  const appointments = await Appointment.find(filter)
    .populate("user", "name email")
    .sort({ date: 1, time: 1 });
  res.json(appointments);
});

router.post("/", auth, async (req, res) => {
  try {
    const { service, date, time, notes } = req.body;
    if (!service || !date || !time)
      return res.status(400).json({ message: "Service, date and time are required." });

    const clash = await Appointment.findOne({
      date, time, status: "Booked"
    });
    if (clash) return res.status(409).json({ message: "That time slot is already booked." });

    const appointment = await Appointment.create({
      user: req.user.id, service, date, time, notes
    });
    res.json({ message: "Appointment booked successfully.", appointment });
  } catch {
    res.status(500).json({ message: "Could not book appointment." });
  }
});

router.patch("/:id/cancel", auth, async (req, res) => {
  const appointment = await Appointment.findOne({
    _id: req.params.id,
    user: req.user.id
  });
  if (!appointment) return res.status(404).json({ message: "Appointment not found." });

  appointment.status = "Cancelled";
  await appointment.save();
  res.json({ message: "Appointment cancelled." });
});

router.patch("/:id/status", auth, async (req, res) => {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin access required." });

  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) return res.status(404).json({ message: "Appointment not found." });

  appointment.status = req.body.status;
  await appointment.save();
  res.json({ message: "Appointment status updated." });
});

module.exports = router;