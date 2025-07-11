const PDFKit = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

class PDFService {
  constructor() {
    this.pageMargin = 50;
    this.fontSizes = {
      title: 16,
      subtitle: 12,
      body: 10,
      small: 8,
    };
  }

  async generateWorkHoursPDF(workHours, attachments, year, month) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFKit({
          size: "A4",
          margin: this.pageMargin,
          info: {
            Title: `Orari di Lavoro - ${month}/${year}`,
            Author: "Orari Tracker",
            Subject: "Report mensile orari di lavoro",
          },
        });

        const chunks = [];
        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        this.addWorkHoursHeader(doc, year, month);
        this.addWorkHoursTable(doc, workHours);
        this.addWorkHoursSummary(doc, workHours);

        if (attachments && attachments.length > 0) {
          doc.addPage();
          this.addAttachmentsSection(doc, attachments);
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  async generateExpensesPDF(expenses, year, month) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFKit({
          size: "A4",
          margin: this.pageMargin,
          info: {
            Title: `Rimborsi Spese - ${month}/${year}`,
            Author: "Orari Tracker",
            Subject: "Report mensile rimborsi spese",
          },
        });

        const chunks = [];
        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);

        this.addExpensesHeader(doc, year, month);
        this.addExpensesTable(doc, expenses);
        this.addExpensesSummary(doc, expenses);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  addWorkHoursHeader(doc, year, month) {
    const monthNames = [
      "Gennaio",
      "Febbraio",
      "Marzo",
      "Aprile",
      "Maggio",
      "Giugno",
      "Luglio",
      "Agosto",
      "Settembre",
      "Ottobre",
      "Novembre",
      "Dicembre",
    ];

    doc
      .fontSize(this.fontSizes.title)
      .text("TABELLA ORARI DI LAVORO", { align: "center" })
      .moveDown(0.5);

    doc
      .fontSize(this.fontSizes.subtitle)
      .text(`Mese: ${monthNames[month - 1]} ${year}`, { align: "center" })
      .moveDown(1);
  }

