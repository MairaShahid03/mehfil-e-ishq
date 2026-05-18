import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar, FileText, MessageCircle, Clock, CheckCircle,
  XCircle, AlertCircle, ChevronRight, Loader2, LogOut, Star
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { FLOWERS } from "@/lib/eventData";
import { addReview } from "@/lib/reviewsStore";

type BookingStatus = "pending" | "approved" | "rejected" | "completed";

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  pending_client: { icon: AlertCircle, color: "text-amber-400 bg-amber-500/10", label: "Pending Your Approval" },
  pending_admin: { icon: Clock, color: "text-blue-400 bg-blue-500/10", label: "Pending Admin" },
  accepted: { icon: CheckCircle, color: "text-emerald-400 bg-emerald-500/10", label: "Accepted" },
  rejected: { icon: XCircle, color: "text-red-400 bg-red-500/10", label: "Rejected" },
  completed: { icon: CheckCircle, color: "text-blue-400 bg-blue-500/10", label: "Completed" },
  pending: { icon: AlertCircle, color: "text-amber-400 bg-amber-500/10", label: "Pending" },
};

const ClientDashboard = () => {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"bookings" | "meetings" | "review">("bookings");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [meetingFormOpen, setMeetingFormOpen] = useState(false);
  const [meetingForm, setMeetingForm] = useState({ date: "", time: "", location: "Online / Google Meet", notes: "" });
  
  // Reschedule state
  const [rescheduleMeetingId, setRescheduleMeetingId] = useState<string | null>(null);
  const [rescheduleForm, setRescheduleForm] = useState({ date: "", time: "", notes: "" });

  // Client Review state
  const [reviewForm, setReviewForm] = useState({
    name: "",
    event: "Wedding Ceremony",
    text: "",
    textUrdu: "",
    rating: 5
  });

  useEffect(() => {
    if (profile) {
      setReviewForm(p => ({ ...p, name: profile.full_name || "" }));
    }
  }, [profile]);

  const handleReviewSubmit = () => {
    if (!reviewForm.name || !reviewForm.text) {
      toast.error("Please fill in your name and review text");
      return;
    }
    addReview({
      name: reviewForm.name,
      event: reviewForm.event,
      text: reviewForm.text,
      textUrdu: reviewForm.textUrdu || undefined,
      rating: reviewForm.rating,
      role: "Client"
    });
    toast.success("Review submitted! Admin approval is required before it appears on the Features page.");
    setReviewForm({
      name: profile?.full_name || "",
      event: "Wedding Ceremony",
      text: "",
      textUrdu: "",
      rating: 5
    });
  };

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const [bookingsRes, meetingsRes] = await Promise.all([
      supabase.from("bookings").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
      supabase.from("meetings").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
    ]);
    setBookings(bookingsRes.data || []);
    setMeetings(meetingsRes.data || []);
    setLoading(false);
  };

  const respondToMeeting = async (meetingId: string, response: string, reason?: string) => {
    const { error } = await supabase.from("meetings").update({
      status: response,
      user_response: response,
      rejection_reason: reason || null,
    }).eq("id", meetingId);
    if (error) toast.error(error.message);
    else { toast.success(`Meeting ${response}`); fetchData(); }
  };

  const submitReschedule = async (meetingId: string) => {
    if (!rescheduleForm.date || !rescheduleForm.time) {
      toast.error("Please select a date and time");
      return;
    }
    const meetingDateTime = `${rescheduleForm.date}T${rescheduleForm.time}`;
    
    // For client rescheduling, we set status to pending_admin
    const { error } = await supabase.from("meetings").update({
      meeting_date: meetingDateTime,
      rejection_reason: rescheduleForm.notes ? `Reschedule Note: ${rescheduleForm.notes}` : null,
      status: "pending_admin",
      user_response: "rescheduled"
    }).eq("id", meetingId);
    
    if (error) toast.error(error.message);
    else {
      toast.success("Reschedule request sent");
      setRescheduleMeetingId(null);
      setRescheduleForm({ date: "", time: "", notes: "" });
      fetchData();
    }
  };

  const submitMeetingRequest = async () => {
    if (!meetingForm.date || !meetingForm.time) {
      toast.error("Please select date and time");
      return;
    }
    
    // Combine date and time to ISO string or keep simple string
    const meetingDateTime = `${meetingForm.date}T${meetingForm.time}`;
    
    const { error } = await supabase.from("meetings").insert({
      booking_id: selectedBooking.id,
      user_id: user!.id,
      meeting_date: meetingDateTime,
      meeting_location: meetingForm.location,
      admin_note: `Client Requested: ${meetingForm.notes}`,
      status: "pending_admin",
      user_response: "accepted" // client already accepts it
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Meeting requested successfully!");
      setMeetingFormOpen(false);
      setMeetingForm({ date: "", time: "", location: "Online / Google Meet", notes: "" });
      fetchData();
      setActiveTab("meetings");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-noir flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-noir">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-3xl text-ivory font-bold">Welcome, {profile?.full_name || "Client"}</h1>
              <p className="text-ivory/40 mt-1">Manage your events and bookings</p>
            </div>
            <button onClick={async () => { await signOut(); navigate("/login"); }} className="flex items-center gap-2 text-ivory/40 hover:text-red-400 transition-colors text-sm">
              <LogOut size={16} /> Sign Out
            </button>
          </div>

          <div className="flex gap-2 mb-8 border-b border-gold/10">
            {[
              { key: "bookings", label: "My Bookings", icon: FileText },
              { key: "meetings", label: "Meetings", icon: Calendar },
              { key: "review", label: "Leave a Review", icon: MessageCircle },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-body transition-all border-b-2 ${
                  activeTab === tab.key ? "border-gold text-gold" : "border-transparent text-ivory/40 hover:text-ivory"
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "bookings" && !selectedBooking && (
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="mx-auto text-ivory/20 mb-4" size={48} />
                  <p className="text-ivory/40">No bookings yet</p>
                  <button onClick={() => navigate("/booking")} className="btn-luxury text-sm mt-4">Book an Event</button>
                </div>
              ) : bookings.map((booking, i) => {
                const status = statusConfig[booking.status] || statusConfig["pending"];
                const StatusIcon = status.icon;
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-noir border border-gold/10 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gold/20 transition-colors cursor-pointer"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <div className="flex-1">
                      <h3 className="font-heading text-lg text-ivory">{booking.sub_categories?.join(", ") || "Event"}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-ivory/40 mt-2">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {booking.event_date || "TBD"}</span>
                        <span>{booking.guests} guests</span>
                        <span>PKR {booking.budget_pkr?.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon size={14} /> {status.label}
                      </span>
                      <ChevronRight size={16} className="text-ivory/30" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {activeTab === "bookings" && selectedBooking && (
            <div>
              <button onClick={() => setSelectedBooking(null)} className="flex items-center gap-2 text-gold hover:text-gold-light font-body mb-6 transition-colors text-sm">
                ← Back to Bookings
              </button>
              <div className="bg-noir border border-gold/10 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-xl text-ivory">{selectedBooking.sub_categories?.join(", ") || "Event"}</h3>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusConfig[selectedBooking.status || "pending"]?.color}`}>{selectedBooking.status}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {[
                    ["Date", selectedBooking.event_date],
                    ["Guests", selectedBooking.guests],
                    ["Budget", `PKR ${selectedBooking.budget_pkr?.toLocaleString()}`],
                    ["Package", selectedBooking.package_type],
                    ["Theme", selectedBooking.theme],
                    ["Services", selectedBooking.services?.join(", ")],
                    ["Flowers", selectedBooking.flowers?.map((f: string) => FLOWERS.find(fl => fl.id === f)?.label || f).join(", ")],
                    ["Destination", selectedBooking.is_destination ? selectedBooking.destination_city : "No"],
                    ["Notes", selectedBooking.notes],
                  ].map(([label, value]) => value ? (
                    <div key={label as string} className="py-2 border-b border-gold/5">
                      <span className="text-ivory/40 block text-xs mb-1">{label}</span>
                      <span className="text-ivory">{value}</span>
                    </div>
                  ) : null)}
                </div>
                
                <div className="pt-4 border-t border-gold/10 mt-4">
                  {meetingFormOpen ? (
                    <div className="space-y-3 bg-noir border border-gold/10 p-4 rounded-xl">
                      <h4 className="text-gold font-heading text-sm mb-2">Request a Meeting</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-ivory/60 text-xs mb-1 block">Date</label>
                          <input type="date" value={meetingForm.date} onChange={e => setMeetingForm(p => ({...p, date: e.target.value}))} className="bg-noir border border-ivory/10 rounded-lg px-3 py-2 text-sm text-ivory w-full focus:outline-none focus:border-gold/50" />
                        </div>
                        <div>
                          <label className="text-ivory/60 text-xs mb-1 block">Time</label>
                          <input type="time" value={meetingForm.time} onChange={e => setMeetingForm(p => ({...p, time: e.target.value}))} className="bg-noir border border-ivory/10 rounded-lg px-3 py-2 text-sm text-ivory w-full focus:outline-none focus:border-gold/50" />
                        </div>
                      </div>
                      <div>
                        <label className="text-ivory/60 text-xs mb-1 block">Location / Format</label>
                        <select value={meetingForm.location} onChange={e => setMeetingForm(p => ({...p, location: e.target.value}))} className="bg-noir border border-ivory/10 rounded-lg px-3 py-2 text-sm text-ivory w-full focus:outline-none focus:border-gold/50">
                          <option value="Online / Google Meet">Online / Google Meet</option>
                          <option value="In-Person at Office">In-Person at Office</option>
                        </select>
                      </div>
                      <textarea placeholder="Notes / Purpose of meeting" value={meetingForm.notes} onChange={e => setMeetingForm(p => ({...p, notes: e.target.value}))} className="bg-noir border border-ivory/10 rounded-lg px-3 py-2 text-sm text-ivory w-full focus:outline-none focus:border-gold/50 h-20 resize-none" />
                      
                      <div className="flex gap-3 pt-2">
                        <button onClick={submitMeetingRequest} className="btn-luxury text-xs py-2 px-4 shadow-none!">Submit Request</button>
                        <button onClick={() => setMeetingFormOpen(false)} className="btn-luxury-outline text-xs py-2 px-4 border-red-400 text-red-400 hover:bg-red-400 hover:text-noir shadow-none!">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setMeetingFormOpen(true)} className="btn-luxury text-sm">
                      Request Meeting
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "meetings" && (
            <div className="space-y-4">
              {meetings.length === 0 ? (
                <div className="text-center py-16">
                  <Calendar className="mx-auto text-ivory/20 mb-4" size={48} />
                  <p className="text-ivory/40 mb-4">No meetings scheduled</p>
                  <button onClick={() => {
                    setActiveTab("bookings");
                    toast.info("Select a booking first to request a meeting about it!");
                  }} className="btn-luxury text-sm">
                    Request a Meeting
                  </button>
                </div>
              ) : meetings.map((m) => (
                <div key={m.id} className="bg-noir border border-gold/10 rounded-xl p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-ivory font-medium">{m.admin_note || "Meeting scheduled"}</p>
                      <p className="text-ivory/40 text-sm mt-1">{m.meeting_date ? new Date(m.meeting_date).toLocaleString() : "TBD"}</p>
                      {m.meeting_location && <p className="text-ivory/30 text-sm">{m.meeting_location}</p>}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${statusConfig[m.status || "pending"]?.color || "text-amber-400 bg-amber-500/10"}`}>
                      {statusConfig[m.status || "pending"]?.label || m.status}
                    </span>
                  </div>
                  {m.status === "pending_client" && (
                    rescheduleMeetingId === m.id ? (
                      <div className="mt-4 border-t border-gold/10 pt-4 space-y-3">
                        <h4 className="text-gold font-heading text-sm mb-2">Reschedule Meeting</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-ivory/60 text-xs mb-1 block">New Date</label>
                            <input type="date" value={rescheduleForm.date} onChange={e => setRescheduleForm(p => ({...p, date: e.target.value}))} className="bg-noir border border-ivory/10 rounded-lg px-3 py-2 text-sm text-ivory w-full focus:outline-none focus:border-gold/50" />
                          </div>
                          <div>
                            <label className="text-ivory/60 text-xs mb-1 block">New Time</label>
                            <input type="time" value={rescheduleForm.time} onChange={e => setRescheduleForm(p => ({...p, time: e.target.value}))} className="bg-noir border border-ivory/10 rounded-lg px-3 py-2 text-sm text-ivory w-full focus:outline-none focus:border-gold/50" />
                          </div>
                        </div>
                        <textarea placeholder="Notes (Optional)" value={rescheduleForm.notes} onChange={e => setRescheduleForm(p => ({...p, notes: e.target.value}))} className="bg-noir border border-ivory/10 rounded-lg px-3 py-2 text-sm text-ivory w-full focus:outline-none focus:border-gold/50 h-20 resize-none" />
                        <div className="flex gap-3 pt-2">
                          <button onClick={() => submitReschedule(m.id)} className="btn-luxury text-xs py-2 px-4 shadow-none!">Send Request</button>
                          <button onClick={() => setRescheduleMeetingId(null)} className="btn-luxury-outline text-xs py-2 px-4 border-red-400 text-red-400 hover:bg-red-400 hover:text-noir shadow-none!">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-3 mt-4">
                        <button onClick={() => respondToMeeting(m.id, "accepted")} className="btn-luxury text-xs py-2 px-4 shadow-none!">Accept</button>
                        <button onClick={() => setRescheduleMeetingId(m.id)} className="btn-luxury text-xs py-2 px-4 bg-transparent border border-gold text-gold hover:bg-gold/10 shadow-none! rounded-lg font-body font-medium transition-all">Reschedule</button>
                        <button onClick={() => {
                          if (confirm("Are you sure you want to reject this meeting?")) respondToMeeting(m.id, "rejected");
                        }} className="btn-luxury-outline text-xs py-2 px-4 border-red-400 text-red-400 hover:bg-red-400 hover:text-noir shadow-none!">Reject</button>
                      </div>
                    )
                  )}
                  {m.status === "pending_admin" && (
                    <div className="mt-4 text-xs text-ivory/40 italic">Waiting for Admin to respond...</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "review" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-noir border border-gold/10 rounded-xl p-6 max-w-2xl mx-auto space-y-4"
            >
              <h3 className="font-heading text-xl text-gold border-b border-gold/10 pb-2">Submit Your Review</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-ivory/60 text-xs mb-1">Your Name</label>
                  <input
                    type="text"
                    value={reviewForm.name}
                    onChange={e => setReviewForm(p => ({ ...p, name: e.target.value }))}
                    className="bg-noir border border-ivory/10 rounded-lg px-3 py-2 text-sm text-ivory w-full focus:outline-none focus:border-gold/50"
                  />
                </div>

                <div>
                  <label className="block text-ivory/60 text-xs mb-1">Event Type &amp; Details</label>
                  <input
                    type="text"
                    value={reviewForm.event}
                    onChange={e => setReviewForm(p => ({ ...p, event: e.target.value }))}
                    placeholder="e.g. Wedding — Baraat &amp; Walima"
                    className="bg-noir border border-ivory/10 rounded-lg px-3 py-2 text-sm text-ivory w-full focus:outline-none focus:border-gold/50"
                  />
                </div>

                <div>
                  <label className="block text-ivory/60 text-xs mb-1">Rating</label>
                  <div className="flex gap-2 mt-1">
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <button
                        key={stars}
                        type="button"
                        onClick={() => setReviewForm(p => ({ ...p, rating: stars }))}
                        className="text-gold focus:outline-none"
                      >
                        <Star
                          size={24}
                          className={stars <= reviewForm.rating ? "fill-gold text-gold" : "text-ivory/20"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-ivory/60 text-xs mb-1">English Review Text</label>
                  <textarea
                    value={reviewForm.text}
                    onChange={e => setReviewForm(p => ({ ...p, text: e.target.value }))}
                    placeholder="Tell us about your experience..."
                    className="bg-noir border border-ivory/10 rounded-lg px-3 py-2 text-sm text-ivory w-full focus:outline-none focus:border-gold/50 h-28 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-ivory/60 text-xs mb-1">Urdu Review Text (Optional)</label>
                  <textarea
                    value={reviewForm.textUrdu}
                    onChange={e => setReviewForm(p => ({ ...p, textUrdu: e.target.value }))}
                    placeholder="اپنے تجربے کے بارے میں لکھیں..."
                    dir="rtl"
                    className="bg-noir border border-ivory/10 rounded-lg px-3 py-2 text-md text-ivory w-full focus:outline-none focus:border-gold/50 h-28 resize-none text-right font-serif"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReviewSubmit}
                  className="btn-luxury w-full py-3 mt-4"
                >
                  Submit Review
                </motion.button>
              </div>
            </motion.div>
          )}

          <div className="mt-12 glass-dark rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-heading text-lg text-ivory">Need help with your event?</h3>
              <p className="text-ivory/60 text-sm">Chat with our planners on WhatsApp</p>
            </div>
            <a href="https://wa.me/923282681668" target="_blank" rel="noopener noreferrer" className="btn-luxury flex items-center gap-2 text-sm">
              <MessageCircle size={16} /> Chat Now
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ClientDashboard;
