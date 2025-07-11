const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/:year", async (req, res) => {
  try {
    const { year } = req.params;
    const response = await axios.get(
      `https://date.nager.at/api/v3/PublicHolidays/${year}/IT`,
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching holidays", error: error.message });
  }
});

module.exports = router;
