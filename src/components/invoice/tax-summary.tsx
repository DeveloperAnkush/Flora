"use client";

import { Control, Controller, FieldErrors } from "react-hook-form";
import { Receipt } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { InvoiceCalculations, InvoiceFormValues } from "@/types/invoice";
import { TAX_RATES } from "@/types/invoice";

interface TaxSummaryProps {
  control: Control<InvoiceFormValues>;
  errors: FieldErrors<InvoiceFormValues>;
  calculations: InvoiceCalculations;
  hasLineItems: boolean;
}

export function TaxSummary({
  control,
  calculations,
  hasLineItems,
}: TaxSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-primary" />
          Tax & Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-[13px] text-muted-foreground">
          Select GST, IGST, both, or neither. GST splits into CGST {TAX_RATES.cgst}%
          + SGST {TAX_RATES.sgst}%.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Controller
            name="taxes.gst"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                <Checkbox
                  id="gst"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="gst" className="flex-1 cursor-pointer">
                  <span className="text-label font-medium">GST</span>
                  <span className="mt-0.5 block text-[13px] text-muted-foreground">
                    CGST {TAX_RATES.cgst}% + SGST {TAX_RATES.sgst}%
                  </span>
                </Label>
              </div>
            )}
          />

          <Controller
            name="taxes.igst"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4 transition-colors hover:bg-muted/50">
                <Checkbox
                  id="igst"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="igst" className="flex-1 cursor-pointer">
                  <span className="text-label font-medium">IGST</span>
                  <span className="mt-0.5 block text-[13px] text-muted-foreground">
                    {TAX_RATES.igst}% inter-state
                  </span>
                </Label>
              </div>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-3 rounded-xl bg-muted/30 p-4">
          <div className="flex justify-between text-label">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium tabular-nums">
              {hasLineItems ? formatCurrency(calculations.subtotal) : "—"}
            </span>
          </div>

          {calculations.cgstAmount > 0 && (
            <div className="flex justify-between text-label">
              <span className="text-muted-foreground">
                CGST ({TAX_RATES.cgst}%)
              </span>
              <span className="tabular-nums">
                {formatCurrency(calculations.cgstAmount)}
              </span>
            </div>
          )}

          {calculations.sgstAmount > 0 && (
            <div className="flex justify-between text-label">
              <span className="text-muted-foreground">
                SGST ({TAX_RATES.sgst}%)
              </span>
              <span className="tabular-nums">
                {formatCurrency(calculations.sgstAmount)}
              </span>
            </div>
          )}

          {calculations.igstAmount > 0 && (
            <div className="flex justify-between text-label">
              <span className="text-muted-foreground">
                IGST ({TAX_RATES.igst}%)
              </span>
              <span className="tabular-nums">
                {formatCurrency(calculations.igstAmount)}
              </span>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between rounded-xl bg-primary px-4 py-3 text-primary-foreground">
            <span className="text-label font-semibold">Grand Total</span>
            <span className="text-section font-bold tabular-nums">
              {hasLineItems ? formatCurrency(calculations.grandTotal) : "—"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
