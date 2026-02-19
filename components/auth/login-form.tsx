"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, ArrowRight } from "lucide-react";
import { OtpVerification } from "./otp-verification";

interface LoginFormProps {
  onSwitch: () => void;
  onSuccess: () => void;
}

export function LoginForm({ onSwitch, onSuccess }: LoginFormProps) {
  const { checkUserExists } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [isOtpStep, setIsOtpStep] = useState(false);

  const handleSendOtp = () => {
    setError("");
    if (!identifier) {
      setError("Please enter your mobile number");
      return;
    }
    if (identifier.length < 10) {
      setError("Please enter a valid mobile number");
      return;
    }

    // Check if user exists (for Customer/Employee)
    // Admin login might still need password? 
    // Let's assume for now we use OTP for everyone as requested.
    if (!checkUserExists(identifier)) {
      setError("User not found. Please register first.");
      return;
    }

    setIsOtpStep(true);
  };

  if (isOtpStep) {
    return (
      <OtpVerification
        mode="login"
        mobile={identifier}
        onSuccess={onSuccess}
        onBack={() => setIsOtpStep(false)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in with your mobile number
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="identifier" className="text-foreground">
            Mobile Number / Employee ID
          </Label>
          <Input
            id="identifier"
            placeholder="Enter mobile or employee ID"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value.replace(/\D/g, "").slice(0, 10))}
            className="h-12 rounded-xl border-border bg-card text-foreground"
            onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
          />
        </div>
      </div>

      <Button
        onClick={handleSendOtp}
        className="h-12 rounded-xl bg-primary text-primary-foreground text-base font-semibold"
      >
        Get OTP
        <ArrowRight size={18} className="ml-2" />
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {"Don't have an account? "}
        <button
          type="button"
          onClick={onSwitch}
          className="font-semibold text-accent"
        >
          Register
        </button>
      </p>

      {/* Admin Quick Login Hint - Optional, maybe remove or keep as info */}
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="mb-2 text-xs font-semibold text-muted-foreground">
          Demo Credentials
        </p>
        <p className="text-xs text-muted-foreground">
          Admin Mobile: <span className="font-mono text-foreground">9999999999</span>
        </p>
      </div>
    </div>
  );
}
