import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Sparkles, Loader2, CalendarDays, Plus, Minus, MapPin } from "lucide-react";
import {
  BookingFormData, initialFormData, EVENT_CATEGORIES, SUB_CATEGORIES,
  SERVICES_ADDONS, SURPRISE_ADDONS, EventCategory, SubEventDetail,
} from "@/lib/eventData";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const inputClass = "w-full px-4 py-3 rounded-lg border border-gold/20 bg-noir/50 text-ivory font-body placeholder:text-ivory/30 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all";
const smallInputClass = "w-full px-3 py-2 rounded-lg border border-gold/20 bg-noir/50 text-ivory font-body text-sm placeholder:text-ivory/30 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all";

const formatPKR = (n: number) => `PKR ${n.toLocaleString()}`;

const BookingForm = () => {
  const [searchParams] = useSearchParams();
  const preselectedCategory = searchParams.get("category") as EventCategory | null;
  const preselectedPackage = searchParams.get("package") || searchParams.get("service");
  
  const { user } = useAuth();
  
  // Dynamic steps based on auth
  const STEPS = user 
    ? ["Event Selection", "Event Details", "Review & Submit"] 
    : ["Basic Info", "Event Selection", "Event Details", "Review & Submit"];
    
  const getStepIndex = (stepName: string) => STEPS.indexOf(stepName);

  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    ...initialFormData,
    category: preselectedCategory || "",
    selectedPackage: preselectedPackage || "",
    locationText: "", // Simple text input for location
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Auto-fill user details if logged in
  useEffect(() => {
    if (user && !data.name) {
      setData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  // Sync subEvents when subCategories change
  useEffect(() => {
    setData((prev) => {
      const newSubEvents = prev.subCategories.map((name) => {
        const existing = prev.subEvents.find((e) => e.name === name);
        return existing || { name, date: "", guests: 100, budget: 200000, theme: "", flowers: [] };
      });
      return { ...prev, subEvents: newSubEvents };
    });
  }, [data.subCategories.join(",")]);

  const update = (field: string, value: any) => setData((p) => ({ ...p, [field]: value }));

  const toggleArray = (field: "services" | "subCategories" | "surpriseAddons", val: string) =>
    setData((p) => ({
      ...p,
      [field]: (p[field] as string[]).includes(val)
        ? (p[field] as string[]).filter((x) => x !== val)
        : [...(p[field] as string[]), val],
    }));

  const updateSubEvent = (index: number, field: keyof SubEventDetail, value: any) => {
    setData((prev) => {
      const updated = [...prev.subEvents];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, subEvents: updated };
    });
  };

  const totalBudget = data.subEvents.reduce((sum, e) => sum + e.budget, 0);
  const totalGuests = Math.max(...data.subEvents.map((e) => e.guests), 0);

  const currentStepName = STEPS[step];

  const canNext = () => {
    if (currentStepName === "Basic Info") return data.name && data.email && data.phone;
    if (currentStepName === "Event Selection") return data.category && data.subCategories.length > 0;
    if (currentStepName === "Event Details") return data.subEvents.every((e) => e.date && e.guests > 0 && e.budget > 0) && data.locationText;
    return true;
  };

  const handleSubmit = async () => {
    if (!user && currentStepName === "Basic Info") {
      // Just moving to next step if not logged in
      setStep(s => s + 1);
      return;
    }
    
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
      return;
    }

    setSubmitting(true);
    try {
      const primaryEvent = data.subEvents[0];
      const { error } = await supabase.from("bookings").insert({
        user_id: user?.id || null, // Allow anonymous or handled elsewhere if strict
        full_name: data.name,
        email: data.email,
        phone: data.phone,
        sub_categories: data.subCategories,
        event_date: primaryEvent?.date || new Date().toISOString(),
        guests: totalGuests,
        budget_pkr: totalBudget,
        location: data.locationText,
        services: [...data.services, ...data.surpriseAddons, data.selectedPackage].filter(Boolean),
        notes: `Multi-event details: ${data.subEvents.map(e => `${e.name}: ${e.date}, ${e.guests} guests, ${formatPKR(e.budget)}`).join(" | ")}`,
        status: "pending",
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Booking submitted successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
        <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles className="text-gold" size={36} />
        </div>
        <h2 className="font-heading text-3xl text-gold mb-3 text-shadow-gold">Booking Request Submitted!</h2>
        <p className="text-ivory/60 max-w-md mx-auto mb-8 font-body">
          Thank you, {data.name}! Your event booking is currently <strong className="text-amber-400 font-semibold">Pending Review</strong>. 
          Our administration team will review your requirements and formally accept or reject the booking within 24 hours.
        </p>
        <div className="flex justify-center gap-4">
          <a href="/" className="btn-luxury-outline text-sm">Return Home</a>
          {user && <a href="/dashboard" className="btn-luxury text-sm">View in Dashboard</a>}
        </div>
      </motion.div>
    );
  }

  const renderStep = () => {
    switch (currentStepName) {
      case "Basic Info": return (
        <div className="space-y-5">
          <h3 className="font-heading text-2xl text-gold mb-2 drop-shadow-md">Your Information</h3>
          <p className="text-sm text-ivory/50 mb-6 font-body">Please provide your contact details to begin</p>
          {[
            { key: "name", label: "Full Name", type: "text", placeholder: "Your Name" },
            { key: "email", label: "Email", type: "email", placeholder: "you@example.com" },
            { key: "phone", label: "Phone Number", type: "text", placeholder: "+92 300 123 4567" },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-sm font-body text-ivory/80 mb-1 block">{f.label}</label>
              <input
                type={f.type}
                value={(data as any)[f.key]}
                onChange={(e) => update(f.key, e.target.value)}
                className={inputClass}
                placeholder={f.placeholder}
              />
            </div>
          ))}
        </div>
      );
      case "Event Selection": return (
        <div className="space-y-8">
          <div>
            <h3 className="font-heading text-2xl text-gold mb-4 drop-shadow-md">Select Event Category</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EVENT_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => { update("category", cat.value); update("subCategories", []); }}
                  className={`p-4 rounded-xl border-2 text-left transition-all font-body ${
                    data.category === cat.value
                      ? "border-gold bg-gold/10 text-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                      : "border-gold/20 text-ivory/70 hover:border-gold/50 bg-[#0a0a0a]"
                  }`}
                >
                  <span className="font-semibold">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {data.category && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="font-heading text-xl text-gold mb-3">Sub-Categories</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SUB_CATEGORIES[data.category as EventCategory].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => toggleArray("subCategories", sub)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-body transition-all ${
                      data.subCategories.includes(sub)
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-gold/20 text-ivory/60 hover:border-gold/50 bg-[#0a0a0a]"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      data.subCategories.includes(sub) ? "border-gold bg-gold" : "border-ivory/30"
                    }`}>
                      {data.subCategories.includes(sub) && <Check size={10} className="text-black" />}
                    </div>
                    {sub}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {data.selectedPackage && (
            <div className="p-4 rounded-xl border border-gold/30 bg-gold/5 flex items-center gap-3">
              <Sparkles className="text-gold" />
              <div>
                <p className="text-xs text-ivory/60 uppercase tracking-widest">Selected Package</p>
                <p className="text-gold font-heading">{data.selectedPackage}</p>
              </div>
            </div>
          )}
        </div>
      );
      case "Event Details": return (
        <div className="space-y-6">
          <h3 className="font-heading text-2xl text-gold mb-2 drop-shadow-md">Date, Guests & Budget</h3>
          
          <div className="p-5 rounded-xl border-2 border-gold/20 bg-[#0a0a0a] mb-6">
            <h4 className="font-heading text-lg text-gold mb-3 flex items-center gap-2">
              <MapPin size={18} /> Venue Location
            </h4>
            <input 
              type="text" 
              placeholder="E.g., PC Hotel Karachi, DHA Club, or Custom Address..."
              value={data.locationText}
              onChange={(e) => update("locationText", e.target.value)}
              className={inputClass}
            />
          </div>

          {data.subEvents.map((evt, i) => (
            <motion.div
              key={evt.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border-2 border-gold/20 rounded-xl p-5 space-y-4 bg-[#0a0a0a]"
            >
              <h4 className="font-heading text-lg text-gold">{evt.name}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-ivory/50 mb-1 block">Event Date</label>
                  <input type="date" value={evt.date} onChange={(e) => updateSubEvent(i, "date", e.target.value)} className={smallInputClass} />
                </div>
                <div>
                  <label className="text-xs text-ivory/50 mb-1 block">Expected Guests</label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateSubEvent(i, "guests", Math.max(10, evt.guests - 10))} className="w-8 h-8 rounded-lg border border-gold/20 flex items-center justify-center text-ivory/60 hover:border-gold/50 bg-black">
                      <Minus size={14} />
                    </button>
                    <input type="number" min={10} max={2000} value={evt.guests} onChange={(e) => updateSubEvent(i, "guests", +e.target.value || 10)} className={smallInputClass + " text-center min-w-[70px]"} />
                    <button onClick={() => updateSubEvent(i, "guests", Math.min(2000, evt.guests + 10))} className="w-8 h-8 rounded-lg border border-gold/20 flex items-center justify-center text-ivory/60 hover:border-gold/50 bg-black">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-ivory/50 mb-1 block">Budget (PKR)</label>
                  <input type="number" min={50000} step={10000} value={evt.budget} onChange={(e) => updateSubEvent(i, "budget", +e.target.value || 50000)} className={smallInputClass} />
                </div>
              </div>
            </motion.div>
          ))}
          
          {data.subEvents.length > 0 && (
            <div className="bg-[#111] border border-gold/10 rounded-xl p-4 text-center shadow-lg">
              <p className="text-ivory/50 text-sm font-body">Total Estimated Budget: <span className="text-gold font-semibold tracking-wider">{formatPKR(totalBudget)}</span></p>
            </div>
          )}
        </div>
      );
      case "Review & Submit": return (
        <div>
          <h3 className="font-heading text-2xl text-gold mb-6 drop-shadow-md">Review Your Booking</h3>
          <div className="space-y-3 text-sm font-body bg-[#0a0a0a] p-6 rounded-2xl border border-gold/20 shadow-[0_0_20px_rgba(212,175,55,0.05)]">
            {[
              ["Name", data.name],
              ["Email", data.email],
              ["Phone", data.phone],
              ["Category", EVENT_CATEGORIES.find((c) => c.value === data.category)?.label || ""],
              ["Target Location", data.locationText || "Not specified"],
              ["Base Package", data.selectedPackage || "Custom Approach"],
              ["Combined Budget", formatPKR(totalBudget)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-3 border-b border-gold/10 last:border-0">
                <span className="text-ivory/50">{label}</span>
                <span className="font-medium text-ivory text-right max-w-[60%]">{value}</span>
              </div>
            ))}
            {data.subEvents.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gold/20 space-y-3">
                <p className="text-gold text-xs tracking-widest uppercase">Event Breakdown:</p>
                {data.subEvents.map((evt) => (
                  <div key={evt.name} className="bg-[#111] rounded-lg p-3 text-xs border border-gold/5 flex flex-col gap-1">
                    <span className="text-gold font-semibold">{evt.name}</span>
                    <span className="text-ivory/60">Date: {evt.date || "TBD"} | {evt.guests} Guests | Budget: {formatPKR(evt.budget)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-10">
        <div className="flex justify-between text-xs text-gold/70 mb-3 font-heading uppercase tracking-widest">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{currentStepName}</span>
        </div>
        <div className="w-full h-1 bg-[#111] rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gold rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]" 
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }} 
            transition={{ duration: 0.3 }} 
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="min-h-[400px]">
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8 pt-6 border-t border-gold/10">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gold/20 text-ivory/60 hover:text-gold hover:border-gold/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed font-body bg-black/50"
        >
          <ChevronLeft size={16} /> Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext()}
            className="btn-luxury flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed px-8 py-3"
          >
            Next Step <ChevronRight size={16} />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={submitting || !canNext()} className="btn-luxury flex items-center gap-2 disabled:opacity-50 px-8 py-3">
            {submitting ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
            Confirm Booking
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
