"use client";

import { useState } from "react";
import { useAuth, type UserRole } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, UserPlus } from "lucide-react";

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
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Register with your mobile number
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setRole("customer")}
          className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-all ${role === "customer"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
            }`}
        >
          Customer
        </button>
        <button
          type="button"
          onClick={() => setRole("employee")}
          className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-all ${role === "employee"
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
            }`}
        >
          Employee
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name" className="text-foreground">
            Full Name
          </Label>
          <Input
            id="name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 rounded-xl border-border bg-card text-foreground"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="mobile" className="text-foreground">
            Mobile Number
          </Label>
          <Input
            id="mobile"
            type="tel"
            placeholder="Enter 10-digit mobile number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
            className="h-12 rounded-xl border-border bg-card text-foreground"
          />
        </div>
      </div>

      <Button
        onClick={handleRegister}
        className="h-12 rounded-xl bg-primary text-primary-foreground text-base font-semibold"
      >
        <UserPlus size={18} className="mr-2" />
        Continue
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-accent"
        >
          Sign In
        </button>
      </p>
    </div>
  );
}
