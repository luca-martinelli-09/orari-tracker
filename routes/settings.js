const express = require("express");
const router = express.Router();
const Settings = require("../models/Settings");

router.get("/", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({
        trenitalia: {
          username: "",
          password: "",
          token: "",
          tokenExpiry: null,
        },
        workHours: {
          defaultMorningStart: "08:30",
          defaultMorningEnd: "13:00",
          defaultAfternoonStart: "14:00",
          defaultAfternoonEnd: "17:30",
        },
        holidays: {
          customHolidays: [],
        },
      });
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    console.error("Settings GET error:", error);
    res.status(500).json({ message: error.message });
  }
});

router.put("/", async (req, res) => {
  try {
    console.log("Settings update request:", req.body);
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({
        trenitalia: {
          username: "",
          password: "",
          token: "",
          tokenExpiry: null,
        },
        workHours: {
          defaultMorningStart: "08:30",
          defaultMorningEnd: "13:00",
          defaultAfternoonStart: "14:00",
          defaultAfternoonEnd: "17:30",
        },
        holidays: {
          customHolidays: [],
        },
      });
    }

    // Merge nested objects properly
    if (req.body.trenitalia) {
      settings.trenitalia = { ...settings.trenitalia, ...req.body.trenitalia };
    }
    if (req.body.workHours) {
      settings.workHours = { ...settings.workHours, ...req.body.workHours };
    }
    if (req.body.holidays) {
      settings.holidays = { ...settings.holidays, ...req.body.holidays };
    }

    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error("Settings update error:", error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
