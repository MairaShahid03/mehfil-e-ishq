import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, CalendarDays, Users, BarChart3, Settings, Image,
  CheckCircle, XCircle, Eye, Clock, Menu, X as XIcon,
  TrendingUp, DollarSign, Calendar, FileText, MessageCircle, MessageSquare,
  Upload, Trash2, Loader2, ChevronLeft, ChevronRight, LogOut, UserCog, Star
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { FLOWERS, THEMES } from "@/lib/eventData";
import { getReviews, approveReview, deleteReview, Testimonial } from "@/lib/reviewsStore";

type Tab = "overview" | "bookings" | "meetings" | "calendar" | "gallery" | "clients" | "analytics" | "settings" | "reviews";

const statusColors: Record<string, string> = {
  pending: "text-amber-400 bg-amber-500/10",
  approved: "text-emerald-400 bg-emerald-500/10",
  rejected: "text-red-400 bg-red-500/10",
  completed: "text-blue-400 bg-blue-500/10",
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const AdminDashboard = () => {
  const { user, profile, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [allMeetings, setAllMeetings] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Gallery state
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [galleryCategory, setGalleryCategory] = useState("baraat");
  const [uploading, setUploading] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);

  // Calendar state
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Meeting state
  const [meetingFormOpen, setMeetingFormOpen] = useState(false);
  const [meetingForm, setMeetingForm] = useState({ date: "", time: "", location: "Online / Google Meet", notes: "Please join the meeting exactly on time." });

  // Settings state
  const [settingsForm, setSettingsForm] = useState({ full_name: "", phone: "", email: "" });
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });

  // Reschedule state
  const [rescheduleMeetingId, setRescheduleMeetingId] = useState<string | null>(null);
  const [rescheduleForm, setRescheduleForm] = useState({ date: "", time: "", notes: "" });

  const GALLERY_CATS = ["baraat","birthday","dua-e-khair","mayoun","mehndi","nikkah","others","engagement","qawali night"];

  const navItems: { key: Tab; label: string; icon: any }[] = [
    { key: "overview", label: "Dashboard", icon: LayoutDashboard },
    { key: "bookings", label: "Bookings", icon: FileText },
    { key: "meetings", label: "Meetings", icon: MessageSquare },
    { key: "calendar", label: "Calendar", icon: CalendarDays },
    { key: "gallery", label: "Gallery", icon: Image },
    { key: "clients", label: "Clients", icon: Users },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
    { key: "settings", label: "Settings", icon: Settings },
    { key: "reviews", label: "Reviews", icon: MessageCircle },
  ];

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/login");
    }
  }, [authLoading, user, isAdmin, navigate]);

  const [allReviews, setAllReviews] = useState<Testimonial[]>([]);
  const fetchReviews = () => {
    setAllReviews(getReviews());
  };

  useEffect(() => {
    if (user && isAdmin) {
      fetchBookings();
      fetchProfiles();
      fetchMeetings();
      fetchReviews();
    }
  }, [user, isAdmin]);

  useEffect(() => {
    if (tab === "reviews") fetchReviews();
  }, [tab]);

  useEffect(() => {
    if (tab === "gallery") fetchGalleryImages();
  }, [tab, galleryCategory]);

  useEffect(() => {
    if (profile) {
      setSettingsForm({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        email: profile.email || "",
      });
    }
  }, [profile]);

  const fetchBookings = async () => {
    setLoading(true);
    const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    setBookings(data || []);
    setLoading(false);
  };

  const fetchProfiles = async () => {
    const { data } = await supabase.from("profiles").select("*");
    setProfiles(data || []);
  };

  const fetchMeetings = async () => {
    const { data } = await supabase.from("meetings").select("*").order("created_at", { ascending: false });
    setAllMeetings(data || []);
  };

  const fetchGalleryImages = async () => {
    setGalleryLoading(true);
    const { data } = await supabase.from("gallery").select("*").ilike("category", galleryCategory);
    setGalleryImages(data || []);
    setGalleryLoading(false);
  };

  const updateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Booking ${status}`);
    fetchBookings();
    if (selectedBooking?.id === id) setSelectedBooking({ ...selectedBooking, status });
  };

  const submitMeetingRequest = async () => {
    if (!meetingForm.date || !meetingForm.time) {
      toast.error("Please select date and time");
      return;
    }
    
    // Combine date and time
    const meetingDateTime = `${meetingForm.date}T${meetingForm.time}`;
    
    const { error } = await supabase.from("meetings").insert({
      booking_id: selectedBooking.id,
      user_id: selectedBooking.user_id,
      meeting_date: meetingDateTime,
      meeting_location: meetingForm.location,
      admin_note: meetingForm.notes,
      status: "pending_client",
      user_response: "pending"
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Meeting scheduled. The client can now accept it.");
      setMeetingFormOpen(false);
      setMeetingForm({ date: "", time: "", location: "Online / Google Meet", notes: "Please join the meeting exactly on time." });
      fetchMeetings();
    }
  };

  const respondToMeeting = async (meetingId: string, response: string, reason?: string) => {
    const { error } = await supabase.from("meetings").update({
      status: response,
      rejection_reason: reason || null,
    }).eq("id", meetingId);
    if (error) toast.error(error.message);
    else { toast.success(`Meeting ${response}`); fetchMeetings(); }
  };

  const submitReschedule = async (meetingId: string) => {
    if (!rescheduleForm.date || !rescheduleForm.time) {
      toast.error("Please select a date and time");
      return;
    }
    const meetingDateTime = `${rescheduleForm.date}T${rescheduleForm.time}`;
    
    // For admin rescheduling, we set status to pending_client
    const { error } = await supabase.from("meetings").update({
      meeting_date: meetingDateTime,
      rejection_reason: rescheduleForm.notes ? `Admin Reschedule Note: ${rescheduleForm.notes}` : null,
      status: "pending_client",
      user_response: "pending"
    }).eq("id", meetingId);
    
    if (error) toast.error(error.message);
    else {
      toast.success("Reschedule request sent");
      setRescheduleMeetingId(null);
      setRescheduleForm({ date: "", time: "", notes: "" });
      fetchMeetings();
    }
  };

  const openWhatsApp = (booking: any) => {
    const phone = booking.phone?.replace(/\D/g, "") || "";
    const msg = encodeURIComponent(
      `Assalam o Alaikum! Your booking for ${booking.sub_categories?.join(", ") || "your event"} on ${booking.event_date || "TBD"} has been approved by Mehfil-e-Ishq. Budget: PKR ${booking.budget_pkr?.toLocaleString() || "N/A"}. We'll be in touch shortly!`
    );
    window.open(`https://wa.me/${phone.startsWith("92") ? phone : "92" + phone}?text=${msg}`, "_blank");
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${galleryCategory}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from("gallery-images").upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("gallery-images").getPublicUrl(filePath);
      const { error: dbError } = await supabase.from("gallery").insert({
        image_url: urlData.publicUrl,
        category: galleryCategory,
      });
      if (dbError) throw dbError;
      toast.success("Image uploaded!");
      fetchGalleryImages();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryDelete = async (img: any) => {
    if (!confirm("Delete this image?")) return;
    try {
      // Extract path from URL
      const url = new URL(img.image_url);
      const pathParts = url.pathname.split("/gallery-images/");
      if (pathParts[1]) {
        await supabase.storage.from("gallery-images").remove([decodeURIComponent(pathParts[1])]);
      }
      const { error } = await supabase.from("gallery").delete().eq("id", img.id);
      if (error) throw error;
      toast.success("Image deleted");
      fetchGalleryImages();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    }
  };

  const handleSettingsSave = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({
      full_name: settingsForm.full_name,
      phone: settingsForm.phone,
    }).eq("id", user.id);
    if (error) toast.error(error.message);
    else toast.success("Profile updated!");
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: passwords.newPassword });
    if (error) toast.error(error.message);
    else {
      toast.success("Password changed!");
      setPasswords({ newPassword: "", confirmPassword: "" });
    }
  };

  // Calendar helpers
  const calYear = calendarDate.getFullYear();
  const calMonth = calendarDate.getMonth();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay = new Date(calYear, calMonth, 1).getDay();

  const getBookingsForDate = (day: number) => {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return bookings.filter(b => b.event_date === dateStr);
  };

  // Stats
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter(b => b.status === "pending").length;
  const approvedCount = bookings.filter(b => b.status === "approved").length;
  const completedCount = bookings.filter(b => b.status === "completed").length;
  const totalRevenue = bookings.filter(b => b.status !== "rejected").reduce((s, b) => s + (b.budget_pkr || 0), 0);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-noir flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={40} />
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 rounded-lg border border-gold/20 bg-noir/50 text-ivory font-body placeholder:text-ivory/30 focus:outline-none focus:ring-2 focus:ring-gold/50";

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-noir text-ivory p-4 border-r border-gold/10">
      <div className="mb-8 px-2">
        <h2 className="font-heading text-xl text-gold">Admin Panel</h2>
        <p className="text-ivory/40 text-xs mt-1">Mehfil-e-Ishq</p>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => { setTab(item.key); setSidebarOpen(false); setSelectedBooking(null); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-all ${
              tab === item.key ? "bg-gold/10 text-gold" : "text-ivory/60 hover:text-ivory hover:bg-ivory/5"
            }`}
          >
            <item.icon size={18} /> {item.label}
          </button>
        ))}
      </nav>
      <button
        onClick={async () => { await signOut(); navigate("/login"); }}
        className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-400/70 hover:text-red-400 transition-colors"
      >
        <LogOut size={18} /> Sign Out
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-noir">
      <div className="hidden md:block w-64">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-noir/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 z-10"><Sidebar /></div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-gold/10 flex items-center justify-between px-4 md:px-8 bg-noir">
          <button className="md:hidden text-ivory" onClick={() => setSidebarOpen(true)}><Menu size={24} /></button>
          <h1 className="font-heading text-xl text-gold capitalize">{tab === "overview" ? "Dashboard" : tab}</h1>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
              <span className="text-gold text-sm font-bold">{profile?.full_name?.[0] || "A"}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Bookings", value: totalBookings, icon: FileText, color: "text-gold" },
                  { label: "Revenue", value: `PKR ${(totalRevenue / 1000000).toFixed(1)}M`, icon: DollarSign, color: "text-emerald-400" },
                  { label: "Upcoming", value: approvedCount, icon: Calendar, color: "text-blue-400" },
                  { label: "Pending", value: pendingCount, icon: Clock, color: "text-amber-400" },
                ].map((s, i) => (
                  <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                    className="bg-noir border border-gold/10 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <s.icon size={20} className={s.color} />
                    </div>
                    <p className="font-heading text-2xl text-ivory font-bold">{s.value}</p>
                    <p className="text-sm text-ivory/40">{s.label}</p>
                  </motion.div>
                ))}
              </div>

              <div>
                <h3 className="font-heading text-lg text-ivory mb-4">Recent Bookings</h3>
                <div className="border border-gold/10 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-noir/50 border-b border-gold/10">
                        <tr>
                          {["Client","Event","Budget","Status","Actions"].map(h => (
                            <th key={h} className="text-left p-3 font-body font-medium text-ivory/40">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.slice(0, 5).map((b) => (
                          <tr key={b.id} className="border-t border-gold/5 hover:bg-gold/5 transition-colors">
                            <td className="p-3 font-medium text-ivory">{b.full_name || "—"}</td>
                            <td className="p-3 text-ivory/60">{b.sub_categories?.join(", ") || "—"}</td>
                            <td className="p-3 text-ivory/60">PKR {b.budget_pkr?.toLocaleString() || "—"}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[b.status] || ""}`}>{b.status}</span>
                            </td>
                            <td className="p-3">
                              <button onClick={() => setSelectedBooking(b)} className="p-1.5 hover:bg-gold/10 rounded-lg text-ivory/60"><Eye size={14} /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* BOOKINGS */}
          {tab === "bookings" && !selectedBooking && (
            <div className="border border-gold/10 rounded-xl overflow-hidden">
              {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold" size={40} /></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-noir/50 border-b border-gold/10">
                      <tr>
                        {["Client","Sub-Categories","Date","Budget","Status","Actions"].map(h => (
                          <th key={h} className="text-left p-3 font-body font-medium text-ivory/40">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b.id} className="border-t border-gold/5 hover:bg-gold/5 transition-colors">
                          <td className="p-3 font-medium text-ivory">{b.full_name || "—"}</td>
                          <td className="p-3 text-ivory/60">{b.sub_categories?.join(", ") || "—"}</td>
                          <td className="p-3 text-ivory/60">{b.event_date || "—"}</td>
                          <td className="p-3 text-ivory/60">PKR {b.budget_pkr?.toLocaleString() || "—"}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[b.status] || ""}`}>{b.status}</span>
                          </td>
                          <td className="p-3 flex gap-1">
                            {b.status === "pending" && (
                              <>
                                <button onClick={() => updateBookingStatus(b.id, "approved")} className="p-1.5 hover:bg-emerald-500/10 rounded-lg text-emerald-400" title="Approve"><CheckCircle size={14} /></button>
                                <button onClick={() => updateBookingStatus(b.id, "rejected")} className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-400" title="Reject"><XCircle size={14} /></button>
                              </>
                            )}
                            {b.status === "approved" && (
                              <>
                                <button onClick={() => updateBookingStatus(b.id, "completed")} className="p-1.5 hover:bg-blue-500/10 rounded-lg text-blue-400" title="Complete"><CheckCircle size={14} /></button>
                                <button onClick={() => openWhatsApp(b)} className="p-1.5 hover:bg-emerald-500/10 rounded-lg text-emerald-400" title="WhatsApp"><MessageCircle size={14} /></button>
                              </>
                            )}
                            <button onClick={() => setSelectedBooking(b)} className="p-1.5 hover:bg-gold/10 rounded-lg text-ivory/60" title="View"><Eye size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* BOOKING DETAIL */}
          {tab === "bookings" && selectedBooking && (
            <div>
              <button onClick={() => setSelectedBooking(null)} className="flex items-center gap-2 text-gold hover:text-gold-light font-body mb-6 transition-colors">
                <ChevronLeft size={18} /> Back to Bookings
              </button>
              <div className="bg-noir border border-gold/10 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-2xl text-ivory">{selectedBooking.full_name || "Client"}</h3>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${statusColors[selectedBooking.status] || ""}`}>{selectedBooking.status}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {[
                    ["Email", selectedBooking.email],
                    ["Phone", selectedBooking.phone],
                    ["Sub-Categories", selectedBooking.sub_categories?.join(", ")],
                    ["Event Date", selectedBooking.event_date],
                    ["Guests", selectedBooking.guests],
                    ["Budget", `PKR ${selectedBooking.budget_pkr?.toLocaleString()}`],
                    ["Package", selectedBooking.package_type],
                    ["Destination", selectedBooking.is_destination ? selectedBooking.destination_city || "Yes" : "No"],
                    ["Theme", selectedBooking.theme],
                    ["Services", selectedBooking.services?.join(", ")],
                    ["Flowers", selectedBooking.flowers?.map((f: string) => FLOWERS.find(fl => fl.id === f)?.label || f).join(", ")],
                    ["Location", selectedBooking.location],
                    ["Notes", selectedBooking.notes],
                  ].map(([label, value]) => value ? (
                    <div key={label as string} className="py-2 border-b border-gold/5">
                      <span className="text-ivory/40 block text-xs mb-1">{label}</span>
                      <span className="text-ivory">{value}</span>
                    </div>
                  ) : null)}
                </div>
                <div className="flex gap-3 pt-4">
                  {selectedBooking.status === "pending" && (
                    <>
                      <button onClick={() => updateBookingStatus(selectedBooking.id, "approved")} className="btn-luxury text-sm">Approve</button>
                      <button onClick={() => updateBookingStatus(selectedBooking.id, "rejected")} className="btn-luxury-outline text-sm border-red-400 text-red-400 hover:bg-red-400 hover:text-noir">Reject</button>
                    </>
                  )}
                  {selectedBooking.status === "approved" && (
                    <>
                      <button onClick={() => updateBookingStatus(selectedBooking.id, "completed")} className="btn-luxury text-sm">Mark Completed</button>
                      <button onClick={() => openWhatsApp(selectedBooking)} className="btn-luxury-outline text-sm flex items-center gap-2"><MessageCircle size={14} /> WhatsApp</button>
                    </>
                  )}
                </div>
                
                <div className="pt-4 border-t border-gold/10 mt-4">
                  {meetingFormOpen ? (
                    <div className="space-y-3 bg-noir border border-gold/10 p-4 rounded-xl">
                      <h4 className="text-gold font-heading text-sm mb-2">Schedule a Meeting</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-ivory/60 text-xs mb-1 block">Date</label>
                          <input type="date" value={meetingForm.date} onChange={e => setMeetingForm(p => ({...p, date: e.target.value}))} className={inputClass} />
                        </div>
                        <div>
                          <label className="text-ivory/60 text-xs mb-1 block">Time</label>
                          <input type="time" value={meetingForm.time} onChange={e => setMeetingForm(p => ({...p, time: e.target.value}))} className={inputClass} />
                        </div>
                      </div>
                      <div>
                          <label className="text-ivory/60 text-xs mb-1 block">Location / Format</label>
                          <select value={meetingForm.location} onChange={e => setMeetingForm(p => ({...p, location: e.target.value}))} className={inputClass}>
                            <option value="Online / Google Meet">Online / Google Meet</option>
                            <option value="In-Person at Office">In-Person at Office</option>
                          </select>
                      </div>
                      <textarea placeholder="Note for the client..." value={meetingForm.notes} onChange={e => setMeetingForm(p => ({...p, notes: e.target.value}))} className={inputClass + " h-20 resize-none"} />
                      
                      <div className="flex gap-3 pt-2">
                        <button onClick={submitMeetingRequest} className="btn-luxury text-sm py-2 px-4 shadow-none!">Schedule with Client</button>
                        <button onClick={() => setMeetingFormOpen(false)} className="btn-luxury-outline text-sm py-2 px-4 shadow-none!">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setMeetingFormOpen(true)} className="btn-luxury text-sm">
                      Schedule Meeting
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* MEETINGS */}
          {tab === "meetings" && (
            <div className="space-y-4">
              {allMeetings.length === 0 ? (
                <div className="text-center py-20 text-ivory/40">No meetings found</div>
              ) : allMeetings.map((m) => {
                const booking = bookings.find(b => b.id === m.booking_id);
                return (
                  <div key={m.id} className="bg-noir border border-gold/10 rounded-xl p-5 w-full">
                    <div className="flex flex-col md:flex-row justify-between md:items-start mb-4 gap-2">
                      <div>
                        <h4 className="font-heading text-lg text-gold">{booking?.full_name || "Client"} - Meeting</h4>
                        <p className="text-ivory/80 text-sm mt-1">{m.admin_note}</p>
                        <p className="text-ivory/50 text-sm mt-2 font-medium">{m.meeting_date ? new Date(m.meeting_date).toLocaleString() : "TBD"}</p>
                        {m.meeting_location && <p className="text-ivory/40 text-sm">{m.meeting_location}</p>}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs self-start ${
                        m.status === "accepted" ? "text-emerald-400 bg-emerald-500/10" :
                        m.status === "rejected" ? "text-red-400 bg-red-500/10" :
                        "text-emerald-400 bg-emerald-500/10"
                      }`}>{m.status}</span>
                    </div>
                    {m.status === "pending_admin" && (
                      rescheduleMeetingId === m.id ? (
                        <div className="mt-4 border-t border-gold/10 pt-4 space-y-3">
                          <h4 className="text-gold font-heading text-sm mb-2">Reschedule Meeting</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-ivory/60 text-xs mb-1 block">New Date</label>
                              <input type="date" value={rescheduleForm.date} onChange={e => setRescheduleForm(p => ({...p, date: e.target.value}))} className={inputClass} />
                            </div>
                            <div>
                              <label className="text-ivory/60 text-xs mb-1 block">New Time</label>
                              <input type="time" value={rescheduleForm.time} onChange={e => setRescheduleForm(p => ({...p, time: e.target.value}))} className={inputClass} />
                            </div>
                          </div>
                          <textarea placeholder="Notes (Optional)" value={rescheduleForm.notes} onChange={e => setRescheduleForm(p => ({...p, notes: e.target.value}))} className={inputClass + " h-20 resize-none"} />
                          <div className="flex gap-3 pt-2">
                            <button onClick={() => submitReschedule(m.id)} className="btn-luxury text-xs py-2 px-4 shadow-none!">Send Request</button>
                            <button onClick={() => setRescheduleMeetingId(null)} className="btn-luxury-outline text-xs py-2 px-4 border-red-400 text-red-400 hover:bg-red-400 hover:text-noir shadow-none!">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-3 mt-4 border-t border-gold/5 pt-4">
                          <button onClick={() => respondToMeeting(m.id, "accepted")} className="btn-luxury text-xs py-2 px-4 shadow-none!">Accept</button>
                          <button onClick={() => setRescheduleMeetingId(m.id)} className="btn-luxury text-xs py-2 px-4 bg-transparent border border-gold text-gold hover:bg-gold/10 shadow-none! rounded-lg font-body font-medium transition-all">Reschedule</button>
                          <button onClick={() => {
                            if (confirm("Are you sure you want to reject this meeting?")) respondToMeeting(m.id, "rejected");
                          }} className="btn-luxury-outline text-xs py-2 px-4 border-red-400 text-red-400 hover:bg-red-400 hover:text-noir shadow-none!">Reject</button>
                        </div>
                      )
                    )}
                    {m.status === "pending_client" && (
                      <div className="mt-4 text-xs text-ivory/40 italic">Waiting for Client to respond...</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* CALENDAR */}
          {tab === "calendar" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => setCalendarDate(new Date(calYear, calMonth - 1))} className="p-2 hover:bg-gold/10 rounded-lg text-ivory/60"><ChevronLeft size={20} /></button>
                <h3 className="font-heading text-xl text-ivory">{MONTHS[calMonth]} {calYear}</h3>
                <button onClick={() => setCalendarDate(new Date(calYear, calMonth + 1))} className="p-2 hover:bg-gold/10 rounded-lg text-ivory/60"><ChevronRight size={20} /></button>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {DAYS.map(d => <div key={d} className="text-center text-xs text-ivory/40 py-2 font-body">{d}</div>)}
                {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dayBookings = getBookingsForDate(day);
                  return (
                    <div
                      key={day}
                      className={`min-h-[80px] p-1 rounded-lg border transition-colors ${
                        dayBookings.length > 0 ? "border-gold/20 bg-gold/5" : "border-gold/5"
                      }`}
                    >
                      <span className="text-xs text-ivory/60 block mb-1">{day}</span>
                      {dayBookings.slice(0, 3).map((b, bi) => (
                        <button
                          key={bi}
                          onClick={() => { setSelectedBooking(b); setTab("bookings"); }}
                          className={`w-full text-left text-[10px] px-1 py-0.5 rounded mb-0.5 truncate ${
                            b.status === "pending" ? "bg-amber-500/20 text-amber-300" :
                            b.status === "approved" ? "bg-emerald-500/20 text-emerald-300" :
                            b.status === "rejected" ? "bg-red-500/20 text-red-300" :
                            "bg-blue-500/20 text-blue-300"
                          }`}
                        >
                          {b.full_name || "Event"}
                        </button>
                      ))}
                      {dayBookings.length > 3 && <span className="text-[10px] text-ivory/30">+{dayBookings.length - 3} more</span>}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 mt-4 text-xs text-ivory/50">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-500/30" /> Pending</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500/30" /> Approved</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-500/30" /> Rejected</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500/30" /> Completed</span>
              </div>
            </div>
          )}

          {/* GALLERY */}
          {tab === "gallery" && (
            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                {GALLERY_CATS.map(c => (
                  <button
                    key={c}
                    onClick={() => setGalleryCategory(c)}
                    className={`px-4 py-2 rounded-lg text-sm font-body transition-all capitalize ${
                      galleryCategory === c ? "bg-gold text-noir" : "bg-gold/10 text-ivory/60 hover:text-ivory"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <label className="btn-luxury text-sm flex items-center gap-2 cursor-pointer">
                  <Upload size={16} />
                  {uploading ? "Uploading..." : "Upload Image"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} disabled={uploading} />
                </label>
                <span className="text-ivory/40 text-sm">{galleryImages.length} images in "{galleryCategory}"</span>
              </div>

              {galleryLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-gold" size={40} /></div>
              ) : galleryImages.length === 0 ? (
                <div className="text-center py-20 text-ivory/40">No images in this category</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galleryImages.map((img) => (
                    <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden border border-gold/10">
                      <img src={img.image_url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-noir/0 group-hover:bg-noir/50 transition-colors duration-300 flex items-center justify-center">
                        <button
                          onClick={() => handleGalleryDelete(img)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-3 bg-red-500/80 rounded-full text-ivory hover:bg-red-500"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CLIENTS */}
          {tab === "clients" && (
            <div className="space-y-3">
              {profiles.filter(p => p.role !== "admin").map((p) => (
                <div key={p.id} className="bg-noir border border-gold/10 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                      <span className="text-gold font-heading font-bold">{(p.full_name || "?")[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-ivory text-sm">{p.full_name || "—"}</p>
                      <p className="text-xs text-ivory/40">{p.email || p.phone || "No contact"}</p>
                    </div>
                  </div>
                  <span className="text-xs text-ivory/30">{bookings.filter(b => b.user_id === p.id).length} bookings</span>
                </div>
              ))}
            </div>
          )}

          {/* ANALYTICS */}
          {tab === "analytics" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-noir border border-gold/10 rounded-xl p-6">
                  <p className="text-ivory/40 text-sm mb-2">Total Bookings</p>
                  <p className="font-heading text-3xl text-gold font-bold">{totalBookings}</p>
                </div>
                <div className="bg-noir border border-gold/10 rounded-xl p-6">
                  <p className="text-ivory/40 text-sm mb-2">Total Revenue</p>
                  <p className="font-heading text-3xl text-emerald-400 font-bold">PKR {totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-noir border border-gold/10 rounded-xl p-6">
                  <p className="text-ivory/40 text-sm mb-2">Completed Events</p>
                  <p className="font-heading text-3xl text-blue-400 font-bold">{completedCount}</p>
                </div>
              </div>

              <div className="bg-noir border border-gold/10 rounded-xl p-6">
                <h3 className="font-heading text-lg text-ivory mb-4">Booking Status Distribution</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Pending", count: pendingCount, color: "bg-amber-500" },
                    { label: "Approved", count: approvedCount, color: "bg-emerald-500" },
                    { label: "Rejected", count: bookings.filter(b => b.status === "rejected").length, color: "bg-red-500" },
                    { label: "Completed", count: completedCount, color: "bg-blue-500" },
                  ].map(s => (
                    <div key={s.label} className="text-center">
                      <div className="h-24 flex items-end justify-center mb-2">
                        <div className={`w-12 ${s.color}/30 rounded-t-lg`} style={{ height: `${Math.max(10, (s.count / Math.max(totalBookings, 1)) * 100)}%` }}>
                          <div className={`w-full h-full ${s.color} rounded-t-lg opacity-60`} />
                        </div>
                      </div>
                      <p className="text-ivory font-bold">{s.count}</p>
                      <p className="text-ivory/40 text-xs">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-noir border border-gold/10 rounded-xl p-6">
                <h3 className="font-heading text-lg text-ivory mb-4">Monthly Trends</h3>
                <div className="flex items-end gap-2 h-40">
                  {MONTHS.map((m, i) => {
                    const count = bookings.filter(b => {
                      const d = new Date(b.event_date || b.created_at);
                      return d.getMonth() === i && d.getFullYear() === calYear;
                    }).length;
                    return (
                      <div key={m} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-gold/20 rounded-t-sm" style={{ height: `${Math.max(4, (count / Math.max(totalBookings, 1)) * 120)}px` }}>
                          <div className="w-full h-full bg-gold/50 rounded-t-sm" />
                        </div>
                        <span className="text-[10px] text-ivory/30 mt-1">{m}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {tab === "settings" && (
            <div className="max-w-lg space-y-8">
              <div className="bg-noir border border-gold/10 rounded-xl p-6">
                <h3 className="font-heading text-lg text-ivory mb-4 flex items-center gap-2"><UserCog size={20} className="text-gold" /> Profile Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-ivory/60 mb-1 block">Full Name</label>
                    <input value={settingsForm.full_name} onChange={(e) => setSettingsForm(p => ({ ...p, full_name: e.target.value }))} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-sm text-ivory/60 mb-1 block">Phone</label>
                    <input value={settingsForm.phone} onChange={(e) => setSettingsForm(p => ({ ...p, phone: e.target.value }))} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-sm text-ivory/60 mb-1 block">Email</label>
                    <input value={settingsForm.email} disabled className={inputClass + " opacity-50"} />
                  </div>
                  <button onClick={handleSettingsSave} className="btn-luxury text-sm">Save Profile</button>
                </div>
              </div>

              <div className="bg-noir border border-gold/10 rounded-xl p-6">
                <h3 className="font-heading text-lg text-ivory mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-ivory/60 mb-1 block">New Password</label>
                    <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords(p => ({ ...p, newPassword: e.target.value }))} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-sm text-ivory/60 mb-1 block">Confirm Password</label>
                    <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords(p => ({ ...p, confirmPassword: e.target.value }))} className={inputClass} />
                  </div>
                  <button onClick={handlePasswordChange} className="btn-luxury text-sm">Change Password</button>
                </div>
              </div>
            </div>
          )}

          {/* REVIEWS TAB */}
          {tab === "reviews" && (
            <div className="space-y-8 animate-fade-in">
              {/* Pending Reviews */}
              <div>
                <h3 className="font-heading text-lg text-gold mb-4 flex items-center gap-2">
                  <Clock size={18} /> Pending Approval ({allReviews.filter(r => !r.approved).length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allReviews.filter(r => !r.approved).length === 0 ? (
                    <div className="col-span-2 text-center py-8 bg-noir border border-gold/5 rounded-xl text-ivory/40 text-sm">
                      No pending reviews to moderate.
                    </div>
                  ) : allReviews.filter(r => !r.approved).map((r) => (
                    <div key={r.id} className="bg-noir border border-gold/10 rounded-xl p-5 space-y-3 relative">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-heading text-md text-ivory font-bold">{r.name}</h4>
                          <p className="text-gold/60 text-xs">{r.event}</p>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} size={14} className="text-gold fill-gold" />
                          ))}
                        </div>
                      </div>
                      <p className="text-ivory/80 text-sm italic">"{r.text}"</p>
                      {r.textUrdu && (
                        <p className="text-gold/80 text-md text-right border-t border-gold/5 pt-2 font-serif font-medium leading-relaxed" dir="rtl">
                          {r.textUrdu}
                        </p>
                      )}
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => {
                            approveReview(r.id);
                            toast.success("Review approved successfully!");
                            fetchReviews();
                          }}
                          className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs rounded transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this review?")) {
                              deleteReview(r.id);
                              toast.success("Review deleted.");
                              fetchReviews();
                            }
                          }}
                          className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Approved Reviews */}
              <div>
                <h3 className="font-heading text-lg text-ivory mb-4 flex items-center gap-2">
                  <CheckCircle size={18} className="text-emerald-400" /> Approved &amp; Live ({allReviews.filter(r => r.approved).length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {allReviews.filter(r => r.approved).length === 0 ? (
                    <div className="col-span-2 text-center py-8 bg-noir border border-gold/5 rounded-xl text-ivory/40 text-sm">
                      No approved reviews.
                    </div>
                  ) : allReviews.filter(r => r.approved).map((r) => (
                    <div key={r.id} className="bg-noir border border-gold/10 rounded-xl p-5 space-y-3 opacity-80 hover:opacity-100 transition-opacity">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-heading text-md text-ivory font-bold">{r.name}</h4>
                          <p className="text-gold/60 text-xs">{r.event}</p>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} size={14} className="text-gold fill-gold" />
                          ))}
                        </div>
                      </div>
                      <p className="text-ivory/80 text-sm italic">"{r.text}"</p>
                      {r.textUrdu && (
                        <p className="text-gold/80 text-md text-right border-t border-gold/5 pt-2 font-serif font-medium leading-relaxed" dir="rtl">
                          {r.textUrdu}
                        </p>
                      )}
                      <div className="flex gap-2 pt-2">
                        <span className="text-emerald-400 bg-emerald-500/10 px-2.5 py-1 text-xs rounded select-none">Live</span>
                        <button
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this review?")) {
                              deleteReview(r.id);
                              toast.success("Review deleted.");
                              fetchReviews();
                            }
                          }}
                          className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
