"use client";

import { useAuth } from "@/lib/auth-context";
import { Menu, User, Shield, ChevronDown } from "lucide-react";

interface MobileHeaderProps {
  onMenuOpen: () => void;
}

export function MobileHeader({ onMenuOpen }: MobileHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between bg-primary px-4 py-3 shadow-md">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground/20"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        <div className="flex flex-col">
          <span className="text-[10px] font-medium text-primary-foreground/70 uppercase leading-tight tracking-wider">Location</span>
          <div className="flex items-center gap-1 text-primary-foreground">
            <span className="text-sm font-bold">Madurai, India</span>
            <ChevronDown size={14} className="text-primary-foreground/70" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex h-10 items-center gap-3 rounded-xl bg-primary-foreground/10 px-4 transition-colors hover:bg-primary-foreground/20">
          {user?.role === "admin" ? (
            <Shield size={18} className="text-primary-foreground" />
          ) : (
            <User size={18} className="text-primary-foreground" />
          )}
          <span className="text-xs font-bold text-primary-foreground">
            {user?.role === "employee"
              ? `ID: ${user.employeeId}`
              : user?.role === "admin"
                ? "Admin"
                : user?.mobile?.slice(-4) || "Guest"}
          </span>
        </div>
      </div>
    </header>
  );
}