  addWorkHoursTable(doc, workHours) {
    const tableTop = doc.y;
    const tableHeaders = [
      "Giorno",
      "Mattina",
      "Pomeriggio",
      "Totale Ore",
      "Tipo",
      "Note",
    ];
    const columnWidths = [80, 120, 120, 80, 80, 100];
    const rowHeight = 20;

    let x = this.pageMargin;
    tableHeaders.forEach((header, i) => {
      doc
        .rect(x, tableTop, columnWidths[i], rowHeight)
        .fillAndStroke("#f0f0f0", "#000000")
        .fill("#000000")
        .fontSize(this.fontSizes.body)
        .text(header, x + 5, tableTop + 5, {
          width: columnWidths[i] - 10,
          align: "center",
        });
      x += columnWidths[i];
    });

    let y = tableTop + rowHeight;
    workHours.forEach((wh) => {
      const date = new Date(wh.date);
      const dayStr = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}`;

      const morningStr =
        wh.dayType === "working"
          ? `${wh.morningStart} - ${wh.morningEnd}`
          : "-";
      const afternoonStr =
        wh.dayType === "working"
          ? `${wh.afternoonStart} - ${wh.afternoonEnd}`
          : "-";
      const totalHours = wh.totalHours || 0;
      const typeStr = this.getDayTypeLabel(wh.dayType);

      const rowData = [
        dayStr,
        morningStr,
        afternoonStr,
        `${totalHours}h`,
        typeStr,
        wh.notes || "",
      ];

      x = this.pageMargin;
      rowData.forEach((data, i) => {
        doc
          .rect(x, y, columnWidths[i], rowHeight)
          .stroke("#000000")
          .fill("#000000")
          .fontSize(this.fontSizes.small)
          .text(data, x + 5, y + 5, {
            width: columnWidths[i] - 10,
            align: i === 3 ? "center" : "left",
          });
        x += columnWidths[i];
      });

      y += rowHeight;

      if (y > doc.page.height - 100) {
        doc.addPage();
        y = this.pageMargin;
      }
    });

    doc.y = y + 20;
  }

  addWorkHoursSummary(doc, workHours) {
    const totalHours = workHours.reduce(
      (sum, wh) => sum + (wh.totalHours || 0),
      0,
    );
    const workingDays = workHours.filter(
      (wh) => wh.dayType === "working",
    ).length;
    const vacationDays = workHours.filter(
      (wh) => wh.dayType === "vacation",
    ).length;
    const sickDays = workHours.filter((wh) => wh.dayType === "sick").length;
    const permitDays = workHours.filter((wh) => wh.dayType === "permit").length;

    doc
      .moveDown(1)
      .fontSize(this.fontSizes.subtitle)
      .text("RIEPILOGO MENSILE", { align: "center" })
      .moveDown(0.5);

    doc
      .fontSize(this.fontSizes.body)
      .text(`Ore totali lavorate: ${totalHours}`)
      .text(`Giorni lavorativi: ${workingDays}`)
      .text(`Giorni di ferie: ${vacationDays}`)
      .text(`Giorni di malattia: ${sickDays}`)
      .text(`Giorni di permesso: ${permitDays}`);
  }

  addExpensesHeader(doc, year, month) {
    const monthNames = [
      "Gennaio",
      "Febbraio",
      "Marzo",
      "Aprile",
      "Maggio",
      "Giugno",
      "Luglio",
      "Agosto",
      "Settembre",
      "Ottobre",
      "Novembre",
      "Dicembre",
    ];

    doc
      .fontSize(this.fontSizes.title)
      .text("TABELLA RIMBORSI SPESE", { align: "center" })
      .moveDown(0.5);

    doc
      .fontSize(this.fontSizes.subtitle)
      .text(`Mese: ${monthNames[month - 1]} ${year}`, { align: "center" })
      .moveDown(1);
  }

  addExpensesTable(doc, expenses) {
    const tableTop = doc.y;
    const tableHeaders = ["Data", "Tipo", "Descrizione", "Importo", "Note"];
    const columnWidths = [80, 80, 200, 80, 140];
    const rowHeight = 25;

    let x = this.pageMargin;
    tableHeaders.forEach((header, i) => {
      doc
        .rect(x, tableTop, columnWidths[i], rowHeight)
        .fillAndStroke("#f0f0f0", "#000000")
        .fill("#000000")
        .fontSize(this.fontSizes.body)
        .text(header, x + 5, tableTop + 5, {
          width: columnWidths[i] - 10,
          align: "center",
        });
      x += columnWidths[i];
    });

    let y = tableTop + rowHeight;
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const dateStr = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}`;
      const typeStr = this.getExpenseTypeLabel(expense.type);
      const amountStr = `€${expense.amount.toFixed(2)}`;

      const rowData = [
        dateStr,
        typeStr,
        expense.description,
        amountStr,
        expense.notes || "",
      ];

      x = this.pageMargin;
      rowData.forEach((data, i) => {
        doc
          .rect(x, y, columnWidths[i], rowHeight)
          .stroke("#000000")
          .fill("#000000")
          .fontSize(this.fontSizes.small)
          .text(data, x + 5, y + 5, {
            width: columnWidths[i] - 10,
            align: i === 3 ? "right" : "left",
          });
        x += columnWidths[i];
      });

      y += rowHeight;

      if (y > doc.page.height - 100) {
        doc.addPage();
        y = this.pageMargin;
      }
    });

    doc.y = y + 20;
  }

  addExpensesSummary(doc, expenses) {
    const totalAmount = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
    const byType = expenses.reduce((acc, expense) => {
      acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
      return acc;
    }, {});

    doc
      .moveDown(1)
      .fontSize(this.fontSizes.subtitle)
      .text("RIEPILOGO SPESE", { align: "center" })
      .moveDown(0.5);

    doc
      .fontSize(this.fontSizes.body)
      .text(`Totale spese: €${totalAmount.toFixed(2)}`)
      .text(`Numero spese: ${expenses.length}`)
      .moveDown(0.5);

    Object.entries(byType).forEach(([type, amount]) => {
      doc.text(`${this.getExpenseTypeLabel(type)}: €${amount.toFixed(2)}`);
    });
  }

  addAttachmentsSection(doc, attachments) {
    doc
      .fontSize(this.fontSizes.subtitle)
      .text("ALLEGATI", { align: "center" })
      .moveDown(1);

    attachments.forEach((attachment, index) => {
      doc
        .fontSize(this.fontSizes.body)
        .text(`${index + 1}. ${attachment.originalName}`)
        .fontSize(this.fontSizes.small)
        .text(`   Tipo: ${attachment.type}`)
        .text(`   Dimensione: ${this.formatFileSize(attachment.size)}`)
        .moveDown(0.5);
    });
  }

  getDayTypeLabel(type) {
    const labels = {
      working: "Lavorativo",
      weekend: "Weekend",
      holiday: "Festivo",
      vacation: "Ferie",
      sick: "Malattia",
      permit: "Permesso",
    };
    return labels[type] || "Altro";
  }

  getExpenseTypeLabel(type) {
    const labels = {
      train: "Treno",
      transport: "Trasporto",
      meal: "Pasto",
      accommodation: "Alloggio",
      other: "Altro",
    };
    return labels[type] || "Altro";
  }

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}

module.exports = PDFService;
