import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { serializeInvoice } from "@/lib/invoice-api";
import { connectDB } from "@/lib/mongodb";
import Invoice from "@/models/Invoice";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid invoice id" }, { status: 400 });
    }

    await connectDB();
    const invoice = await Invoice.findById(id);

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(serializeInvoice(invoice));
  } catch (error) {
    console.error("GET /api/invoices/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 }
    );
  }
}
