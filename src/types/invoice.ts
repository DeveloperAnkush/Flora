export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface InvoiceLineItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface TaxSelection {
  gst: boolean;
  igst: boolean;
}

export const TAX_RATES = {
  cgst: 9,
  sgst: 9,
  igst: 18,
} as const;

export interface InvoiceCalculations {
  subtotal: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  grandTotal: number;
}

export interface CustomerInfo {
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerGstin: string;
  invoiceDate: string;
  invoiceNumber: string;
}

export interface InvoiceFormValues {
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerGstin: string;
  invoiceDate: string;
  products: ProductFormRow[];
  taxes: TaxSelection;
}

export interface ProductFormRow {
  productId: string;
  quantity: number;
}

export interface InvoiceData {
  customer: CustomerInfo;
  lineItems: InvoiceLineItem[];
  taxes: TaxSelection;
  calculations: InvoiceCalculations;
}

export interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerPhone: string;
  grandTotal: number;
  createdAt: string;
}

export interface AgencyInfo {
  name: string;
  tagline: string;
  address: string;
  gstNumber: string;
  phone: string;
  phone2: string;
  jurisdiction: string;
}
