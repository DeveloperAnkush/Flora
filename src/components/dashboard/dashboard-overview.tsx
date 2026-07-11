"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  IndianRupee,
  Package,
  Receipt,
  TrendingUp,
} from "lucide-react";
import { DashboardWelcome } from "@/components/dashboard/quick-actions";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentCustomers } from "@/components/dashboard/recent-customers";
import { RecentInvoices } from "@/components/dashboard/recent-invoices";
import { StatsChart } from "@/components/dashboard/stats-chart";
import { TopProducts } from "@/components/dashboard/top-products";
import { DashboardSkeleton } from "@/components/shared/loading-skeleton";
import { TopNavbar } from "@/components/layout/top-navbar";
import { formatCurrency } from "@/lib/utils";
import type { InvoiceListItem, Product } from "@/types/invoice";

function getMonthlyRevenue(invoices: InvoiceListItem[]) {
  const months: { month: string; revenue: number }[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = date.toLocaleDateString("en-IN", { month: "short" });
    const monthRevenue = invoices
      .filter((inv) => {
        const invDate = new Date(inv.invoiceDate);
        return (
          invDate.getMonth() === date.getMonth() &&
          invDate.getFullYear() === date.getFullYear()
        );
      })
      .reduce((sum, inv) => sum + inv.grandTotal, 0);

    months.push({ month: monthKey, revenue: monthRevenue });
  }

  return months;
}

export function DashboardOverview() {
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [invoicesRes, productsRes] = await Promise.all([
        fetch("/api/invoices"),
        fetch("/api/products"),
      ]);
      const [invoicesData, productsData] = await Promise.all([
        invoicesRes.json(),
        productsRes.json(),
      ]);

      if (invoicesRes.ok) setInvoices(invoicesData);
      if (productsRes.ok) setProducts(productsData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalRevenue = useMemo(
    () => invoices.reduce((sum, inv) => sum + inv.grandTotal, 0),
    [invoices]
  );

  const monthlyData = useMemo(() => getMonthlyRevenue(invoices), [invoices]);

  const thisMonthRevenue = monthlyData[monthlyData.length - 1]?.revenue ?? 0;
  const lastMonthRevenue = monthlyData[monthlyData.length - 2]?.revenue ?? 0;
  const revenueChange =
    lastMonthRevenue > 0
      ? `${(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(0)}% vs last month`
      : "First month of data";

  if (loading) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <TopNavbar title="Dashboard" subtitle="Overview of your billing activity" />
        <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <TopNavbar title="Dashboard" subtitle="Overview of your billing activity" />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-4 sm:p-6"
      >
        <div className="mx-auto max-w-7xl space-y-6">
          <DashboardWelcome />

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              title="Total Revenue"
              value={formatCurrency(totalRevenue)}
              change={revenueChange}
              changeType={
                thisMonthRevenue >= lastMonthRevenue ? "positive" : "neutral"
              }
              icon={IndianRupee}
              index={0}
            />
            <KpiCard
              title="Invoices"
              value={String(invoices.length)}
              change={`${invoices.filter((i) => {
                const d = new Date(i.invoiceDate);
                const now = new Date();
                return (
                  d.getMonth() === now.getMonth() &&
                  d.getFullYear() === now.getFullYear()
                );
              }).length} this month`}
              changeType="neutral"
              icon={Receipt}
              index={1}
            />
            <KpiCard
              title="Products"
              value={String(products.length)}
              change="In catalog"
              changeType="neutral"
              icon={Package}
              index={2}
            />
            <KpiCard
              title="This Month"
              value={formatCurrency(thisMonthRevenue)}
              change="Current period revenue"
              changeType="positive"
              icon={TrendingUp}
              index={3}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <StatsChart data={monthlyData} />
            <QuickActions />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <RecentInvoices invoices={invoices} />
            <RecentCustomers invoices={invoices} />
          </div>

          <TopProducts products={products} />
        </div>
      </motion.main>
    </div>
  );
}
