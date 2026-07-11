import * as yup from "yup";
import type { InvoiceFormValues } from "@/types/invoice";

const isValidProductId = (value: string | undefined) =>
  Boolean(value && value.trim().length > 0);

export const invoiceValidationSchema: yup.ObjectSchema<InvoiceFormValues> = yup.object({
  customerName: yup
    .string()
    .trim()
    .required("Customer name is required")
    .test(
      "no-numbers",
      "Customer name cannot contain numbers",
      (value) => !value || !/\d/.test(value)
    ),
  customerAddress: yup
    .string()
    .trim()
    .required("Customer address is required"),
  customerPhone: yup
    .string()
    .trim()
    .required("Customer phone number is required")
    .matches(/^\d+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(12, "Phone number cannot exceed 12 digits"),
  customerGstin: yup.string().trim().default(""),
  invoiceDate: yup.string().required("Invoice date is required"),
  products: yup
    .array()
    .of(
      yup.object({
        productId: yup
          .string()
          .required()
          .test(
            "unique-product",
            "This product is already added. Increase quantity instead.",
            function (value) {
              if (!isValidProductId(value)) return true;
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const rows = (this as any).from?.[1]?.value?.products as
                | { productId: string }[]
                | undefined;
              if (!rows) return true;
              return (
                rows.filter((row) => row.productId === value).length <= 1
              );
            }
          ),
        quantity: yup
          .number()
          .min(1, "Quantity must be greater than 0")
          .required("Quantity is required"),
      })
    )
    .required()
    .min(1, "At least one product is required")
    .test(
      "valid-products",
      "At least one product must be selected",
      (products) => {
        if (!products || products.length === 0) return false;
        return products.some(
          (p) => isValidProductId(p.productId) && p.quantity > 0
        );
      }
    )
    .test(
      "unique-products",
      "Same product cannot be added in multiple rows. Increase quantity instead.",
      (products) => {
        if (!products) return true;
        const selectedIds = products
          .map((p) => p.productId)
          .filter(isValidProductId);
        return selectedIds.length === new Set(selectedIds).size;
      }
    ),
  taxes: yup
    .object({
      gst: yup.boolean().default(false),
      igst: yup.boolean().default(false),
    })
    .required(),
});
