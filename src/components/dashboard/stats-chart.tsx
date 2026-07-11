"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface MonthlyData {
  month: string;
  revenue: number;
}

interface StatsChartProps {
  data: MonthlyData[];
}

export function StatsChart({ data }: StatsChartProps) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        {data.every((d) => d.revenue === 0) ? (
          <p className="py-12 text-center text-label text-muted-foreground">
            No revenue data yet. Create invoices to see trends.
          </p>
        ) : (
          <div className="flex h-48 items-end gap-2 sm:gap-3">
            {data.map((item, index) => {
              const height = (item.revenue / maxRevenue) * 100;
              return (
                <div
                  key={item.month}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, 4)}%` }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="w-full min-h-[4px] rounded-t-lg bg-primary/80 hover:bg-primary transition-colors"
                    title={formatCurrency(item.revenue)}
                  />
                  <span className="text-[11px] text-muted-foreground">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
