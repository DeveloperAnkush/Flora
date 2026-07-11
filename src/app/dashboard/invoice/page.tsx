"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { InvoiceForm } from "@/components/InvoiceForm";
import { InvoiceList } from "@/components/InvoiceList";
import { InvoicePreviewModal } from "@/components/InvoicePreviewModal";
import { TopNavbar } from "@/components/layout/top-navbar";

type ViewMode = "list" | "create";

export default function DashboardInvoicePage() {
  const [view, setView] = useState<ViewMode>("list");
  const [listRefreshKey, setListRefreshKey] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewInvoiceId, setPreviewInvoiceId] = useState<string | null>(null);

  const handleCreateSuccess = useCallback(() => {
    setView("list");
    setListRefreshKey((key) => key + 1);
  }, []);

  const handleViewInvoice = useCallback((invoiceId: string) => {
    setPreviewInvoiceId(invoiceId);
    setPreviewOpen(true);
  }, []);

  const handlePreviewOpenChange = useCallback((open: boolean) => {
    setPreviewOpen(open);
    if (!open) {
      setPreviewInvoiceId(null);
    }
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <TopNavbar
        title="Invoices"
        subtitle={
          view === "list"
            ? "View and manage tax invoices"
            : "Create a new tax invoice"
        }
      />

      <main className="no-print min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          <AnimatePresence mode="wait" initial={false}>
            {view === "list" ? (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <InvoiceList
                  refreshKey={listRefreshKey}
                  onViewInvoice={handleViewInvoice}
                  onCreate={() => setView("create")}
                />
              </motion.div>
            ) : (
              <motion.div
                key="create"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <InvoiceForm
                  onSuccess={handleCreateSuccess}
                  onCancel={() => setView("list")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <InvoicePreviewModal
        open={previewOpen}
        onOpenChange={handlePreviewOpenChange}
        invoiceId={previewInvoiceId}
      />
    </div>
  );
}
