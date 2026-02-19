"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useData } from "@/lib/data-context";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  Star,
  TrendingUp,
  Calendar,
  MapPin,
  Bell,
  Plus,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function EmployeeHomeContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { bookings, services } = useData();

  // Stats
  const providerBookings = bookings.filter(b => b.providerId === user?.id);
  const providerServices = services.filter(s => s.providerId === user?.id);
  const completedJobs = providerBookings.filter(b => b.status === "Completed").length;
  const pendingJobs = providerBookings.filter(b => b.status === "Pending").length;

  const handleAddService = () => {
    router.push("/provider/add-service");
  };

  const handleStatusUpdate = (jobId: string) => {
    toast.success(`Opening details for job ${jobId}`);
  };

  return (
    <div className="flex flex-col gap-5 px-4 py-4 pb-8">
      {/* Welcome */}
      <div className="rounded-2xl bg-primary p-5 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-sm text-primary-foreground/70">Welcome back,</p>
          <h2 className="text-xl font-bold text-primary-foreground">{user?.name}</h2>
          <p className="mt-1 text-xs text-primary-foreground/60">Provider ID: {user?.employeeId}</p>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <User size={120} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button
          onClick={handleAddService}
          className="flex-1 rounded-2xl h-14 bg-accent hover:bg-accent/90 text-accent-foreground font-bold shadow-sm"
        >
          <Plus className="mr-2 h-5 w-5" /> Add Service
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card p-4 shadow-sm border border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10">
              <ClipboardList size={18} className="text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">My Services</p>
              <p className="text-lg font-bold text-foreground">{providerServices.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-sm border border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0fff4]">
              <CheckCircle2 size={18} className="text-[#38a169]" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Completed</p>
              <p className="text-lg font-bold text-foreground">{completedJobs}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-sm border border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fefcbf]">
              <Star size={18} className="text-[#d69e2e]" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Rating</p>
              <p className="text-lg font-bold text-foreground">5.0</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-card p-4 shadow-sm border border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ebf4ff]">
              <TrendingUp size={18} className="text-[#3182ce]" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-lg font-bold text-foreground">{pendingJobs}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Jobs */}
      <div>
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-base font-bold text-foreground">{"Manage Bookings"}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar size={14} />
            <span>Today</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {providerBookings.length > 0 ? (
            providerBookings.map((job) => (
              <div
                key={job.id}
                onClick={() => handleStatusUpdate(job.id)}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm cursor-pointer active:scale-95 transition-transform"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{job.id}</span>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${job.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : job.status === "Accepted"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="mt-1 font-semibold text-foreground">{job.customerName}</p>
                    <p className="text-sm text-muted-foreground">{job.serviceTitle}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={12} />
                      {job.time}
                    </div>
                    <p className="mt-1 text-sm font-bold text-primary">₹{job.amount}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar size={12} />
                  {job.date}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 rounded-2xl border border-dashed border-border bg-secondary/20">
              <ClipboardList size={40} className="text-muted-foreground/30" />
              <p className="mt-2 text-sm text-muted-foreground font-medium">No bookings yet</p>
              <p className="text-xs text-muted-foreground/60 text-center px-4 mt-1">
                Your assigned bookings will appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-2 pb-3">
          <Bell size={16} className="text-accent" />
          <h3 className="text-sm font-bold text-foreground">Updates</h3>
        </div>
        <div className="flex flex-col gap-2">
          {providerBookings.length > 0 ? (
            <p className="text-xs text-muted-foreground">You have {pendingJobs} pending booking requests.</p>
          ) : (
            <p className="text-xs text-muted-foreground">Welcome to ServiceHub! Complete your profile to get more jobs.</p>
          )}
        </div>
      </div>
    </div>
  );
}
