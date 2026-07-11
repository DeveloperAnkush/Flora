import type { IProductDocument } from "@/models/Product";
import type { Product } from "@/types/invoice";

/** Serialize a Mongoose product document for API responses */
export function serializeProduct(doc: IProductDocument): Product {
  return {
    id: doc._id.toString(),
    name: doc.name,
    price: doc.price,
  };
}

export interface ProductInput {
  name: string;
  price: number;
}

export function validateProductInput(body: unknown): ProductInput | string {
  if (!body || typeof body !== "object") {
    return "Invalid request body";
  }

  const { name, price } = body as Record<string, unknown>;

  if (typeof name !== "string" || !name.trim()) {
    return "Product name is required";
  }

  if (typeof price !== "number" || Number.isNaN(price) || price < 0) {
    return "Valid product price is required";
  }

  return { name: name.trim(), price };
}
