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

  const handleVerify = () => {
    setError("");
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      setError("Please enter the complete OTP");
      return;
    }

    // Verify OTP locally
    if (verifyOtp(enteredOtp)) {
      if (mode === "register" && onRegisterDetails) {
        const result = register(onRegisterDetails);
        if (result.success) {
          onSuccess();
        } else {
          setError(result.error || "Registration failed");
        }
      } else if (mode === "login") {
        const result = loginWithMobile(mobile);
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
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <ShieldCheck size={32} className="text-accent" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Verify OTP</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We sent a verification code to
        </p>
        <p className="text-sm font-semibold text-foreground">
          +91 {mobile}
        </p>
      </div>

      {/* OTP Display for Demo */}
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-3 text-center">
        <p className="text-xs text-muted-foreground">Demo OTP Code</p>
        <p className="text-2xl font-bold tracking-[0.5em] text-accent">
          {generatedOtp}
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex justify-center gap-3">
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
            className="h-14 w-14 rounded-xl border-2 border-border bg-card text-center text-xl font-bold text-foreground outline-none transition-colors focus:border-accent"
            aria-label={`OTP digit ${i + 1}`}
          />
        ))}
      </div>

      <Button
        onClick={handleVerify}
        className="h-12 rounded-xl bg-primary text-primary-foreground text-base font-semibold"
      >
        {mode === "register" ? "Verify & Create Account" : "Verify & Login"}
      </Button>

      <div className="text-center">
        {timer > 0 ? (
          <p className="text-sm text-muted-foreground">
            Resend code in{" "}
            <span className="font-semibold text-foreground">{timer}s</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-sm font-semibold text-accent"
          >
            Resend OTP
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="text-sm text-muted-foreground"
      >
        {mode === "register" ? "Back to registration" : "Back to login"}
      </button>
    </div>
  );
}
