"use client";

import { useAuth } from "@/lib/auth-context";
import { Menu, User, Shield, ChevronDown } from "lucide-react";

interface MobileHeaderProps {
  onMenuOpen: () => void;
}

export function MobileHeader({ onMenuOpen }: MobileHeaderProps) {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className="sticky top-0 z-40 flex flex-col bg-primary px-4 pt-4 pb-3 shadow-md">
      <div className="flex items-center justify-between mb-3">
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
            <span className="text-[10px] font-bold text-primary-foreground/50 tracking-widest uppercase">{getGreeting()}</span>
            <h1 className="text-lg font-black text-primary-foreground">
              {user?.name?.split(' ')[0] || "Guest"}!
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-10 items-center gap-3 rounded-xl bg-primary-foreground/10 px-4 transition-colors hover:bg-primary-foreground/20 border border-primary-foreground/5">
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
                  : "Profile"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-primary-foreground/10 rounded-lg px-3 py-1.5 self-start">
        <span className="text-[10px] font-bold text-primary-foreground/60 uppercase">Location</span>
        <div className="flex items-center gap-1 text-primary-foreground">
          <span className="text-xs font-bold text-primary-foreground">Madurai, India</span>
          <ChevronDown size={12} className="text-primary-foreground/70" />
        </div>
      </div>
    </header>
  );
}
