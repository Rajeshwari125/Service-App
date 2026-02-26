"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, ArrowRight, Shield } from "lucide-react";
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

  const handleSendOtp = async () => {
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
    const exists = await checkUserExists(identifier);
    if (!exists) {
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
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-foreground tracking-tight">Welcome Back</h1>
        <p className="text-sm text-muted-foreground font-medium">
          Sign in to your account with your registered mobile number.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-destructive/5 border border-destructive/10 px-4 py-3 text-xs font-bold text-destructive animate-slide-up">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <Label htmlFor="identifier" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
            Mobile Number
          </Label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <LogIn size={18} />
            </div>
            <Input
              id="identifier"
              placeholder="e.g. 99999 00000"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className="h-14 pl-12 rounded-2xl border-border bg-card text-foreground font-bold shadow-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
              onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
            />
          </div>
        </div>

        <Button
          onClick={handleSendOtp}
          className="h-14 rounded-2xl bg-primary text-primary-foreground text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98]"
        >
          Send Login OTP
          <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-4 font-bold text-muted-foreground tracking-widest">or</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-muted-foreground font-medium">
          New to ServiceHub?
        </p>
        <button
          type="button"
          onClick={onSwitch}
          className="w-full h-14 rounded-2xl border-2 border-primary/20 bg-primary/5 text-primary text-sm font-black uppercase tracking-widest hover:bg-primary/10 transition-all active:scale-[0.98]"
        >
          Create New Account
        </button>
      </div>

      <div className="mt-4 rounded-2xl bg-muted/50 p-4 border border-border/50">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={14} className="text-primary" />
          <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
            Professional Access
          </p>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Admin accounts use mobile number <span className="font-black text-foreground">9999999999</span> for instant dashboard access.
        </p>
      </div>
    </div>
  );
}
