import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AGENCY_INFO } from "@/lib/agency";
import { drawPdfLogoIcon } from "@/lib/pdf-logo";
import { formatCurrencyPdf, formatDate } from "@/lib/utils";
import type { InvoiceData } from "@/types/invoice";
import { TAX_RATES } from "@/types/invoice";

const PRIMARY_COLOR: [number, number, number] = [31, 175, 139];
const SECONDARY_COLOR: [number, number, number] = [12, 60, 96];

/**
 * Generate a professional A4 PDF invoice and return the jsPDF instance.
 * Layout mirrors the live preview: full-width header, product table, tax summary.
 */
export function generateInvoicePDF(invoice: InvoiceData): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  // ── Full-width header ───────────────────────────────────────────────────
  const headerHeight = 48;
  doc.setFillColor(...SECONDARY_COLOR);
  doc.rect(0, 0, pageWidth, headerHeight, "F");

  // Logo icon (matches live preview Building2 icon)
  const logoSize = 14;
  drawPdfLogoIcon(doc, margin, 10, logoSize);

  // Agency info (left)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(AGENCY_INFO.name, margin + logoSize + 4, 14, {
    maxWidth: contentWidth * 0.55,
  });

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(220, 230, 240);
  doc.text(AGENCY_INFO.tagline, margin + logoSize + 4, 19, {
    maxWidth: contentWidth * 0.55,
  });
  doc.text(AGENCY_INFO.address, margin + logoSize + 4, 24, {
    maxWidth: contentWidth * 0.55,
  });
  doc.text(
    `GST: ${AGENCY_INFO.gstNumber} | M. ${AGENCY_INFO.phone} | ${AGENCY_INFO.phone2}`,
    margin + logoSize + 4,
    32,
    { maxWidth: contentWidth * 0.55 }
  );

  // Invoice title (right)
  doc.setTextColor(...PRIMARY_COLOR);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("TAX INVOICE", pageWidth - margin, 14, { align: "right" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(255, 255, 255);
  doc.text(
    `Invoice No: ${invoice.customer.invoiceNumber}`,
    pageWidth - margin,
    22,
    { align: "right" }
  );
  doc.text(
    `Date: ${formatDate(invoice.customer.invoiceDate)}`,
    pageWidth - margin,
    28,
    { align: "right" }
  );

  y = headerHeight + 10;

  // ── Bill To section ─────────────────────────────────────────────────────
  const hasGstin = Boolean(invoice.customer.customerGstin?.trim());
  const billToHeight = hasGstin ? 40 : 34;
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, y, contentWidth, billToHeight, 2, 2, "F");

  doc.setTextColor(...SECONDARY_COLOR);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO", margin + 5, y + 7);

  doc.setTextColor(40, 40, 40);
  doc.setFontSize(11);
  doc.text(invoice.customer.customerName, margin + 5, y + 14);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text(invoice.customer.customerAddress, margin + 5, y + 20, {
    maxWidth: contentWidth - 10,
  });

  doc.text(`Phone: ${invoice.customer.customerPhone}`, margin + 5, y + 28);

  if (hasGstin) {
    doc.text(`GSTIN: ${invoice.customer.customerGstin}`, margin + 5, y + 34);
  }

  y += billToHeight + 8;

  // ── Products table ──────────────────────────────────────────────────────
  const tableBody = invoice.lineItems.map((item) => [
    item.productName,
    formatCurrencyPdf(item.unitPrice),
    String(item.quantity),
    formatCurrencyPdf(item.lineTotal),
  ]);

  autoTable(doc, {
    startY: y,
    head: [["Product", "Price", "Qty", "Total"]],
    body: tableBody,
    tableWidth: contentWidth,
    margin: { left: margin, right: margin },
    theme: "plain",
    headStyles: {
      fillColor: SECONDARY_COLOR,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      cellPadding: { top: 4, bottom: 4, left: 4, right: 4 },
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [50, 50, 50],
      cellPadding: { top: 4, bottom: 4, left: 4, right: 4 },
      lineColor: [220, 225, 230],
      lineWidth: 0.1,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: contentWidth * 0.46, halign: "left" },
      1: { cellWidth: contentWidth * 0.2, halign: "right" },
      2: { cellWidth: contentWidth * 0.12, halign: "center" },
      3: { cellWidth: contentWidth * 0.22, halign: "right", fontStyle: "bold" },
    },
    didDrawPage: () => {
      if (doc.getNumberOfPages() > 1) {
        doc.setFillColor(...SECONDARY_COLOR);
        doc.rect(0, 0, pageWidth, 12, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text(AGENCY_INFO.name, margin, 8);
        doc.text(invoice.customer.invoiceNumber, pageWidth - margin, 8, {
          align: "right",
        });
      }
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 12;

  // ── Tax summary (right-aligned) ───────────────────────────────────────────
  const summaryWidth = 80;
  const summaryX = pageWidth - margin - summaryWidth;
  const valueX = pageWidth - margin;

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);

  const summaryRows: [string, string][] = [
    ["Subtotal", formatCurrencyPdf(invoice.calculations.subtotal)],
  ];

  if (invoice.taxes.gst) {
    summaryRows.push([
      `CGST (${TAX_RATES.cgst}%)`,
      formatCurrencyPdf(invoice.calculations.cgstAmount),
    ]);
    summaryRows.push([
      `SGST (${TAX_RATES.sgst}%)`,
      formatCurrencyPdf(invoice.calculations.sgstAmount),
    ]);
  }
  if (invoice.taxes.igst) {
    summaryRows.push([
      `IGST (${TAX_RATES.igst}%)`,
      formatCurrencyPdf(invoice.calculations.igstAmount),
    ]);
  }

  summaryRows.forEach(([label, value]) => {
    doc.setFont("helvetica", "normal");
    doc.text(label, summaryX, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text(value, valueX, y, { align: "right" });
    doc.setTextColor(100, 100, 100);
    y += 7;
  });

  y += 2;
  doc.setDrawColor(220, 225, 230);
  doc.setLineWidth(0.3);
  doc.line(summaryX, y, valueX, y);
  y += 6;

  // Grand total highlight box
  const grandTotalBoxHeight = 12;
  const boxPadding = 4;
  const boxLeft = summaryX - 2;
  const boxRight = valueX;

  doc.setFillColor(...PRIMARY_COLOR);
  doc.roundedRect(
    boxLeft,
    y - 4,
    boxRight - boxLeft,
    grandTotalBoxHeight,
    2,
    2,
    "F"
  );

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Grand Total", boxLeft + boxPadding, y + 3);
  doc.text(
    formatCurrencyPdf(invoice.calculations.grandTotal),
    boxRight - boxPadding,
    y + 3,
    { align: "right" }
  );

  y += grandTotalBoxHeight + 16;

  // ── Signature section ───────────────────────────────────────────────────
  const sigX = pageWidth - margin - 55;
  const sigWidth = 55;

  doc.setDrawColor(150, 150, 150);
  doc.setLineWidth(0.3);
  doc.line(sigX, y + 12, sigX + sigWidth, y + 12);

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Authorized Signature", sigX + sigWidth / 2, y + 17, {
    align: "center",
  });

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 100, 100);
  doc.text(AGENCY_INFO.name, sigX + sigWidth / 2, y + 22, {
    align: "center",
    maxWidth: sigWidth,
  });

  return doc;
}

/** Generate PDF and trigger browser download */
export function downloadInvoicePDF(invoice: InvoiceData): void {
  const doc = generateInvoicePDF(invoice);
  doc.save(`${invoice.customer.invoiceNumber}.pdf`);
}

/** Open the generated PDF in a hidden iframe and trigger the print dialog */
export function printInvoicePDF(invoice: InvoiceData): void {
  const doc = generateInvoicePDF(invoice);
  const blob = doc.output("blob");
  const blobUrl = URL.createObjectURL(blob);

  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;right:0;bottom:0;width:0;height:0;border:none;";
  iframe.src = blobUrl;

  const cleanup = () => {
    iframe.remove();
    URL.revokeObjectURL(blobUrl);
  };

  iframe.onload = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    setTimeout(cleanup, 1000);
  };

  document.body.appendChild(iframe);
}

/** Generate PDF blob URL for preview/download */
export function getInvoicePDFBlobUrl(invoice: InvoiceData): string {
  const doc = generateInvoicePDF(invoice);
  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
}
