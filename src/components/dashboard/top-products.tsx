"use client";

import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/invoice";

interface TopProductsProps {
  products: Product[];
}

export function TopProducts({ products }: TopProductsProps) {
  const top = [...products]
    .sort((a, b) => b.price - a.price)
    .slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Top Products</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/products">
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {top.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No products yet"
            description="Add products to your catalog to use them in invoices."
            actionLabel="Add Product"
            onAction={() => {
              window.location.href = "/dashboard/products";
            }}
            className="py-10"
          />
        ) : (
          <div className="space-y-1">
            {top.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between rounded-xl px-3 py-3 transition-colors hover:bg-muted/60"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-[12px] font-semibold text-muted-foreground">
                    {index + 1}
                  </span>
                  <p className="text-label font-medium text-foreground">
                    {product.name}
                  </p>
                </div>
                <p className="text-label font-semibold tabular-nums text-foreground">
                  {formatCurrency(product.price)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
