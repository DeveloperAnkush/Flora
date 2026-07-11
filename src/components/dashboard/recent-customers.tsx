"use client";

import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import type { InvoiceListItem } from "@/types/invoice";

interface RecentCustomersProps {
  invoices: InvoiceListItem[];
}

export function RecentCustomers({ invoices }: RecentCustomersProps) {
  const customerMap = new Map<string, { name: string; phone: string; count: number }>();

  for (const invoice of invoices) {
    const key = invoice.customerPhone;
    const existing = customerMap.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      customerMap.set(key, {
        name: invoice.customerName,
        phone: invoice.customerPhone,
        count: 1,
      });
    }
  }

  const customers = Array.from(customerMap.values()).slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Customers</CardTitle>
      </CardHeader>
      <CardContent>
        {customers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No customers yet"
            description="Customer records appear here as you create invoices."
            className="py-10"
          />
        ) : (
          <div className="space-y-1">
            {customers.map((customer) => (
              <div
                key={customer.phone}
                className="flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-muted/60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-label font-semibold text-primary">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-label font-medium text-foreground">
                      {customer.name}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      {customer.phone}
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[12px] font-medium text-muted-foreground">
                  {customer.count} invoice{customer.count === 1 ? "" : "s"}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
