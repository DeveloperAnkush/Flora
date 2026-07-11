"use client";

import { UseFormRegister, FieldErrors } from "react-hook-form";
import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { InvoiceFormValues } from "@/types/invoice";

interface CustomerCardProps {
  register: UseFormRegister<InvoiceFormValues>;
  errors: FieldErrors<InvoiceFormValues>;
}

export function CustomerCard({ register, errors }: CustomerCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          Customer Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="customerName">
              Customer Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="customerName"
              placeholder="Enter customer name"
              autoComplete="name"
              aria-invalid={!!errors.customerName}
              {...register("customerName")}
              className={errors.customerName ? "border-destructive" : ""}
            />
            {errors.customerName ? (
              <p className="text-[13px] text-destructive">
                {errors.customerName.message}
              </p>
            ) : (
              <p className="text-[13px] text-muted-foreground">
                Full legal or business name
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerPhone">
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="customerPhone"
              type="tel"
              inputMode="numeric"
              maxLength={12}
              placeholder="Enter phone number"
              autoComplete="tel"
              aria-invalid={!!errors.customerPhone}
              {...register("customerPhone")}
              className={errors.customerPhone ? "border-destructive" : ""}
            />
            {errors.customerPhone && (
              <p className="text-[13px] text-destructive">
                {errors.customerPhone.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerAddress">
            Customer Address <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="customerAddress"
            placeholder="Enter full billing address"
            rows={3}
            aria-invalid={!!errors.customerAddress}
            {...register("customerAddress")}
            className={errors.customerAddress ? "border-destructive" : ""}
          />
          {errors.customerAddress && (
            <p className="text-[13px] text-destructive">
              {errors.customerAddress.message}
            </p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="customerGstin">GSTIN Number</Label>
            <Input
              id="customerGstin"
              placeholder="Optional GSTIN"
              {...register("customerGstin")}
            />
            <p className="text-[13px] text-muted-foreground">
              Required for B2B invoices
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoiceDate">Invoice Date</Label>
            <Input id="invoiceDate" type="date" {...register("invoiceDate")} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
