"use client";

import { useState } from "react";
import { useAuth, type UserRole } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User as UserIcon, Phone, UserPlus } from "lucide-react";

interface RegisterFormProps {
  onSwitch: () => void;
  onOtpRequired: (role: UserRole, userData: { name: string; mobile: string; }) => void;
}

export function RegisterForm({ onSwitch, onOtpRequired }: RegisterFormProps) {
  const { users } = useAuth();
  const [role, setRole] = useState<UserRole>("customer");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const handleRegister = () => {
    setError("");
    if (!name || !mobile) {
      setError("Please fill in all fields");
      return;
    }
    if (mobile.length < 10) {
      setError("Please enter a valid mobile number");
      return;
    }

    // Check if mobile already exists
    const exists = users.find((u) => u.mobile === mobile);
    if (exists) {
      setError("Mobile number already registered");
      return;
    }

    onOtpRequired(role, { name, mobile });
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-foreground tracking-tight">Create Account</h1>
        <p className="text-sm text-muted-foreground font-medium">
          Join our platform and start exploring services near you.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-destructive/5 border border-destructive/10 px-4 py-3 text-xs font-bold text-destructive animate-slide-up">
          {error}
        </div>
      )}

      {/* Role Selector */}
      <div className="flex flex-col gap-3">
        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
          I want to join as
        </Label>
        <div className="flex p-1.5 bg-muted/50 rounded-2xl border border-border shadow-inner">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`flex-1 py-3 text-xs font-black rounded-xl transition-all duration-300 uppercase tracking-widest ${role === "customer"
              ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole("employee")}
            className={`flex-1 py-3 text-xs font-black rounded-xl transition-all duration-300 uppercase tracking-widest ${role === "employee"
              ? "bg-primary text-primary-foreground shadow-lg scale-[1.02]"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Employee
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
            Full Name
          </Label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <UserIcon size={18} />
            </div>
            <Input
              id="name"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-14 pl-12 rounded-2xl border-border bg-card text-foreground font-bold shadow-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="mobile" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
            Mobile Number
          </Label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <Phone size={18} />
            </div>
            <Input
              id="mobile"
              type="tel"
              placeholder="10-digit number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="h-14 pl-12 rounded-2xl border-border bg-card text-foreground font-bold shadow-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        <Button
          onClick={handleRegister}
          className="h-14 mt-2 rounded-2xl bg-primary text-primary-foreground text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98]"
        >
          <UserPlus size={18} className="mr-2" />
          Continue to Verify
        </Button>
      </div>

      <div className="flex flex-col items-center gap-4 mt-2">
        <p className="text-sm text-muted-foreground font-medium">
          Already have an account?
        </p>
        <button
          type="button"
          onClick={onSwitch}
          className="w-full h-14 rounded-2xl border-2 border-primary/20 bg-primary/5 text-primary text-sm font-black uppercase tracking-widest hover:bg-primary/10 transition-all active:scale-[0.98]"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
