require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/appointments", require("./routes/appointments"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Appointment system is running." });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

async function start() {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected to MongoDB");
    } else {
      console.log("MONGODB_URI not set. Add it to .env before using database features.");
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Database connection failed:", err.message);
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  }
}

start();