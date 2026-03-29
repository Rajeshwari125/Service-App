"use client";

import { Home, Search, Calendar, User, LayoutDashboard, ClipboardList, PlusCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();

    // Employee/Provider bottom nav
    const employeeNavItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/" },
        { icon: ClipboardList, label: "Bookings", href: "/provider/manage-bookings" },
        { icon: PlusCircle, label: "Add", href: "/provider/add-listing" },
        { icon: User, label: "Profile", href: "/settings" },
    ];

    // Customer bottom nav
    const customerNavItems = [
        { icon: Home, label: "Home", href: "/" },
        { icon: Search, label: "Explore", href: "/browse/service/all" },
        { icon: Calendar, label: "Bookings", href: "/orders" },
        { icon: User, label: "Profile", href: "/settings" },
    ];

    const navItems = user?.role === "employee" ? employeeNavItems : customerNavItems;

    return (
        <div className="sticky bottom-0 z-40 flex w-full items-center justify-around border-t border-border bg-card/85 px-2 pt-3 pb-8 backdrop-blur-xl">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                    <button
                        key={item.label}
                        onClick={() => router.push(item.href)}
                        className={`group flex flex-col items-center gap-1 transition-all ${isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all ${isActive ? "bg-primary/10" : ""
                            }`}>
                            <Icon size={24} className={isActive ? "stroke-[2.5px]" : "stroke-[2px]"} />
                        </div>
                        <span className={`text-[10px] font-bold tracking-tight ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
                            {item.label}
                        </span>
                        {isActive && (
                            <div className="h-1 w-1 rounded-full bg-primary" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}

