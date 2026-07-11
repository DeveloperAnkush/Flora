"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProductForm } from "@/components/ProductForm";
import { ProductList } from "@/components/ProductList";
import { TopNavbar } from "@/components/layout/top-navbar";
import type { Product } from "@/types/invoice";

type ViewMode = "list" | "form";

export default function DashboardProductsPage() {
  const [view, setView] = useState<ViewMode>("list");
  const [listRefreshKey, setListRefreshKey] = useState(0);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleFormSuccess = useCallback(() => {
    setView("list");
    setEditingProduct(null);
    setListRefreshKey((key) => key + 1);
  }, []);

  const handleAddProduct = useCallback(() => {
    setEditingProduct(null);
    setView("form");
  }, []);

  const handleEditProduct = useCallback((product: Product) => {
    setEditingProduct(product);
    setView("form");
  }, []);

  const handleCancel = useCallback(() => {
    setView("list");
    setEditingProduct(null);
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <TopNavbar
        title="Products"
        subtitle={
          view === "list"
            ? "View and manage product catalog"
            : editingProduct
              ? "Edit product details"
              : "Add a new product"
        }
      />

      <main className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-4 sm:p-6">
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
                <ProductList
                  refreshKey={listRefreshKey}
                  onEditProduct={handleEditProduct}
                  onCreate={handleAddProduct}
                />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <ProductForm
                  product={editingProduct}
                  onSuccess={handleFormSuccess}
                  onCancel={handleCancel}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
