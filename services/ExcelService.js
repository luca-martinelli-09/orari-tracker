const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");
const { PDFDocument } = require("pdf-lib");

class ExcelService {
  constructor() {
    this.templatesDir = path.join(__dirname, "..");
    this.outputDir = path.join(__dirname, "../output");

    // Crea la directory output se non esiste
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async generateWorkHoursExcel(workHours, year, month, summary) {
    const templatePath = path.join(
      this.templatesDir,
      "tabella_orari_25-06.xlsx",
    );
    const outputPath = path.join(this.outputDir, `orari-${month}-${year}.xlsx`);

    try {
      // Leggi il template
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(templatePath);

      const worksheet = workbook.getWorksheet(1); // Prima worksheet

      // Aggiorna il titolo con il mese/anno correnti
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

      // Cerca e aggiorna la cella del titolo (assumendo che sia nelle prime righe)
      for (let row = 1; row <= 10; row++) {
        for (let col = 1; col <= 10; col++) {
          const cell = worksheet.getCell(row, col);
          if (cell.value && typeof cell.value === "string") {
            if (
              cell.value.includes("TABELLA ORARI") ||
              cell.value.includes("TIMESHEET")
            ) {
              cell.value = `TABELLA ORARI - ${monthNames[month - 1]} ${year}`;
              break;
            }
          }
        }
      }

      // Genera tutti i giorni del mese e popola la tabella
      const daysInMonth = new Date(year, month, 0).getDate();
      let currentRow = this.findDataStartRow(worksheet);

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dateStr = date.toISOString().split("T")[0];

        // Trova i dati per questo giorno
        const dayData = workHours.find(
          (wh) => new Date(wh.date).toISOString().split("T")[0] === dateStr,
        );

        // Determina il tipo di giorno
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        let dayType = "working";
        if (dayData) {
          dayType = dayData.dayType;
        } else if (isWeekend) {
          dayType = "weekend";
        }

        // Popola la riga
        const row = worksheet.getRow(currentRow);

        // Data (colonna A)
        row.getCell(1).value = date;
        row.getCell(1).numFmt = "dd/mm/yyyy";

        // Giorno della settimana (colonna B)
        const dayNames = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
        row.getCell(2).value = dayNames[dayOfWeek];

        if (dayType === "working" && dayData) {
          // Mattina inizio (colonna C)
          row.getCell(3).value = dayData.morningStart || "";

          // Mattina fine (colonna D)
          row.getCell(4).value = dayData.morningEnd || "";

          // Pomeriggio inizio (colonna E)
          row.getCell(5).value = dayData.afternoonStart || "";

          // Pomeriggio fine (colonna F)
          row.getCell(6).value = dayData.afternoonEnd || "";

          // Ore totali (colonna G)
          row.getCell(7).value = dayData.totalHours || 0;

          // Note (colonna H)
          row.getCell(8).value = dayData.notes || "";
        } else {
          // Giorno non lavorativo
          const typeLabels = {
            weekend: "Weekend",
            holiday: "Festivo",
            vacation: "Ferie",
            sick: "Malattia",
            permit: "Permesso",
          };

          row.getCell(3).value = "";
          row.getCell(4).value = "";
          row.getCell(5).value = "";
          row.getCell(6).value = "";
          row.getCell(7).value = 0;
          row.getCell(8).value = typeLabels[dayType] || "";
        }

        currentRow++;
      }

      // Aggiungi riepilogo alla fine
      if (summary) {
        currentRow += 2; // Lascia una riga vuota

        const summaryRow = worksheet.getRow(currentRow);
        summaryRow.getCell(1).value = "RIEPILOGO MENSILE";
        summaryRow.getCell(1).font = { bold: true };

        currentRow++;
        worksheet.getRow(currentRow).getCell(1).value =
          `Ore totali: ${summary.totalHours}h`;
        currentRow++;
        worksheet.getRow(currentRow).getCell(1).value =
          `Giorni lavorati: ${summary.workingDays}`;
        currentRow++;
        worksheet.getRow(currentRow).getCell(1).value =
          `Giorni di ferie: ${summary.vacationDays}`;
        currentRow++;
        worksheet.getRow(currentRow).getCell(1).value =
          `Giorni di malattia: ${summary.sickDays}`;
        currentRow++;
        worksheet.getRow(currentRow).getCell(1).value =
          `Giorni di permesso: ${summary.permitDays}`;
      }

      // Salva il file Excel
      await workbook.xlsx.writeFile(outputPath);

      return outputPath;
    } catch (error) {
      console.error("Error generating work hours Excel:", error);
      throw error;
    }
  }

