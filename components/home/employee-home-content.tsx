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
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function EmployeeHomeContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { bookings, services, rentals } = useData();

  // Stats
  const providerBookings = bookings.filter(b => b.providerId === user?.id);
  const providerServices = services.filter(s => s.providerId === user?.id);
  const providerRentals = rentals.filter(r => r.id.startsWith('rnt')); // Assuming basic filter for now

  const completedJobs = providerBookings.filter(b => b.status === "Completed").length;
  const pendingJobs = providerBookings.filter(b => b.status === "Pending").length;

  const handleAddService = () => {
    router.push("/provider/add-service");
  };

  const handleAddRental = () => {
    toast.success("Rental listing feature coming soon!");
  };

  const handleStatusUpdate = (jobId: string) => {
    toast.success(`Opening details for job ${jobId}`);
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-5 pb-12 animate-fade-in">
      {/* Employee Professional Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-accent p-6 text-accent-foreground shadow-2xl shadow-accent/20">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/20">
              <User size={28} className="text-accent-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-black text-accent-foreground/60 uppercase tracking-widest">Job Partner</p>
              <h2 className="text-xl font-black tracking-tight">{user?.name}</h2>
              <p className="text-[10px] font-bold text-accent-foreground/40 mt-0.5 tracking-tighter">ID: {user?.employeeId}</p>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-foreground/10">
            <Bell size={20} className="text-accent-foreground" />
          </div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Action Hub */}
      <div className="flex gap-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <Button
          onClick={handleAddService}
          className="flex-1 h-14 rounded-2xl bg-white border border-slate-100 text-slate-900 font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4 text-accent" /> New Service
        </Button>
        <Button
          onClick={handleAddRental}
          className="flex-1 h-14 rounded-2xl bg-white border border-slate-100 text-slate-900 font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <Package className="mr-2 h-4 w-4 text-emerald-500" /> List Rental
        </Button>
      </div>

      {/* Business Metrics */}
      <div className="grid grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 flex flex-col gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100/50">
            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Completed Jobs</p>
            <p className="text-2xl font-black text-slate-900">{completedJobs}</p>
          </div>
        </div>

        <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 flex flex-col gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100/50">
            <Package size={18} className="text-blue-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Active Assets</p>
            <p className="text-2xl font-black text-slate-900">{providerRentals.length}</p>
          </div>
        </div>
      </div>

      {/* Job Management */}
      <div className="flex flex-col gap-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Active Engagements</h3>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Status: Online</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {providerBookings.length > 0 ? (
            providerBookings.map((job, idx) => (
              <div
                key={job.id}
                onClick={() => handleStatusUpdate(job.id)}
                className="group relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all active:scale-95 animate-slide-up"
                style={{ animationDelay: `${idx * 100 + 500}ms` }}
              >
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center">
                        <User size={14} className="text-slate-400" />
                      </div>
                      <p className="text-sm font-black text-slate-900 leading-none">{job.customerName}</p>
                    </div>
                    <span className={`rounded-xl px-2.5 py-1 text-[9px] font-black uppercase tracking-widest shadow-sm ${job.status === "Completed" ? "bg-emerald-50 text-emerald-600" :
                        job.status === "Accepted" ? "bg-blue-50 text-blue-600" :
                          "bg-amber-50 text-amber-600"
                      }`}>
                      {job.status}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 px-1">
                    <p className="text-xs font-bold text-slate-600 leading-tight">{job.serviceTitle}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                        <Clock size={12} /> {job.time}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                        <Calendar size={12} /> {job.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-1">
                    <div className="flex items-center gap-1 text-[10px] font-black text-primary">
                      <MapPin size={12} /> Track Location
                    </div>
                    <p className="text-sm font-black text-slate-900">₹{job.amount}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center rounded-[2.5rem] border-2 border-dashed border-slate-100 bg-slate-50/50 p-12">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="h-16 w-16 bg-white rounded-3xl shadow-sm flex items-center justify-center opacity-40">
                  <ClipboardList size={32} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Station Empty</p>
                  <p className="text-[10px] text-slate-300 font-bold mt-1">No incoming bookings at the moment</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
