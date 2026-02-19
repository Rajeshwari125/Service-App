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

type AuthView = "login" | "register" | "otp";

interface PendingRegistration {
  role: UserRole;
  userData: { name: string; mobile: string; };
}

export default function Page() {
  const { user } = useAuth();
  const [authView, setAuthView] = useState<AuthView>("login");
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingReg, setPendingReg] = useState<PendingRegistration | null>(
    null
  );

  // Not logged in - show auth screens
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <div className="mx-auto flex min-h-screen w-full max-w-md flex-col">
          {/* Auth Header */}
          <div className="flex flex-col items-center bg-primary px-6 pb-8 pt-12">
            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/15">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary-foreground"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary-foreground/60"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary-foreground/80"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-primary-foreground">
              ServiceHub
            </h2>
            <p className="mt-1 text-sm text-primary-foreground/60">
              Your one-stop service platform
            </p>
          </div>

          {/* Auth Body */}
          <div className="-mt-4 flex-1 rounded-t-3xl bg-background px-6 pt-8">
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
      </div>
    );
  }

  // Logged in - show home based on role
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col shadow-xl">
        <MobileHeader onMenuOpen={() => setMenuOpen(true)} />

        <SidebarMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

        <main className="flex-1 overflow-y-auto">
          {user.role === "admin" ? (
            <>
              <SearchBar />
              <AdminHomeContent />
            </>
          ) : user.role === "employee" ? (
            <>
              <SearchBar />
              <EmployeeHomeContent />
            </>
          ) : (
            <>
              <SearchBar />
              <OffersCarousel />
              <div className="pt-4">
                <CategoriesSection />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
