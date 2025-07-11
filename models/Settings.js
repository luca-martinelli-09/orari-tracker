const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    trenitalia: {
      username: {
        type: String,
        default: "",
      },
      password: {
        type: String,
        default: "",
      },
      token: {
        type: String,
        default: "",
      },
      tokenExpiry: {
        type: Date,
        default: null,
      },
    },
    workHours: {
      defaultMorningStart: {
        type: String,
        default: "08:30",
      },
      defaultMorningEnd: {
        type: String,
        default: "13:00",
      },
      defaultAfternoonStart: {
        type: String,
        default: "14:00",
      },
      defaultAfternoonEnd: {
        type: String,
        default: "17:30",
      },
    },
    holidays: {
      customHolidays: [
        {
          date: Date,
          name: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Settings", settingsSchema);
