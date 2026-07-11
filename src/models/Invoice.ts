import mongoose, { Schema, type Document, type Model } from "mongoose";
import type {
  InvoiceCalculations,
  InvoiceLineItem,
  TaxSelection,
} from "@/types/invoice";

export interface IInvoice {
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerGstin: string;
  lineItems: InvoiceLineItem[];
  taxes: TaxSelection;
  calculations: InvoiceCalculations;
}

export interface IInvoiceDocument extends IInvoice, Document {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LineItemSchema = new Schema<InvoiceLineItem>(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const InvoiceSchema = new Schema<IInvoiceDocument>(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    invoiceDate: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerAddress: {
      type: String,
      required: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    customerGstin: {
      type: String,
      default: "",
      trim: true,
    },
    lineItems: {
      type: [LineItemSchema],
      required: true,
      validate: {
        validator: (items: InvoiceLineItem[]) => items.length > 0,
        message: "At least one line item is required",
      },
    },
    taxes: {
      gst: { type: Boolean, default: false },
      igst: { type: Boolean, default: false },
    },
    calculations: {
      subtotal: { type: Number, required: true, min: 0 },
      cgstAmount: { type: Number, required: true, min: 0 },
      sgstAmount: { type: Number, required: true, min: 0 },
      igstAmount: { type: Number, required: true, min: 0 },
      grandTotal: { type: Number, required: true, min: 0 },
    },
  },
  { timestamps: true }
);

InvoiceSchema.index({ invoiceDate: -1, createdAt: -1 });

const Invoice: Model<IInvoiceDocument> =
  mongoose.models.Invoice ??
  mongoose.model<IInvoiceDocument>("Invoice", InvoiceSchema);

export default Invoice;
