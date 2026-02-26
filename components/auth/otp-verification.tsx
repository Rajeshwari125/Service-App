"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

interface OtpVerificationProps {
  mobile: string;
  onSuccess: () => void;
  onBack: () => void;
  mode: "register" | "login";
  onRegisterDetails?: any; // To pass registration details if mode is register
}

export function OtpVerification({
  mobile,
  onSuccess,
  onBack,
  mode,
  onRegisterDetails
}: OtpVerificationProps) {
  const { register, loginWithMobile, verifyOtp, getOtp } = useAuth();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Generate OTP on mount
    const newOtp = getOtp(mobile);
    setGeneratedOtp(newOtp);
  }, [getOtp, mobile]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    setError("");
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      setError("Please enter the complete OTP");
      return;
    }

    // Verify OTP locally
    if (verifyOtp(enteredOtp)) {
      if (mode === "register" && onRegisterDetails) {
        const result = await register(onRegisterDetails);
        if (result.success) {
          onSuccess();
        } else {
          setError(result.error || "Registration failed");
        }
      } else if (mode === "login") {
        const result = await loginWithMobile(mobile);
        if (result.success) {
          onSuccess();
        } else {
          setError(result.error || "Login failed");
        }
      }
    } else {
      setError("Invalid OTP. Please try again.");
    }
  };

  const handleResend = () => {
    const newOtp = getOtp(mobile);
    setGeneratedOtp(newOtp);
    setTimer(30);
    setOtp(["", "", "", ""]);
    setError("");
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="text-center flex flex-col items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-accent/5 border border-accent/10 shadow-inner">
          <ShieldCheck size={40} className="text-accent animate-pulse" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black text-foreground tracking-tight">Security Code</h1>
          <p className="text-sm text-muted-foreground font-medium max-w-[240px] leading-relaxed">
            We sent a verification code to your device ending in <span className="font-black text-foreground">{mobile.slice(-4)}</span>
          </p>
        </div>
      </div>

      {/* OTP Display for Demo */}
      <div className="rounded-3xl border border-accent/20 bg-accent/5 p-4 text-center shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-widest text-accent/60 mb-1">Developer Sandbox OTP</p>
        <p className="text-3xl font-black tracking-[0.4em] text-accent pl-[0.4em]">
          {generatedOtp}
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-destructive/5 border border-destructive/10 px-4 py-3 text-xs font-bold text-destructive animate-slide-up text-center">
          {error}
        </div>
      )}

      <div className="flex justify-center gap-4">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) =>
              handleChange(i, e.target.value.replace(/\D/g, ""))
            }
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="h-16 w-14 rounded-2xl border-2 border-border bg-card text-center text-2xl font-black text-foreground outline-none transition-all focus:border-accent focus:ring-4 focus:ring-accent/10 shadow-sm"
            aria-label={`OTP digit ${i + 1}`}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4 mt-2">
        <Button
          onClick={handleVerify}
          className="h-16 rounded-2xl bg-primary text-primary-foreground text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98]"
        >
          {mode === "register" ? "Confirm & Finalize" : "Secure Login"}
        </Button>

        <div className="flex flex-col items-center gap-4">
          {timer > 0 ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full border border-border/50">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">Resend available in</span>
              <span className="text-xs font-black text-foreground">{timer}s</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-xs font-black text-accent uppercase tracking-widest hover:underline active:scale-95 transition-all"
            >
              Resend New Code
            </button>
          )}

          <button
            type="button"
            onClick={onBack}
            className="text-xs font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all"
          >
            ← Incorrect Number
          </button>
        </div>
      </div>
    </div>
  );
}
