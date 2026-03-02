"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Menu, User, Shield, ChevronDown, MapPin, Check, X } from "lucide-react";

interface MobileHeaderProps {
  onMenuOpen: () => void;
}

const CITIES = [
  "Madurai",
  "Chennai",
  "Coimbatore",
  "Trichy",
  "Salem",
  "Tirunelveli",
  "Vellore",
  "Erode",
  "Thoothukudi",
  "Dindigul",
  "Bangalore",
  "Mumbai",
  "Delhi",
  "Hyderabad",
];

export function MobileHeader({ onMenuOpen }: MobileHeaderProps) {
  const { user } = useAuth();
  const [selectedCity, setSelectedCity] = useState("Madurai");
  const [showCityPicker, setShowCityPicker] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex flex-col bg-primary px-4 pt-4 pb-3 shadow-md gap-3">
        {/* Top Row: Menu, App Name, Location */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onMenuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground/20"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-black text-primary-foreground tracking-tighter">
              ServiceHub
            </h1>
          </div>

          {/* Tappable Location Picker */}
          <button
            type="button"
            onClick={() => setShowCityPicker(true)}
            className="flex items-center gap-1.5 bg-primary-foreground/10 hover:bg-primary-foreground/20 active:scale-95 transition-all rounded-lg px-2.5 py-1.5"
          >
            <MapPin size={12} className="text-primary-foreground/70" />
            <span className="text-xs font-bold text-primary-foreground truncate max-w-[80px]">{selectedCity}</span>
            <ChevronDown size={12} className="text-primary-foreground/70" />
          </button>
        </div>

        {/* Second Row: Greeting and Profile */}
        <div className="flex items-center justify-between bg-primary-foreground/5 p-2 rounded-xl">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-primary-foreground/60 tracking-widest uppercase">{getGreeting()}</span>
            <h2 className="text-sm font-black text-primary-foreground">
              {user?.name?.split(" ")[0] || "Guest"}!
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-8 items-center gap-2 rounded-lg bg-primary-foreground/10 px-3 transition-colors hover:bg-primary-foreground/20 border border-primary-foreground/5 cursor-pointer">
              {user?.role === "admin" ? (
                <Shield size={14} className="text-primary-foreground" />
              ) : (
                <User size={14} className="text-primary-foreground" />
              )}
              <span className="text-[11px] font-bold text-primary-foreground">
                {user?.role === "employee"
                  ? `ID: ${user.employeeId}`
                  : user?.role === "admin"
                    ? "Admin"
                    : "Profile"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* City Picker Bottom Sheet — scoped to phone frame */}
      {showCityPicker && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-end"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowCityPicker(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle + Header */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
              <div>
                <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-4" />
                <h3 className="text-base font-black text-slate-900">Choose Your Location</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Services will be shown near you</p>
              </div>
              <button
                onClick={() => setShowCityPicker(false)}
                className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X size={16} />
              </button>
            </div>

            {/* City List */}
            <div className="px-4 py-3 max-h-72 overflow-y-auto scrollbar-hide">
              <div className="grid grid-cols-2 gap-2">
                {CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setShowCityPicker(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-left transition-all active:scale-95 ${selectedCity === city
                      ? "bg-primary text-white border-primary shadow-md"
                      : "bg-slate-50 text-slate-700 border-slate-100 hover:border-primary/30"
                      }`}
                  >
                    <MapPin size={13} className={selectedCity === city ? "text-white/80" : "text-primary/60"} />
                    <span className="text-xs font-black">{city}</span>
                    {selectedCity === city && <Check size={12} className="ml-auto text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom padding for safe area */}
            <div className="h-6" />
          </div>
        </div>
      )}
    </>
  );
}
