"use client";

import { Home, Search, Calendar, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();

    const navItems = [
        { icon: Home, label: "Home", href: "/" },
        { icon: Search, label: "Explore", href: "/browse/service/all" },
        { icon: Calendar, label: "Bookings", href: "/orders" },
        { icon: User, label: "Profile", href: "/settings" },
    ];

    return (
        <div className="sticky bottom-0 z-40 flex w-full items-center justify-around border-t border-border bg-card/80 px-2 py-3 backdrop-blur-lg">
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
