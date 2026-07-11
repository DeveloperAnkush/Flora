"use client";

import Link from "next/link";
import { ChevronRight, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { InvoiceListItem } from "@/types/invoice";

interface RecentInvoicesProps {
  invoices: InvoiceListItem[];
}

export function RecentInvoices({ invoices }: RecentInvoicesProps) {
  const recent = invoices.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Recent Invoices</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/invoice">
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No invoices yet"
            description="Create your first tax invoice to start tracking revenue."
            actionLabel="Create Invoice"
            onAction={() => {
              window.location.href = "/dashboard/invoice";
            }}
            className="py-10"
          />
        ) : (
          <div className="space-y-1">
            {recent.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-muted/60"
              >
                <div className="min-w-0">
                  <p className="truncate text-label font-medium text-foreground">
                    {invoice.customerName}
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    {invoice.invoiceNumber} · {formatDate(invoice.invoiceDate)}
                  </p>
                </div>
                <p className="shrink-0 text-label font-semibold tabular-nums">
                  {formatCurrency(invoice.grandTotal)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
