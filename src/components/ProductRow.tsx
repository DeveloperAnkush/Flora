"use client";

import { Control, Controller } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { ProductSelector } from "@/components/invoice/product-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import type { InvoiceFormValues, Product, ProductFormRow } from "@/types/invoice";

interface ProductRowProps {
  index: number;
  control: Control<InvoiceFormValues>;
  products: Product[];
  onRemove: (index: number) => void;
  canRemove: boolean;
  productsLoading?: boolean;
  allRows: ProductFormRow[];
}

export function ProductRow({
  index,
  control,
  products,
  onRemove,
  canRemove,
  productsLoading = false,
  allRows,
}: ProductRowProps) {
  const productId = allRows[index]?.productId ?? "";
  const quantity = allRows[index]?.quantity ?? 0;

  const usedInOtherRows = new Set(
    allRows
      .map((row, i) => (i !== index && row.productId ? row.productId : null))
      .filter((id): id is string => id !== null)
  );

  const selectedProduct = products.find((p) => p.id === productId);
  const unitPrice = selectedProduct?.price ?? 0;
  const lineTotal = unitPrice * (quantity || 0);

  return (
    <div className="grid grid-cols-1 gap-3 rounded-xl border border-border bg-card p-4 transition-all duration-150 hover:bg-muted/20 sm:grid-cols-12 sm:items-end">
      <div className="sm:col-span-4">
        <Label className="mb-1.5 block text-[13px] text-muted-foreground sm:hidden">
          Product
        </Label>
        <Controller
          name={`products.${index}.productId`}
          control={control}
          render={({ field, fieldState }) => (
            <ProductSelector
              products={products}
              value={field.value || ""}
              onChange={field.onChange}
              disabled={productsLoading || products.length === 0}
              usedProductIds={usedInOtherRows}
              error={fieldState.error?.message}
            />
          )}
        />
      </div>

      <div className="sm:col-span-2">
        <Label className="mb-1.5 block text-[13px] text-muted-foreground">
          Price
        </Label>
        <Input
          value={unitPrice > 0 ? formatCurrency(unitPrice) : "—"}
          readOnly
          tabIndex={-1}
          className="bg-muted/40 text-right tabular-nums"
        />
      </div>

      <div className="sm:col-span-2">
        <Label className="mb-1.5 block text-[13px] text-muted-foreground">
          Quantity
        </Label>
        <Controller
          name={`products.${index}.quantity`}
          control={control}
          render={({ field, fieldState }) => (
            <div>
              <Input
                type="number"
                min={1}
                value={field.value}
                onChange={(e) => field.onChange(Number(e.target.value))}
                aria-invalid={!!fieldState.error}
                className={fieldState.error ? "border-destructive" : ""}
              />
              {fieldState.error && (
                <p className="mt-1 text-[13px] text-destructive">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <div className="sm:col-span-3">
        <Label className="mb-1.5 block text-[13px] text-muted-foreground">
          Line Total
        </Label>
        <Input
          value={lineTotal > 0 ? formatCurrency(lineTotal) : "—"}
          readOnly
          tabIndex={-1}
          className="bg-muted/40 text-right font-medium tabular-nums"
        />
      </div>

      <div className="flex justify-end sm:col-span-1 sm:items-end">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          disabled={!canRemove}
          className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          aria-label="Remove product row"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
