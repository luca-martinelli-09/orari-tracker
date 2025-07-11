const mongoose = require("mongoose");

const workHourSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    morningStart: {
      type: String,
      default: "08:30",
    },
    morningEnd: {
      type: String,
      default: "13:00",
    },
    afternoonStart: {
      type: String,
      default: "14:00",
    },
    afternoonEnd: {
      type: String,
      default: "17:30",
    },
    totalHours: {
      type: Number,
      default: 0,
    },
    dayType: {
      type: String,
      enum: ["working", "weekend", "holiday", "vacation", "sick", "permit"],
      default: "working",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

workHourSchema.pre("save", function (next) {
  if (
    this.dayType === "working" &&
    this.morningStart &&
    this.morningEnd &&
    this.afternoonStart &&
    this.afternoonEnd
  ) {
    const morningHours = this.calculateHours(
      this.morningStart,
      this.morningEnd,
    );
    const afternoonHours = this.calculateHours(
      this.afternoonStart,
      this.afternoonEnd,
    );
    this.totalHours = morningHours + afternoonHours;
  } else {
    this.totalHours = 0;
  }
  next();
});

workHourSchema.methods.calculateHours = function (start, end) {
  const startTime = new Date(`1970-01-01T${start}:00`);
  const endTime = new Date(`1970-01-01T${end}:00`);
  return (endTime - startTime) / (1000 * 60 * 60);
};

module.exports = mongoose.model("WorkHour", workHourSchema);
