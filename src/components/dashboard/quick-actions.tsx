"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Package, Plus, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const actions = [
  {
    href: "/dashboard/invoice",
    label: "Create Invoice",
    description: "Generate a new tax invoice",
    icon: Plus,
    primary: true,
  },
  {
    href: "/dashboard/invoice",
    label: "View Invoices",
    description: "Browse invoice history",
    icon: Receipt,
    primary: false,
  },
  {
    href: "/dashboard/products",
    label: "Manage Products",
    description: "Update product catalog",
    icon: Package,
    primary: false,
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="min-w-0"
              >
                <Button
                  variant={action.primary ? "default" : "outline"}
                  className="h-auto w-full min-w-0 flex-col items-start gap-2 whitespace-normal p-4 text-left"
                  asChild
                >
                  <Link
                    href={action.href}
                    className="flex w-full min-w-0 flex-col items-start gap-2"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="w-full text-label font-semibold">
                      {action.label}
                    </span>
                    <span
                      className={cn(
                        "w-full text-[12px] font-normal leading-snug break-words",
                        action.primary
                          ? "text-primary-foreground/85"
                          : "text-muted-foreground"
                      )}
                    >
                      {action.description}
                    </span>
                  </Link>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardWelcome() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-border bg-card p-6 shadow-card"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-section text-foreground">Welcome back</h2>
          <p className="mt-1 text-body text-muted-foreground">
            Manage invoices, products, and billing from your ERP dashboard.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
