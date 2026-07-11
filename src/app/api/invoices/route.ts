import { NextResponse } from "next/server";
import { calculateInvoice } from "@/lib/invoice-calculations";
import {
  generatePersistedInvoiceNumber,
  serializeInvoice,
  serializeInvoiceListItem,
  validateInvoiceInput,
} from "@/lib/invoice-api";
import { connectDB } from "@/lib/mongodb";
import { serializeProduct } from "@/lib/product-api";
import Invoice from "@/models/Invoice";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    const invoices = await Invoice.find().sort({ createdAt: -1 });

    return NextResponse.json(invoices.map(serializeInvoiceListItem));
  } catch (error) {
    console.error("GET /api/invoices error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = await validateInvoiceInput(body);

    if (typeof validated === "string") {
      return NextResponse.json({ error: validated }, { status: 400 });
    }

    await connectDB();

    const products = await Product.find().sort({ name: 1 });
    const productCatalog = products.map(serializeProduct);
    const { lineItems, calculations } = calculateInvoice(
      validated.products,
      productCatalog,
      validated.taxes
    );

    if (lineItems.length === 0) {
      return NextResponse.json(
        { error: "At least one valid product is required" },
        { status: 400 }
      );
    }

    const invoiceNumber = await generatePersistedInvoiceNumber(
      validated.invoiceDate
    );

    const invoice = await Invoice.create({
      invoiceNumber,
      invoiceDate: validated.invoiceDate,
      customerName: validated.customerName,
      customerAddress: validated.customerAddress,
      customerPhone: validated.customerPhone,
      customerGstin: validated.customerGstin ?? "",
      lineItems,
      taxes: validated.taxes,
      calculations,
    });

    return NextResponse.json(serializeInvoice(invoice), { status: 201 });
  } catch (error) {
    console.error("POST /api/invoices error:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}
