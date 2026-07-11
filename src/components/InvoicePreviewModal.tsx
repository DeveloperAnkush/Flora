"use client";

import { useEffect, useState } from "react";
import { Download, FileText, Loader2, Printer } from "lucide-react";
import { InvoicePreview } from "@/components/InvoicePreview";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogCloseButton,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  downloadInvoicePDF,
  generateInvoicePDF,
  printInvoicePDF,
} from "@/lib/invoice-generator";
import type { InvoiceData } from "@/types/invoice";

interface InvoicePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId: string | null;
}

export function InvoicePreviewModal({
  open,
  onOpenChange,
  invoiceId,
}: InvoicePreviewModalProps) {
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);

  useEffect(() => {
    if (!open || !invoiceId) {
      setInvoice(null);
      setFetchError(null);
      return;
    }

    async function fetchInvoice() {
      try {
        setLoading(true);
        setFetchError(null);
        const response = await fetch(`/api/invoices/${invoiceId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to load invoice");
        }

        const { id: _id, ...invoiceData } = data;
        setInvoice(invoiceData);
      } catch (error) {
        setFetchError(
          error instanceof Error ? error.message : "Failed to load invoice"
        );
        setInvoice(null);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoice();
  }, [open, invoiceId]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setPdfReady(false);
      setIsGeneratingPdf(false);
      setInvoice(null);
      setFetchError(null);
    }
    onOpenChange(nextOpen);
  };

  const onGeneratePdf = async () => {
    if (!invoice) return;

    try {
      setIsGeneratingPdf(true);
      generateInvoicePDF(invoice);
      setPdfReady(true);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const onDownloadPdf = () => {
    if (!invoice) return;
    downloadInvoicePDF(invoice);
  };

  const onPrint = () => {
    if (!invoice) return;
    printInvoicePDF(invoice);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="gap-0 p-0"
        onInteractOutside={(event) => event.preventDefault()}
        onEscapeKeyDown={(event) => event.preventDefault()}
      >
        <DialogHeader className="no-print relative shrink-0">
          <DialogTitle>Invoice Preview</DialogTitle>
          <DialogDescription>
            {invoice
              ? `Invoice ${invoice.customer.invoiceNumber}`
              : "Review your invoice and generate a PDF when ready."}
          </DialogDescription>
          <DialogCloseButton />
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="min-h-[300px] space-y-4 py-4">
              <div className="h-8 w-48 animate-pulse rounded-xl bg-muted" />
              <div className="h-64 animate-pulse rounded-2xl bg-muted" />
            </div>
          ) : fetchError ? (
            <div className="flex min-h-[300px] items-center justify-center text-destructive">
              {fetchError}
            </div>
          ) : (
            <InvoicePreview invoice={invoice} isGenerated />
          )}
        </div>

        <div className="no-print flex shrink-0 flex-wrap gap-3 border-t bg-muted/30 px-6 py-4">
          {!pdfReady ? (
            <Button
              type="button"
              variant="secondary"
              onClick={onGeneratePdf}
              disabled={isGeneratingPdf || !invoice || loading || !!fetchError}
            >
              {isGeneratingPdf ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              Generate PDF
            </Button>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={onDownloadPdf}>
                <Download className="h-4 w-4" />
                Download PDF
              </Button>

              <Button type="button" variant="outline" onClick={onPrint}>
                <Printer className="h-4 w-4" />
                Print Invoice
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
