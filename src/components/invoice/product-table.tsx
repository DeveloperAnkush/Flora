"use client";

import { Control, Controller, FieldErrors, useWatch } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Package } from "lucide-react";
import { ProductRow } from "@/components/ProductRow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import type { InvoiceFormValues, Product } from "@/types/invoice";

interface ProductTableProps {
  control: Control<InvoiceFormValues>;
  errors: FieldErrors<InvoiceFormValues>;
  fields: { id: string }[];
  append: (value: { productId: string; quantity: number }) => void;
  remove: (index: number) => void;
  products: Product[];
  productsLoading: boolean;
  productsError: string | null;
}

export function ProductTable({
  control,
  errors,
  fields,
  append,
  remove,
  products,
  productsLoading,
  productsError,
}: ProductTableProps) {
  const watchedProducts = useWatch({ control, name: "products" });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" />
          Products
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {productsError && (
          <p className="text-[13px] text-destructive">{productsError}</p>
        )}

        {!productsLoading && products.length === 0 && !productsError && (
          <EmptyState
            icon={Package}
            title="No products in catalog"
            description="Add products before creating an invoice."
            actionLabel="Go to Products"
            onAction={() => {
              window.location.href = "/dashboard/products";
            }}
            className="py-8"
          />
        )}

        {(productsLoading || products.length > 0) && (
          <>
            <div className="hidden gap-3 px-1 text-[12px] font-medium uppercase tracking-wide text-muted-foreground sm:grid sm:grid-cols-12">
              <span className="sm:col-span-4">Product</span>
              <span className="sm:col-span-2">Price</span>
              <span className="sm:col-span-2">Qty</span>
              <span className="sm:col-span-3">Line Total</span>
              <span className="sm:col-span-1" />
            </div>

            <AnimatePresence mode="popLayout">
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <motion.div
                    key={field.id}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -16, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProductRow
                      index={index}
                      control={control}
                      products={products}
                      productsLoading={productsLoading}
                      onRemove={remove}
                      canRemove={fields.length > 1}
                      allRows={watchedProducts ?? []}
                    />
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          </>
        )}

        {errors.products && (
          <p className="text-[13px] text-destructive">
            {errors.products.root?.message ??
              (typeof errors.products === "object" && "message" in errors.products
                ? (errors.products.message as string)
                : "At least one product is required")}
          </p>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={() => append({ productId: "", quantity: 1 })}
          disabled={productsLoading}
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </CardContent>
    </Card>
  );
}
