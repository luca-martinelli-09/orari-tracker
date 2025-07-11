const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const TrenitaliaService = require("../services/TrenitaliaService");

router.get("/", async (req, res) => {
  try {
    const { year, month } = req.query;
    let query = {};

    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/sync-trenitalia", async (req, res) => {
  try {
    const { year, month } = req.body;
    const trenitaliaService = new TrenitaliaService();

    const trips = await trenitaliaService.getTrips(year, month);
    const expenses = [];

    for (const trip of trips) {
      const existingExpense = await Expense.findOne({
        "trenitalia.resourceId": trip.resourceId,
      });

      if (!existingExpense) {
        let pdfUrl = null;
        let ticketAmount = 0;

        // Prova a recuperare i dettagli del biglietto per ottenere il prezzo
        if (trip.resourceId) {
          try {
            const ticketDetails = await trenitaliaService.getTicketDetails(
              trip.resourceId,
            );

            // Estrai il prezzo dai dettagli del biglietto
            if (ticketDetails.solutions && ticketDetails.solutions.length > 0) {
              const solution = ticketDetails.solutions[0];
              if (
                solution.solutionContainer &&
                solution.solutionContainer.totalPrice
              ) {
                ticketAmount =
                  solution.solutionContainer.totalPrice.amount || 0;
              }
            }

            console.log(
              `Prezzo recuperato per ${trip.resourceId}: €${ticketAmount}`,
            );
          } catch (error) {
            console.error("Error fetching ticket details:", error);
          }
        }

        // Prova a scaricare il PDF
        if (trip.downloadPdf && trip.resourceId) {
          try {
            const pdfBuffer = await trenitaliaService.downloadPDF(
              trip.resourceId,
            );
            // Salva il PDF come allegato
            const fs = require("fs");
            const path = require("path");
            const uploadPath = path.join(__dirname, "../uploads");
            if (!fs.existsSync(uploadPath)) {
              fs.mkdirSync(uploadPath, { recursive: true });
            }

            const filename = `trenitalia_${trip.resourceId}_${Date.now()}.pdf`;
            const filepath = path.join(uploadPath, filename);
            fs.writeFileSync(filepath, pdfBuffer);
            pdfUrl = `/uploads/${filename}`;
          } catch (error) {
            console.error("Error downloading PDF:", error);
          }
        }

        const expense = new Expense({
          date: new Date(trip.departureDate),
          type: "train",
          description: trip.description,
          amount: ticketAmount,
          trenitalia: {
            resourceId: trip.resourceId,
            pnr: trip.pnr,
            departureStation: trip.description.split(" - ")[0],
            arrivalStation: trip.description.split(" - ")[1],
            departureTime: new Date(trip.departureDate),
            arrivalTime: new Date(trip.arrivalDate),
            pdfUrl: pdfUrl,
          },
          notes:
            ticketAmount > 0
              ? "Prezzo recuperato automaticamente da Trenitalia"
              : "Importo da verificare e aggiornare manualmente",
        });

        await expense.save();
        expenses.push(expense);
      }
    }

    res.json({
      message: `Synchronized ${expenses.length} trips from Trenitalia`,
      expenses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/summary/:year/:month", async (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const expenses = await Expense.find({
      date: { $gte: startDate, $lte: endDate },
    });

    const totalAmount = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
    const byType = expenses.reduce((acc, expense) => {
      acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
      return acc;
    }, {});

    res.json({
      totalAmount,
      count: expenses.length,
      byType,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
