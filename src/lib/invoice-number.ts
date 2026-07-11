/** Runtime invoice counter — increments per generated invoice */
let invoiceCounter = 1;

/**
 * Generate invoice number in format RNS-YYYYMMDD-001
 * Counter increments automatically during runtime.
 */
export function generateInvoiceNumber(date?: Date): string {
  const now = date ?? new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const datePart = `${year}${month}${day}`;
  const sequence = String(invoiceCounter).padStart(3, "0");
  invoiceCounter += 1;
  return `RNS-${datePart}-${sequence}`;
}

/** Reset counter (useful for testing) */
export function resetInvoiceCounter(): void {
  invoiceCounter = 1;
}

/** Get today's date in YYYY-MM-DD format for date input */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Format date as DD/MM/YYYY for invoice booklet */
export function formatInvoiceDate(dateString: string): string {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}
