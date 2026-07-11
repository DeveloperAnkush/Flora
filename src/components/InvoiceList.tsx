"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, Plus, Receipt, Search } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { InvoiceListItem } from "@/types/invoice";

interface InvoiceListProps {
  refreshKey?: number;
  onViewInvoice: (invoiceId: string) => void;
  onCreate?: () => void;
}

export function InvoiceList({ refreshKey = 0, onViewInvoice, onCreate }: InvoiceListProps) {
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/invoices");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load invoices");
      }

      setInvoices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices, refreshKey]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return invoices;
    return invoices.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(query) ||
        inv.customerName.toLowerCase().includes(query) ||
        inv.customerPhone.includes(query)
    );
  }, [invoices, search]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>All Invoices</CardTitle>
          <p className="mt-1 text-label text-muted-foreground">
            {loading
              ? "Loading..."
              : `${invoices.length} invoice${invoices.length === 1 ? "" : "s"} total`}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search invoices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9"
              aria-label="Search invoices"
            />
          </div>
          {onCreate && (
            <Button type="button" onClick={onCreate} className="shrink-0">
              <Plus className="h-4 w-4" />
              Create Invoice
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <TableSkeleton rows={5} />
        ) : error ? (
          <p className="py-12 text-center text-label text-destructive">{error}</p>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title={search ? "No matching invoices" : "No invoices yet"}
            description={
              search
                ? "Try a different search term."
                : "Create your first tax invoice to get started."
            }
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
                <TableRow className="hover:bg-transparent">
                  <TableHead>Invoice No.</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden sm:table-cell">Phone</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    className="group transition-colors hover:bg-muted/40"
                  >
                    <TableCell className="font-mono text-[13px] font-medium">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell className="text-[13px]">
                      {formatDate(invoice.invoiceDate)}
                    </TableCell>
                    <TableCell className="text-[13px] font-medium">
                      {invoice.customerName}
                    </TableCell>
                    <TableCell className="hidden text-[13px] sm:table-cell">
                      {invoice.customerPhone}
                    </TableCell>
                    <TableCell className="text-right text-[13px] font-semibold tabular-nums">
                      {formatCurrency(invoice.grandTotal)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewInvoice(invoice.id)}
                        aria-label={`View invoice ${invoice.invoiceNumber}`}
                        className="opacity-70 group-hover:opacity-100"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
