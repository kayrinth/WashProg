const express = require("express");
const geoRoutes = express.Router();

geoRoutes.get("/reverse-geocode", async (req, res) => {
  const { lat, lng } = req.query;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Reverse geocode error:", err);
    res.status(500).json({
      error: "Gagal ambil alamat",
      details: err.message,
    });
  }
});

geoRoutes.get("/route", async (req, res) => {
  const { startLat, startLng, endLat, endLng } = req.query;

  if (!startLat || !startLng || !endLat || !endLng) {
    return res.status(400).json({
      error: "Missing parameters",
      required: ["startLat", "startLng", "endLat", "endLng"],
    });
  }

  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/walking/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Routing error:", err);
    res.status(500).json({
      error: "Gagal mendapatkan rute",
      details: err.message,
    });
  }
});

module.exports = geoRoutes;
