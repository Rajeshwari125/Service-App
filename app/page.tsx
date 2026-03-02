"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/lib/auth-context";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { OtpVerification } from "@/components/auth/otp-verification";
import { MobileHeader } from "@/components/home/mobile-header";
import { SearchBar } from "@/components/home/search-bar";
import { OffersCarousel } from "@/components/home/offers-carousel";
import { CategoriesSection } from "@/components/home/categories-section";
import { SidebarMenu } from "@/components/home/sidebar-menu";
import { EmployeeHomeContent } from "@/components/home/employee-home-content";
import { AdminHomeContent } from "@/components/home/admin-home-content";
import { BottomNav } from "@/components/home/bottom-nav";
import { FeaturedServices } from "@/components/home/featured-services";
import { useSearch } from "@/lib/search-context";

type AuthView = "login" | "register" | "otp";

interface PendingRegistration {
  role: UserRole;
  userData: { name: string; mobile: string; };
}

export default function Page() {
  const { user } = useAuth();
  const { searchQuery } = useSearch();
  const [authView, setAuthView] = useState<AuthView>("login");
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingReg, setPendingReg] = useState<PendingRegistration | null>(
    null
  );

  // Not logged in - show auth screens (Layout provides the max-w-md container)
  if (!user) {
    return (
      <div className="flex h-full flex-col">
        {/* Auth Header */}
        <div className="flex flex-col items-center bg-slate-950 px-6 pb-12 pt-16 relative overflow-hidden">
          <div className="relative z-10 mb-6 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-primary to-accent p-[2px] shadow-2xl">
            <div className="flex h-full w-full items-center justify-center rounded-[2.4rem] bg-slate-900 border border-white/10">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/40" />
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70" />
              </svg>
            </div>
          </div>
          <h2 className="relative z-10 text-3xl font-black text-white tracking-tighter">
            ServiceHub
          </h2>
          <p className="relative z-10 mt-2 text-xs font-black uppercase tracking-[0.2em] text-white/40">
            Services & Rentals on Demand
          </p>

          {/* Decorative Orbs */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />
        </div>

        {/* Auth Body */}
        <div className="-mt-8 flex-1 rounded-t-[3rem] bg-background px-8 pt-10 shadow-2xl relative z-20">
          {authView === "login" && (
            <LoginForm
              onSwitch={() => setAuthView("register")}
              onSuccess={() => { }}
            />
          )}
          {authView === "register" && (
            <RegisterForm
              onSwitch={() => setAuthView("login")}
              onOtpRequired={(role, userData) => {
                setPendingReg({ role, userData });
                setAuthView("otp");
              }}
            />
          )}
          {authView === "otp" && pendingReg && (
            <OtpVerification
              mode="register"
              mobile={pendingReg.userData.mobile}
              onRegisterDetails={{ ...pendingReg.userData, role: pendingReg.role }}
              onSuccess={() => { }}
              onBack={() => setAuthView("register")}
            />
          )}
        </div>
      </div>
    );
  }

  // Logged in - show home based on role
  return (
    <div className="flex h-full flex-col relative">
      <MobileHeader onMenuOpen={() => setMenuOpen(true)} />

      <SidebarMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="flex-1 overflow-y-auto scrollbar-hide">
        {user.role === "admin" ? (
          <div className="pb-20">
            <SearchBar />
            <AdminHomeContent />
          </div>
        ) : (user.role === "employee" || user.role === "provider") ? (
          <div className="pb-20">
            <SearchBar />
            <EmployeeHomeContent />
          </div>
        ) : (
          <div className="pb-32">
            <SearchBar />
            {!searchQuery && (
              <>
                <OffersCarousel />
                <div className="pt-2">
                  <CategoriesSection />
                </div>
              </>
            )}
            <FeaturedServices />
          </div>
        )}
      </main>

      {user.role !== "admin" && (user.role === "employee" || user.role === "provider") === false && <BottomNav />}
    </div>
  );
}
