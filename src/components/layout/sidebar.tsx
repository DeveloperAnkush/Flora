"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChartColumn,
  ChevronLeft,
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { AGENCY_INFO } from "@/lib/agency";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/invoice", label: "Invoices", icon: Receipt },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "#", label: "Customers", icon: Users, disabled: true },
  { href: "#", label: "Reports", icon: ChartColumn, disabled: true },
  { href: "#", label: "Settings", icon: Settings, disabled: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, mobileOpen, toggleCollapsed, setMobileOpen } = useSidebar();

  const sidebarContent = (
    <>
      <div
        className={cn(
          "flex shrink-0 items-center border-b border-border px-4 py-5",
          collapsed ? "justify-center" : "gap-3"
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="h-4 w-4" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
            className="min-w-0"
          >
            <p className="truncate text-label font-semibold text-foreground">
              {AGENCY_INFO.name}
            </p>
            <p className="truncate text-[12px] text-muted-foreground">ERP Dashboard</p>
          </motion.div>
        )}
        {mobileOpen && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="ml-auto rounded-lg p-1.5 text-muted-foreground hover:bg-muted lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            !item.disabled &&
            (item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href));

          const className = cn(
            "group flex items-center rounded-xl px-3 py-2.5 text-label font-medium transition-colors duration-150",
            collapsed ? "justify-center" : "gap-3",
            item.disabled
              ? "cursor-not-allowed text-muted-foreground/50"
              : isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
          );

          const content = (
            <>
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && (
                <span className="flex flex-1 items-center justify-between">
                  {item.label}
                  {item.disabled && (
                    <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                      Soon
                    </span>
                  )}
                </span>
              )}
            </>
          );

          if (item.disabled) {
            return (
              <div key={item.label} className={className} title={item.label}>
                {content}
              </div>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={className}
              title={collapsed ? item.label : undefined}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      <div className="hidden shrink-0 border-t border-border p-3 lg:block">
        <button
          type="button"
          onClick={toggleCollapsed}
          className={cn(
            "flex w-full items-center rounded-xl px-3 py-2 text-label text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            collapsed ? "justify-center" : "gap-3"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              collapsed && "rotate-180"
            )}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="no-print hidden h-full shrink-0 flex-col border-r border-border bg-sidebar lg:flex"
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="no-print fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-border bg-sidebar shadow-card-hover lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
