"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Eye, EyeOff } from "lucide-react";

interface ChangePasswordModalProps {
  onClose: () => void;
}

export function ChangePasswordModal({ onClose }: ChangePasswordModalProps) {
  const { user, changePassword } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    setError("");
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!user) return;
    const result = changePassword(user.id, oldPassword, newPassword);
    if (result.success) {
      setSuccess(true);
      setTimeout(onClose, 1500);
    } else {
      setError(result.error || "Failed to change password");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Change Password</h2>
          <button type="button" onClick={onClose} className="text-muted-foreground" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="rounded-xl bg-accent/10 p-4 text-center">
            <p className="font-semibold text-accent">Password changed successfully!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {error && (
              <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Current Password</Label>
              <div className="relative">
                <Input
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="h-11 rounded-xl border-border bg-background pr-10 text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label={showOld ? "Hide" : "Show"}
                >
                  {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-foreground">New Password</Label>
              <div className="relative">
                <Input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-11 rounded-xl border-border bg-background pr-10 text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label={showNew ? "Hide" : "Show"}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-foreground">Confirm New Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11 rounded-xl border-border bg-background text-foreground"
              />
            </div>

            <Button
              onClick={handleSubmit}
              className="h-11 rounded-xl bg-primary text-primary-foreground font-semibold"
            >
              Update Password
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
