"use client";

import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { CustomerCard } from "@/components/invoice/customer-card";
import { ProductTable } from "@/components/invoice/product-table";
import { TaxSummary } from "@/components/invoice/tax-summary";
import { Button } from "@/components/ui/button";
import { calculateInvoice } from "@/lib/invoice-calculations";
import { invoiceValidationSchema } from "@/lib/validation-schema";
import type { InvoiceFormValues, Product } from "@/types/invoice";

interface InvoiceFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function InvoiceForm({ onSuccess, onCancel }: InvoiceFormProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InvoiceFormValues>({
    resolver: yupResolver(invoiceValidationSchema),
    defaultValues: {
      customerName: "",
      customerAddress: "",
      customerPhone: "",
      customerGstin: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      products: [{ productId: "", quantity: 1 }],
      taxes: { gst: false, igst: false },
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const watchedValues = useWatch({ control });

  useEffect(() => {
    async function fetchProducts() {
      try {
        setProductsLoading(true);
        setProductsError(null);
        const response = await fetch("/api/products");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load products");
        }

        setProducts(data);
      } catch (error) {
        setProductsError(
          error instanceof Error ? error.message : "Failed to load products"
        );
      } finally {
        setProductsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const { calculations, lineItems } = useMemo(() => {
    const formValues = (watchedValues ?? {}) as InvoiceFormValues;
    return calculateInvoice(
      formValues.products ?? [],
      products,
      formValues.taxes ?? { gst: false, igst: false }
    );
  }, [watchedValues, products]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      setSubmitting(true);
      setSubmitError(null);

      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create invoice");
      }

      reset({
        customerName: "",
        customerAddress: "",
        customerPhone: "",
        customerGstin: "",
        invoiceDate: new Date().toISOString().split("T")[0],
        products: [{ productId: "", quantity: 1 }],
        taxes: { gst: false, igst: false },
      });
      onSuccess();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to create invoice"
      );
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-section text-foreground">Create Invoice</h2>
          <p className="mt-1 text-label text-muted-foreground">
            Invoice number is assigned automatically on save
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </Button>
      </div>

      <form onSubmit={onSubmit}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          <CustomerCard register={register} errors={errors} />

          <ProductTable
            control={control}
            errors={errors}
            fields={fields}
            append={append}
            remove={remove}
            products={products}
            productsLoading={productsLoading}
            productsError={productsError}
          />

          <TaxSummary
            control={control}
            errors={errors}
            calculations={calculations}
            hasLineItems={lineItems.length > 0}
          />

          {submitError && (
            <p className="text-label text-destructive">{submitError}</p>
          )}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              Generate Invoice
            </Button>
          </div>
        </motion.div>
      </form>
    </div>
  );
}
