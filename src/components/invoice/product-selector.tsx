"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types/invoice";

interface ProductSelectorProps {
  products: Product[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  usedProductIds: Set<string>;
  error?: string;
}

export function ProductSelector({
  products,
  value,
  onChange,
  disabled = false,
  usedProductIds,
  error,
}: ProductSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = products.find((p) => p.id === value);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((p) => {
      if (!query) return true;
      return p.name.toLowerCase().includes(query);
    });
  }, [products, search]);

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        aria-invalid={!!error}
        disabled={disabled || products.length === 0}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "h-10 w-full justify-between font-normal",
          error && "border-destructive",
          !selected && "text-muted-foreground"
        )}
      >
        <span className="truncate">
          {selected ? selected.name : "Select product"}
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border border-border bg-popover p-2 shadow-card-hover">
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="h-8 pl-8 text-[13px]"
                autoFocus
              />
            </div>
            <ul className="max-h-48 overflow-y-auto" role="listbox">
              {filtered.length === 0 ? (
                <li className="px-2 py-4 text-center text-[13px] text-muted-foreground">
                  No products found
                </li>
              ) : (
                filtered.map((product) => {
                  const isUsed = usedProductIds.has(product.id) && product.id !== value;
                  const isSelected = product.id === value;
                  return (
                    <li key={product.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        disabled={isUsed}
                        onClick={() => {
                          onChange(product.id);
                          setOpen(false);
                          setSearch("");
                        }}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-[13px] transition-colors",
                          isSelected && "bg-primary/10 text-primary",
                          !isSelected && !isUsed && "hover:bg-muted",
                          isUsed && "cursor-not-allowed opacity-50"
                        )}
                      >
                        <span className="truncate">{product.name}</span>
                        <span className="ml-2 flex shrink-0 items-center gap-2 tabular-nums text-muted-foreground">
                          {formatCurrency(product.price)}
                          {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
                        </span>
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </>
      )}

      {error && (
        <p className="mt-1 text-[13px] text-destructive">{error}</p>
      )}
    </div>
  );
}
