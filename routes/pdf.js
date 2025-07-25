const express = require("express");
const router = express.Router();
const ExcelService = require("../services/ExcelService");
const WorkHour = require("../models/WorkHour");
const Expense = require("../models/Expense");
const Attachment = require("../models/Attachment");
const TrenitaliaService = require("../services/TrenitaliaService");
const fs = require("fs");
const path = require("path");

router.get("/work-hours/:year/:month", async (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Carica i dati degli orari
    const workHours = await WorkHour.find({
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    // Calcola il riepilogo
    const totalHours = workHours.reduce((sum, wh) => sum + wh.totalHours, 0);
    const workingDays = workHours.filter(
      (wh) => wh.dayType === "working",
    ).length;
    const vacationDays = workHours.filter(
      (wh) => wh.dayType === "vacation",
    ).length;
    const sickDays = workHours.filter((wh) => wh.dayType === "sick").length;
    const permitDays = workHours.filter((wh) => wh.dayType === "permit").length;

    const summary = {
      totalHours,
      workingDays,
      vacationDays,
      sickDays,
      permitDays,
    };

    // Carica gli allegati
    const attachments = await Attachment.find({
      relatedModel: "WorkHour",
      relatedId: { $in: workHours.map((wh) => wh._id) },
    });

    // Genera Excel dal template
    const excelService = new ExcelService();
    const excelPath = await excelService.generateWorkHoursExcel(
      workHours,
      year,
      month,
      summary,
    );

    // Converti Excel in PDF
    const pdfPath = await excelService.convertExcelToPDF(excelPath);

    // Aggiungi allegati al PDF se presenti
    const attachmentPaths = attachments
      .map((att) => path.join(__dirname, "..", att.filePath))
      .filter((p) => fs.existsSync(p));
    const finalPdfPath = await excelService.addAttachmentsToPDF(
      pdfPath,
      attachmentPaths,
    );

    // Invia il PDF
    const pdfBuffer = fs.readFileSync(finalPdfPath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=orari-${month}-${year}.pdf`,
    );
    res.send(pdfBuffer);

    // Pulisci i file temporanei
    setTimeout(() => {
      try {
        if (fs.existsSync(excelPath)) fs.unlinkSync(excelPath);
        if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
        if (
          typeof finalPdfPath !== "undefined" &&
          finalPdfPath !== pdfPath &&
          fs.existsSync(finalPdfPath)
        )
          fs.unlinkSync(finalPdfPath);
      } catch (cleanupError) {
        console.error("Error cleaning up temporary files:", cleanupError);
      }
    }, 5000);
  } catch (error) {
    console.error("Error generating work hours PDF:", error);
    res
      .status(500)
      .json({ message: "Error generating PDF", error: error.message });
  }
});

router.get("/expenses/:year/:month", async (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    // Carica le spese
    const expenses = await Expense.find({
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    // Calcola il riepilogo
    const totalAmount = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
    const byType = expenses.reduce((acc, expense) => {
      acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
      return acc;
    }, {});

    const summary = {
      totalAmount,
      count: expenses.length,
      byType,
    };

    // Scarica i PDF dei biglietti Trenitalia se non già presenti
    const trenitaliaService = new TrenitaliaService();
    const ticketPDFs = [];

    for (const expense of expenses) {
      if (expense.trenitalia && expense.trenitalia.resourceId) {
        try {
          // Controlla se il PDF è già stato scaricato
          if (!expense.trenitalia.pdfUrl) {
            console.log(
              `Downloading PDF for ticket ${expense.trenitalia.resourceId}`,
            );
            const pdfBuffer = await trenitaliaService.downloadPDF(
              expense.trenitalia.resourceId,
            );

            // Salva il PDF
            const uploadsDir = path.join(__dirname, "../uploads");
            if (!fs.existsSync(uploadsDir)) {
              fs.mkdirSync(uploadsDir, { recursive: true });
            }

            const filename = `trenitalia_${expense.trenitalia.resourceId}_${Date.now()}.pdf`;
            const filepath = path.join(uploadsDir, filename);
            fs.writeFileSync(filepath, pdfBuffer);

            // Aggiorna l'expense con il path del PDF
            expense.trenitalia.pdfUrl = `/uploads/${filename}`;
            await expense.save();

            ticketPDFs.push(filepath);
          } else {
            // Il PDF esiste già, aggiungi il path completo
            const existingPath = path.join(
              __dirname,
              "..",
              expense.trenitalia.pdfUrl,
            );

            ticketPDFs.push(existingPath);
          }
        } catch (pdfError) {
          console.error(
            `Error downloading PDF for ticket ${expense.trenitalia.resourceId}:`,
            pdfError,
          );
        }
      }
    }

    // Genera Excel dal template
    const excelService = new ExcelService();
    const excelPath = await excelService.generateExpensesExcel(
      expenses,
      year,
      month,
      summary,
    );

    // Converti Excel in PDF
    let pdfPath = path.join(__dirname, "../output/", `rimborsi-${month}-${year}.pdf`); // await excelService.convertExcelToPDF(excelPath);

    // Unisci i PDF dei biglietti al PDF principale
    pdfPath = await excelService.addAttachmentsToPDF(
      pdfPath,
      ticketPDFs,
    );

    // Other attachments
    const otherAttachments = expenses.reduce((acc, expense) => {
      if (expense.attachments && expense.attachments.length > 0) {
        acc.push(...expense.attachments.map((a) => path.join(
          __dirname,
          "..",
          a.path,
        )));
      }

      return acc;
    }, []);

    pdfPath = await excelService.addAttachmentsToPDF(
      pdfPath,
      otherAttachments
    );

    // Invia il PDF
    const pdfBuffer = fs.readFileSync(pdfPath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=rimborsi-${month}-${year}.pdf`,
    );
    res.send(pdfBuffer);

    // Pulisci i file temporanei
    setTimeout(() => {
      try {
        if (fs.existsSync(excelPath)) fs.unlinkSync(excelPath);
        if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
        if (
          typeof pdfPath !== "undefined" &&
          pdfPath !== pdfPath &&
          fs.existsSync(pdfPath)
        )
          fs.unlinkSync(pdfPath);
      } catch (cleanupError) {
        console.error("Error cleaning up temporary files:", cleanupError);
      }
    }, 5000);
  } catch (error) {
    console.error("Error generating expenses PDF:", error);
    res
      .status(500)
      .json({ message: "Error generating PDF", error: error.message });
  }
});

module.exports = router;
