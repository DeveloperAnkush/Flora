import type {
  InvoiceCalculations,
  InvoiceFormValues,
  InvoiceLineItem,
  Product,
  TaxSelection,
} from "@/types/invoice";
import { TAX_RATES } from "@/types/invoice";

/**
 * Build line items from form product rows and product catalog.
 * Rows with invalid productId or zero quantity are excluded.
 */
export function buildLineItems(
  productRows: InvoiceFormValues["products"],
  productCatalog: Product[]
): InvoiceLineItem[] {
  return productRows
    .filter((row) => row.productId && row.quantity > 0)
    .map((row) => {
      const product = productCatalog.find((p) => p.id === row.productId);
      if (!product) {
        return null;
      }
      return {
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity: row.quantity,
        lineTotal: product.price * row.quantity,
      };
    })
    .filter((item): item is InvoiceLineItem => item !== null);
}

/** Calculate subtotal from line items */
export function calculateSubtotal(lineItems: InvoiceLineItem[]): number {
  return lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
}

/** Calculate all tax amounts and grand total */
export function calculateTaxes(
  subtotal: number,
  taxes: TaxSelection
): InvoiceCalculations {
  const cgstAmount = taxes.gst ? subtotal * (TAX_RATES.cgst / 100) : 0;
  const sgstAmount = taxes.gst ? subtotal * (TAX_RATES.sgst / 100) : 0;
  const igstAmount = taxes.igst ? subtotal * (TAX_RATES.igst / 100) : 0;

  return {
    subtotal,
    cgstAmount,
    sgstAmount,
    igstAmount,
    grandTotal: subtotal + cgstAmount + sgstAmount + igstAmount,
  };
}

/** Full invoice calculation pipeline */
export function calculateInvoice(
  productRows: InvoiceFormValues["products"],
  productCatalog: Product[],
  taxes: TaxSelection
): { lineItems: InvoiceLineItem[]; calculations: InvoiceCalculations } {
  const lineItems = buildLineItems(productRows, productCatalog);
  const subtotal = calculateSubtotal(lineItems);
  const calculations = calculateTaxes(subtotal, taxes);

  return { lineItems, calculations };
}
