const express = require("express");
const router = express.Router();
const WorkHour = require("../models/WorkHour");
const Attachment = require("../models/Attachment");

router.get("/", async (req, res) => {
  try {
    const { year, month } = req.query;
    let query = {};

    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const workHours = await WorkHour.find(query).sort({ date: 1 });

    // Add attachment count to each work hour
    const workHoursWithAttachments = await Promise.all(
      workHours.map(async (workHour) => {
        const attachmentCount = await Attachment.countDocuments({
          relatedId: workHour._id,
          relatedModel: "WorkHour",
        });
        return {
          ...workHour.toObject(),
          attachments:
            attachmentCount > 0 ? Array(attachmentCount).fill({}) : [],
        };
      }),
    );

    res.json(workHoursWithAttachments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const workHour = new WorkHour(req.body);
    await workHour.save();
    res.status(201).json(workHour);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const workHour = await WorkHour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!workHour) {
      return res.status(404).json({ message: "Work hour not found" });
    }
    res.json(workHour);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const workHour = await WorkHour.findByIdAndDelete(req.params.id);
    if (!workHour) {
      return res.status(404).json({ message: "Work hour not found" });
    }
    res.json({ message: "Work hour deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id/attachments", async (req, res) => {
  try {
    const attachments = await Attachment.find({
      relatedId: req.params.id,
      relatedModel: "WorkHour",
    });
    res.json(attachments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/summary/:year/:month", async (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(year, month - 1, 1, 12, 0);
    const endDate = new Date(year, month, 0, 12, 0);

    const workHours = await WorkHour.find({
      date: { $gte: startDate, $lte: endDate },
    });

    const totalHours = workHours.reduce((sum, wh) => sum + wh.totalHours, 0);
    const workingDays = workHours.filter(
      (wh) => wh.dayType === "working",
    ).length;
    const vacationDays = workHours.filter(
      (wh) => wh.dayType === "vacation",
    ).length;
    const sickDays = workHours.filter((wh) => wh.dayType === "sick").length;
    const permitDays = workHours.filter((wh) => wh.dayType === "permit").length;

    res.json({
      totalHours,
      workingDays,
      vacationDays,
      sickDays,
      permitDays,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
