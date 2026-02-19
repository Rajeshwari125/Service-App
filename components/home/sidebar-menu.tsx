"use client";

import { useAuth } from "@/lib/auth-context";
import {
  X,
  Home,
  ShoppingBag,
  Heart,
  Clock,
  Settings,
  HelpCircle,
  LogOut,
  User,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SidebarMenu({ isOpen, onClose }: SidebarMenuProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: ShoppingBag, label: "My Orders", href: "/orders" },
    { icon: Heart, label: "Favourites", href: "/favourites" },
    { icon: Clock, label: "History", href: "/history" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: HelpCircle, label: "Help & Support", href: "/support" },
  ];

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          role="button"
          tabIndex={0}
          aria-label="Close menu"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-card shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-primary px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/15">
              {user?.role === "admin" ? (
                <Shield size={24} className="text-primary-foreground" />
              ) : (
                <User size={24} className="text-primary-foreground" />
              )}
            </div>
            <div>
              <p className="font-bold text-primary-foreground">{user?.name}</p>
              <p className="text-xs text-primary-foreground/70">
                {user?.role === "employee"
                  ? `EMP ID: ${user.employeeId}`
                  : user?.role === "admin"
                    ? "Administrator"
                    : `+91 ${user?.mobile}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-primary-foreground/80"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Role Badge */}
        <div className="px-4 pt-4 pb-2">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${user?.role === "admin"
              ? "bg-destructive/10 text-destructive"
              : user?.role === "employee"
                ? "bg-accent/10 text-accent"
                : "bg-primary/10 text-primary"
              }`}
          >
            {user?.role === "admin"
              ? "Admin Panel"
              : user?.role === "employee"
                ? "Employee"
                : "Customer"}
          </span>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto px-2 py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-colors ${isActive
                  ? "bg-primary/10 font-bold text-primary"
                  : "text-foreground hover:bg-muted"
                  }`}
              >
                <Icon size={20} className={isActive ? "text-primary" : "text-muted-foreground"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-border p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/5"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
