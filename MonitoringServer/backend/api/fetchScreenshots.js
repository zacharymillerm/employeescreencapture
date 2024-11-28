const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

// Fetch screenshots endpoint
router.get("/", (req, res) => {
  const { employeeId, startDate, endDate } = req.query || "undefined_employee";

  const employeeDir = `uploads/${employeeId}`;
  if (!fs.existsSync(employeeDir)) {
    return res.status(404).send({ error: "Employee ID not found" });
  }

  const screenshots = fs.readdirSync(employeeDir).filter((file) => {
    try {
      const datePart = file.split("_")[0];

      // Filter based on startDate and endDate
      return (
        (!startDate || datePart >= startDate) &&
        (!endDate || datePart <= endDate)
      );
    } catch (err) {
      console.error("Error parsing filename:", file);
      return false; // Exclude files with invalid formats
    }
  });

  const filePaths = screenshots.map((file) => path.join(employeeDir, file));
  res.status(200).send({ screenshots: filePaths });
});

module.exports = router;
