"use client";

import { Building2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AGENCY_INFO } from "@/lib/agency";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { InvoiceData } from "@/types/invoice";
import { TAX_RATES } from "@/types/invoice";

interface InvoicePreviewProps {
  invoice: InvoiceData | null;
  isGenerated?: boolean;
  printRef?: React.RefObject<HTMLDivElement | null>;
  compact?: boolean;
}

export function InvoicePreview({
  invoice,
  isGenerated = false,
  printRef,
  compact = false,
}: InvoicePreviewProps) {
  if (!invoice) {
    return (
      <div className="flex h-full min-h-[480px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center shadow-card">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <Building2 className="h-7 w-7 text-muted-foreground/50" />
        </div>
        <h3 className="text-card-title text-foreground">Invoice Preview</h3>
        <p className="mt-2 max-w-xs text-label text-muted-foreground">
          Fill in customer details and add products to see a live preview here.
        </p>
      </div>
    );
  }

  const { customer, lineItems, taxes, calculations } = invoice;
  const hasLineItems = lineItems.length > 0;

  return (
    <div
      ref={printRef}
      className={`invoice-print-area overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-200 ${
        isGenerated ? "ring-2 ring-primary/20 shadow-card-hover" : ""
      } ${compact ? "text-[13px]" : ""}`}
    >
      {/* Header */}
      <div className="border-b border-border bg-muted/30 px-5 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-card">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-label font-bold leading-tight text-foreground">
                {AGENCY_INFO.name}
              </h2>
              <p className="mt-0.5 text-[12px] text-muted-foreground">
                {AGENCY_INFO.tagline}
              </p>
              <p className="mt-1 text-[12px] text-muted-foreground">
                {AGENCY_INFO.address}
              </p>
              <p className="mt-1 text-[12px] text-muted-foreground">
                GST: {AGENCY_INFO.gstNumber} · M. {AGENCY_INFO.phone}
              </p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-section font-bold tracking-wide text-primary">
              TAX INVOICE
            </p>
            <p className="mt-2 text-[13px] text-foreground">
              <span className="text-muted-foreground">No: </span>
              {customer.invoiceNumber}
            </p>
            <p className="text-[13px] text-foreground">
              <span className="text-muted-foreground">Date: </span>
              {formatDate(customer.invoiceDate) || "—"}
            </p>
          </div>
        </div>
      </div>

      <div className={compact ? "p-4" : "p-6"}>
        {/* Customer */}
        <div className="mb-5 rounded-xl border border-border bg-muted/20 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Bill To
          </p>
          <p className="mt-2 text-label font-semibold text-foreground">
            {customer.customerName || "—"}
          </p>
          <p className="mt-1 whitespace-pre-line text-[13px] text-muted-foreground">
            {customer.customerAddress || "—"}
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Phone: {customer.customerPhone || "—"}
          </p>
          {customer.customerGstin && (
            <p className="mt-1 text-[13px] text-muted-foreground">
              GSTIN: {customer.customerGstin}
            </p>
          )}
        </div>

        {/* Products */}
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-[12px]">Product</TableHead>
                <TableHead className="text-right text-[12px]">Price</TableHead>
                <TableHead className="text-center text-[12px]">Qty</TableHead>
                <TableHead className="text-right text-[12px]">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hasLineItems ? (
                lineItems.map((item) => (
                  <TableRow key={`${item.productId}-${item.quantity}`}>
                    <TableCell className="text-[13px] font-medium">
                      {item.productName}
                    </TableCell>
                    <TableCell className="text-right text-[13px] tabular-nums">
                      {formatCurrency(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-center text-[13px]">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-right text-[13px] font-medium tabular-nums">
                      {formatCurrency(item.lineTotal)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-8 text-center text-[13px] text-muted-foreground"
                  >
                    No products added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Separator className="my-5" />

        {/* Tax summary */}
        <div className="flex justify-end">
          <div className="w-full max-w-xs space-y-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium tabular-nums">
                {formatCurrency(calculations.subtotal)}
              </span>
            </div>

            {taxes.gst && (
              <>
                <div className="flex justify-between text-[13px]">
                  <span className="text-muted-foreground">
                    CGST ({TAX_RATES.cgst}%)
                  </span>
                  <span className="tabular-nums">
                    {formatCurrency(calculations.cgstAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-muted-foreground">
                    SGST ({TAX_RATES.sgst}%)
                  </span>
                  <span className="tabular-nums">
                    {formatCurrency(calculations.sgstAmount)}
                  </span>
                </div>
              </>
            )}

            {taxes.igst && (
              <div className="flex justify-between text-[13px]">
                <span className="text-muted-foreground">
                  IGST ({TAX_RATES.igst}%)
                </span>
                <span className="tabular-nums">
                  {formatCurrency(calculations.igstAmount)}
                </span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between rounded-xl bg-primary px-4 py-3 text-primary-foreground">
              <span className="text-label font-semibold">Grand Total</span>
              <span className="text-card-title font-bold tabular-nums">
                {formatCurrency(calculations.grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="mt-8 flex justify-end">
          <div className="text-center">
            <div className="mb-2 h-10 w-40 border-b border-foreground/20" />
            <p className="text-[13px] font-medium">Authorized Signature</p>
            <p className="text-[12px] text-muted-foreground">
              {AGENCY_INFO.name}
            </p>
          </div>
        </div>

        {/* Thank you & footer */}
        <div className="mt-6 rounded-xl bg-muted/30 px-4 py-3 text-center">
          <p className="text-[13px] font-medium text-foreground">
            Thank you for your business!
          </p>
          <p className="mt-1 text-[12px] text-muted-foreground">
            {AGENCY_INFO.jurisdiction}
          </p>
        </div>
      </div>
    </div>
  );
}
