"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Menu, Moon, Sun, User } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { useTheme } from "@/components/theme/theme-provider";
import { Button } from "@/components/ui/button";
import { AGENCY_INFO } from "@/lib/agency";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";

interface TopNavbarProps {
  title?: string;
  subtitle?: string;
}

export function TopNavbar({ title, subtitle }: TopNavbarProps) {
  const router = useRouter();
  const { setMobileOpen } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await fetch("/api/auth/logout", { method: "POST" });
      setLogoutOpen(false);
      router.push("/login");
      router.refresh();
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <>
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="no-print sticky top-0 z-30 shrink-0 border-b border-border bg-background/80 nav-blur shadow-sm"
    >
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {(title || subtitle) && (
          <div className="min-w-0 flex-1">
            {title && (
              <h1 className="truncate text-card-title text-foreground">{title}</h1>
            )}
            {subtitle && (
              <p className="truncate text-label text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-muted-foreground"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <div className="hidden h-6 w-px bg-border sm:block" />

          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden min-w-0 lg:block">
              <p className="text-label font-medium text-foreground">Admin</p>
              <p className="whitespace-nowrap text-[12px] text-muted-foreground">
                {AGENCY_INFO.name}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setLogoutOpen(true)}
            className={cn("text-muted-foreground hover:text-destructive")}
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.header>

    <ConfirmDialog
      open={logoutOpen}
      onOpenChange={setLogoutOpen}
      title="Logout"
      description="Are you sure you want to logout?"
      confirmLabel="Logout"
      cancelLabel="Cancel"
      onConfirm={handleLogout}
      loading={logoutLoading}
    />
    </>
  );
}
