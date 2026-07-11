import * as yup from "yup";
import type { IInvoiceDocument } from "@/models/Invoice";
import Invoice from "@/models/Invoice";
import type { InvoiceData, InvoiceFormValues, InvoiceListItem } from "@/types/invoice";
import { invoiceValidationSchema } from "@/lib/validation-schema";

/** Serialize a full invoice document for preview/PDF */
export function serializeInvoice(doc: IInvoiceDocument): InvoiceData & { id: string } {
  return {
    id: doc._id.toString(),
    customer: {
      customerName: doc.customerName,
      customerAddress: doc.customerAddress,
      customerPhone: doc.customerPhone,
      customerGstin: doc.customerGstin,
      invoiceDate: doc.invoiceDate,
      invoiceNumber: doc.invoiceNumber,
    },
    lineItems: doc.lineItems,
    taxes: doc.taxes,
    calculations: doc.calculations,
  };
}

/** Serialize a summary row for the invoice list table */
export function serializeInvoiceListItem(doc: IInvoiceDocument): InvoiceListItem {
  return {
    id: doc._id.toString(),
    invoiceNumber: doc.invoiceNumber,
    invoiceDate: doc.invoiceDate,
    customerName: doc.customerName,
    customerPhone: doc.customerPhone,
    grandTotal: doc.calculations.grandTotal,
    createdAt: doc.createdAt.toISOString(),
  };
}

export async function validateInvoiceInput(
  body: unknown
): Promise<InvoiceFormValues | string> {
  if (!body || typeof body !== "object") {
    return "Invalid request body";
  }

  try {
    return await invoiceValidationSchema.validate(body, {
      stripUnknown: true,
      abortEarly: false,
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return error.errors[0] ?? "Validation failed";
    }
    return "Invalid request body";
  }
}

/** Generate invoice number from DB sequence for a given date (YYYY-MM-DD) */
export async function generatePersistedInvoiceNumber(
  invoiceDate: string
): Promise<string> {
  const [year, month, day] = invoiceDate.split("-");
  const datePart = `${year}${month}${day}`;
  const prefix = `RNS-${datePart}-`;

  const latest = await Invoice.findOne({
    invoiceNumber: { $regex: `^${prefix}` },
  })
    .sort({ invoiceNumber: -1 })
    .select("invoiceNumber");

  let sequence = 1;
  if (latest?.invoiceNumber) {
    const lastSeq = Number.parseInt(latest.invoiceNumber.split("-")[2] ?? "", 10);
    if (!Number.isNaN(lastSeq)) {
      sequence = lastSeq + 1;
    }
  }

  return `${prefix}${String(sequence).padStart(3, "0")}`;
}