  async generateExpensesExcel(expenses, year, month, summary) {
    const templatePath = path.join(this.templatesDir, "rimborso_25-06.xlsx");
    const outputPath = path.join(
      this.outputDir,
      `rimborsi-${month}-${year}.xlsx`,
    );

    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(templatePath);

      const worksheet = workbook.getWorksheet(1);

      // Aggiorna il titolo
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

      // Cerca e aggiorna la cella del titolo
      for (let row = 1; row <= 10; row++) {
        for (let col = 1; col <= 10; col++) {
          const cell = worksheet.getCell(row, col);
          if (cell.value && typeof cell.value === "string") {
            if (
              cell.value.includes("RIMBORSO") ||
              cell.value.includes("EXPENSE")
            ) {
              cell.value = `RIMBORSO SPESE - ${monthNames[month - 1]} ${year}`;
              break;
            }
          }
        }
      }

      // Popola i dati delle spese
      let currentRow = this.findDataStartRow(worksheet);

      expenses.forEach((expense, index) => {
        const row = worksheet.getRow(currentRow + index);

        // Data
        row.getCell(1).value = new Date(expense.date);
        row.getCell(1).numFmt = "dd/mm/yyyy";

        // Tipo spesa
        const typeLabels = {
          train: "Treno",
          transport: "Trasporto",
          meal: "Pasto",
          accommodation: "Alloggio",
          other: "Altro",
        };
        row.getCell(2).value = typeLabels[expense.type] || "Altro";

        // Descrizione
        row.getCell(3).value = expense.description;

        // Importo
        row.getCell(4).value = expense.amount;
        row.getCell(4).numFmt = "€#,##0.00";

        // Note (include PNR se Trenitalia)
        let notes = expense.notes || "";
        if (expense.trenitalia && expense.trenitalia.pnr) {
          notes += (notes ? " - " : "") + `PNR: ${expense.trenitalia.pnr}`;
        }
        row.getCell(5).value = notes;
      });

      // Aggiungi riepilogo
      if (summary && expenses.length > 0) {
        const summaryStartRow = currentRow + expenses.length + 2;

        worksheet.getRow(summaryStartRow).getCell(1).value = "RIEPILOGO";
        worksheet.getRow(summaryStartRow).getCell(1).font = { bold: true };

        worksheet.getRow(summaryStartRow + 1).getCell(3).value =
          "Totale generale:";
        worksheet.getRow(summaryStartRow + 1).getCell(4).value =
          summary.totalAmount;
        worksheet.getRow(summaryStartRow + 1).getCell(4).numFmt = "€#,##0.00";
        worksheet.getRow(summaryStartRow + 1).getCell(4).font = { bold: true };
      }

      await workbook.xlsx.writeFile(outputPath);
      return outputPath;
    } catch (error) {
      console.error("Error generating expenses Excel:", error);
      throw error;
    }
  }

  findDataStartRow(worksheet) {
    // Cerca la riga dove iniziano i dati (dopo le intestazioni)
    for (let row = 1; row <= 20; row++) {
      const cell = worksheet.getCell(row, 1);
      if (cell.value && typeof cell.value === "string") {
        const cellValue = cell.value.toLowerCase();
        if (
          cellValue.includes("data") ||
          cellValue.includes("date") ||
          cellValue.includes("giorno") ||
          cellValue.includes("day")
        ) {
          return row + 1; // Ritorna la riga successiva all'intestazione
        }
      }
    }
    return 10; // Default se non trova l'intestazione
  }

  async convertExcelToPDF(excelPath) {
    try {
      const pdfPath = excelPath.replace(".xlsx", ".pdf");

      // Leggi il file Excel e convertilo in HTML
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(excelPath);

      const worksheet = workbook.getWorksheet(1);
      let htmlContent = this.generateHTMLFromWorksheet(worksheet);

      // Usa Puppeteer per convertire HTML in PDF
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: "networkidle0" });

      await page.pdf({
        path: pdfPath,
        format: "A4",
        margin: {
          top: "1cm",
          right: "1cm",
          bottom: "1cm",
          left: "1cm",
        },
        printBackground: true,
      });

      await browser.close();

      return pdfPath;
    } catch (error) {
      console.error("Error converting Excel to PDF:", error);
      throw error;
    }
  }

  generateHTMLFromWorksheet(worksheet) {
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .title { font-size: 18px; font-weight: bold; margin-bottom: 20px; text-align: center; }
          .summary { margin-top: 20px; font-weight: bold; }
          .currency { text-align: right; }
          .center { text-align: center; }
        </style>
      </head>
      <body>
    `;

    // Estrai i dati dal worksheet
    const rows = [];
    worksheet.eachRow((row, rowNumber) => {
      const rowData = [];
      row.eachCell((cell, colNumber) => {
        let value = cell.value;

        // Gestisci i diversi tipi di dati
        if (cell.value instanceof Date) {
          value = cell.value.toLocaleDateString("it-IT");
        } else if (
          typeof cell.value === "number" &&
          cell.numFmt &&
          cell.numFmt.includes("€")
        ) {
          value = `€${cell.value.toFixed(2)}`;
        }

        rowData[colNumber] = value || "";
      });
      rows[rowNumber] = rowData;
    });

    // Trova il titolo (prima riga non vuota)
    let title = "";
    for (let i = 1; i < rows.length && i <= 10; i++) {
      if (rows[i]) {
        for (let j = 1; j < rows[i].length; j++) {
          if (
            rows[i][j] &&
            typeof rows[i][j] === "string" &&
            rows[i][j].length > 5
          ) {
            title = rows[i][j];
            break;
          }
        }
        if (title) break;
      }
    }

    if (title) {
      html += `<div class="title">${title}</div>`;
    }

    // Genera la tabella
    html += "<table>";

    let inDataSection = false;
    let headerFound = false;

    for (let i = 1; i < rows.length; i++) {
      if (!rows[i]) continue;

      const row = rows[i];
      const hasData = row.some((cell) => cell && cell.toString().trim() !== "");

      if (!hasData) continue;

      // Cerca l'intestazione della tabella
      if (
        !headerFound &&
        row.some(
          (cell) =>
            cell &&
            typeof cell === "string" &&
            (cell.toLowerCase().includes("data") ||
              cell.toLowerCase().includes("giorno")),
        )
      ) {
        headerFound = true;
        inDataSection = true;

        html += "<tr>";
        for (let j = 1; j < row.length && j <= 8; j++) {
          html += `<th>${row[j] || ""}</th>`;
        }
        html += "</tr>";
        continue;
      }

      // Se siamo nella sezione dati
      if (inDataSection && headerFound) {
        // Controlla se è una riga di riepilogo
        if (
          row.some(
            (cell) =>
              cell &&
              typeof cell === "string" &&
              (cell.includes("RIEPILOGO") || cell.includes("TOTALE")),
          )
        ) {
          html += "</table>";
          html += `<div class="summary">${row.filter((cell) => cell).join(" ")}</div>`;
          continue;
        }

        html += "<tr>";
        for (let j = 1; j < row.length && j <= 8; j++) {
          const cellValue = row[j] || "";
          const isAmount = j === 4 || j === 7; // Colonne degli importi
          const cssClass = isAmount ? "currency" : "";
          html += `<td class="${cssClass}">${cellValue}</td>`;
        }
        html += "</tr>";
      }
    }

    html += "</table></body></html>";
    return html;
  }

  async addAttachmentsToPDF(mainPdfPath, attachmentPaths) {
    try {
      if (!attachmentPaths || attachmentPaths.length === 0) {
        return mainPdfPath;
      }

      // Crea un nuovo documento PDF
      const mergedPdf = await PDFDocument.create();

      // Leggi e aggiungi il PDF principale
      const mainPdfBytes = fs.readFileSync(mainPdfPath);
      const mainPdf = await PDFDocument.load(mainPdfBytes);
      const mainPages = await mergedPdf.copyPages(
        mainPdf,
        mainPdf.getPageIndices(),
      );
      mainPages.forEach((page) => mergedPdf.addPage(page));

      // Aggiungi una pagina di separazione
      if (attachmentPaths.length > 0) {
        const separatorPage = mergedPdf.addPage();
        const { height } = separatorPage.getSize();

        separatorPage.drawText("ALLEGATI", {
          x: 50,
          y: height - 50,
          size: 20,
        });
      }

      // Aggiungi ogni allegato PDF
      for (const attachmentPath of attachmentPaths) {
        if (fs.existsSync(attachmentPath)) {
          try {
            const attachmentBytes = fs.readFileSync(attachmentPath);
            const attachmentPdf = await PDFDocument.load(attachmentBytes);
            const attachmentPages = await mergedPdf.copyPages(
              attachmentPdf,
              attachmentPdf.getPageIndices(),
            );
            attachmentPages.forEach((page) => mergedPdf.addPage(page));
          } catch (attachmentError) {
            console.error(
              `Error adding attachment ${attachmentPath}:`,
              attachmentError,
            );
          }
        }
      }

      // Salva il PDF unificato
      const mergedPdfBytes = await mergedPdf.save();
      const mergedPdfPath = mainPdfPath.replace(
        ".pdf",
        "_with_attachments.pdf",
      );
      fs.writeFileSync(mergedPdfPath, mergedPdfBytes);

      return mergedPdfPath;
    } catch (error) {
      console.error("Error merging PDFs:", error);
      return mainPdfPath; // Restituisci il PDF originale in caso di errore
    }
  }
}

module.exports = ExcelService;
