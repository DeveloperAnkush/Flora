import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { serializeProduct, validateProductInput } from "@/lib/product-api";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().sort({ name: 1 });
    return NextResponse.json(products.map(serializeProduct));
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = validateProductInput(body);

    if (typeof validated === "string") {
      return NextResponse.json({ error: validated }, { status: 400 });
    }

    await connectDB();
    const product = await Product.create(validated);
    return NextResponse.json(serializeProduct(product), { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
