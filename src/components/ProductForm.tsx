"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Pencil, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Product } from "@/types/invoice";

interface ProductFormState {
  name: string;
  price: string;
}

interface FieldErrors {
  name?: string;
  price?: string;
}

const emptyForm: ProductFormState = { name: "", price: "" };

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

function validateForm(form: ProductFormState): FieldErrors {
  const errors: FieldErrors = {};

  if (!form.name.trim()) {
    errors.name = "Product name is required";
  }

  if (!form.price.trim()) {
    errors.price = "Price is required";
  } else {
    const price = Number(form.price);
    if (Number.isNaN(price) || price < 0) {
      errors.price = "Enter a valid price";
    }
  }

  return errors;
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const isEditing = Boolean(product);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setForm({ name: product.name, price: String(product.price) });
    } else {
      setForm(emptyForm);
    }
    setFieldErrors({});
    setSubmitError(null);
  }, [product]);

  const handleNameChange = (value: string) => {
    setForm((prev) => ({ ...prev, name: value }));
    if (fieldErrors.name) {
      setFieldErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handlePriceChange = (value: string) => {
    setForm((prev) => ({ ...prev, price: value }));
    if (fieldErrors.price) {
      setFieldErrors((prev) => ({ ...prev, price: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm(form);
    if (errors.name || errors.price) {
      setFieldErrors(errors);
      return;
    }

    const price = Number(form.price);

    try {
      setSubmitting(true);
      setSubmitError(null);
      setFieldErrors({});

      const payload = { name: form.name.trim(), price };
      const response = await fetch(
        isEditing ? `/api/products/${product!.id}` : "/api/products",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save product");
      }

      setForm(emptyForm);
      onSuccess();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to save product"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-section text-foreground">
            {isEditing ? "Edit Product" : "Add Product"}
          </h2>
          <p className="mt-1 text-label text-muted-foreground">
            {isEditing
              ? "Update product name and price"
              : "Create a new product for invoices"}
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
          Back to List
        </Button>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="productName">
                  Product Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="productName"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Floor Cleaner"
                  aria-invalid={!!fieldErrors.name}
                  className={fieldErrors.name ? "border-destructive" : ""}
                />
                {fieldErrors.name ? (
                  <p className="text-[13px] text-destructive">{fieldErrors.name}</p>
                ) : (
                  <p className="text-[13px] text-muted-foreground">
                    Display name shown on invoices
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="productPrice">
                  Price (₹) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="productPrice"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  placeholder="e.g. 120"
                  aria-invalid={!!fieldErrors.price}
                  className={fieldErrors.price ? "border-destructive" : ""}
                />
                {fieldErrors.price ? (
                  <p className="text-[13px] text-destructive">{fieldErrors.price}</p>
                ) : (
                  <p className="text-[13px] text-muted-foreground">
                    Unit price before taxes
                  </p>
                )}
              </div>

              {submitError && (
                <p className="text-label text-destructive">{submitError}</p>
              )}

              <Button type="submit" size="lg" disabled={submitting}>
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isEditing ? (
                  <Pencil className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {isEditing ? "Update Product" : "Add Product"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </form>
    </div>
  );
}
