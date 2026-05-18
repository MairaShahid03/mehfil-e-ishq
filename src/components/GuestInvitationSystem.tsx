import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Mail, Share2, Users, Check, X, Copy, QrCode,
  Calendar, MapPin, Clock, Send, Download, Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";

interface Guest {
  id: string;
  name: string;
  email: string;
  status: "pending" | "accepted" | "declined";
  category: string;
  dietaryRestrictions?: string;
}

interface Invitation {
  id: string;
  eventName: string;
  brideName: string;
  brideFamily: string;
  groomName: string;
  groomFamily: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  invitationLink: string;
  guests: Guest[];
  totalInvited: number;
  acceptedCount: number;
  declinedCount: number;
}

const GuestInvitationSystem = () => {
  const [activeTab, setActiveTab] = useState<"create" | "manage" | "track">("create");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: "1",
      eventName: "Wedding Ceremony",
      brideName: "Sana",
      brideFamily: "Ahmed",
      groomName: "Haris",
      groomFamily: "Khan",
      eventDate: "2026-06-15",
      eventTime: "18:00",
      eventLocation: "Mansion Marquee, Clifton, Karachi",
      invitationLink: "https://mehfil-e-ishq.com/invite/abc123",
      guests: [
        {
          id: "g1",
          name: "Ali Khan",
          email: "ali@example.com",
          status: "accepted",
          category: "Family",
        },
        {
          id: "g2",
          name: "Sara Ahmed",
          email: "sara@example.com",
          status: "pending",
          category: "Friends",
        },
      ],
      totalInvited: 150,
      acceptedCount: 87,
      declinedCount: 12,
    },
  ]);

  const [formData, setFormData] = useState({
    eventName: "Wedding Ceremony",
    brideName: "",
    brideFamily: "",
    groomName: "",
    groomFamily: "",
    eventDate: "",
    eventTime: "18:00",
    eventLocation: "",
    guestList: "",
  });

  const handleCreateInvitation = () => {
    if (
      !formData.eventName ||
      !formData.brideName ||
      !formData.brideFamily ||
      !formData.groomName ||
      !formData.groomFamily ||
      !formData.eventDate ||
      !formData.eventLocation
    ) {
      toast.error("Please fill in all required fields (Bride, Groom, Families & Event details)");
      return;
    }

    const newInvitation: Invitation = {
      id: Date.now().toString(),
      eventName: formData.eventName,
      brideName: formData.brideName,
      brideFamily: formData.brideFamily,
      groomName: formData.groomName,
      groomFamily: formData.groomFamily,
      eventDate: formData.eventDate,
      eventTime: formData.eventTime || "18:00",
      eventLocation: formData.eventLocation,
      invitationLink: `https://mehfil-e-ishq.com/invite/${Math.random().toString(36).substring(2, 11)}`,
      guests: [],
      totalInvited: 0,
      acceptedCount: 0,
      declinedCount: 0,
    };

    setInvitations([...invitations, newInvitation]);
    toast.success("Invitation and RSVP system generated successfully!");
    setActiveTab("manage");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
  };

  const handleRSVP = (invitationId: string, guestId: string, status: "accepted" | "declined") => {
    setInvitations(
      invitations.map((inv) => {
        if (inv.id === invitationId) {
          return {
            ...inv,
            guests: inv.guests.map((g) =>
              g.id === guestId ? { ...g, status } : g
            ),
          };
        }
        return inv;
      })
    );
    toast.success(`RSVP ${status}!`);
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "06:00 PM";
    try {
      const [hours, minutes] = timeStr.split(":");
      const hrs = parseInt(hours, 10);
      const ampm = hrs >= 12 ? "PM" : "AM";
      const formattedHrs = hrs % 12 || 12;
      return `${String(formattedHrs).padStart(2, "0")}:${minutes} ${ampm}`;
    } catch (e) {
      return timeStr;
    }
  };

  // Luxury Card download function using Canvas
  const downloadInvitationCard = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 1200;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background - Premium Dark Burgundy Royal Pattern
    ctx.fillStyle = "#1e0205";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ornate gold border
    ctx.strokeStyle = "#e5c158";
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(42, 42, canvas.width - 84, canvas.height - 84);

    // Corner ornaments
    const drawCorner = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.strokeStyle = "#d4af37";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 40);
      ctx.lineTo(0, 0);
      ctx.lineTo(40, 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(15, 15, 8, 0, Math.PI * 2);
      ctx.fillStyle = "#d4af37";
      ctx.fill();
      ctx.restore();
    };

    drawCorner(50, 50, 0);
    drawCorner(canvas.width - 50, 50, Math.PI / 2);
    drawCorner(canvas.width - 50, canvas.height - 50, Math.PI);
    drawCorner(50, canvas.height - 50, (Math.PI * 3) / 2);

    // Bismillah Arabic script
    ctx.fillStyle = "#e5c158";
    ctx.textAlign = "center";
    ctx.font = "bold 32px 'Georgia', serif";
    ctx.fillText("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", canvas.width / 2, 130);

    // Welcome line
    ctx.fillStyle = "#fcf9f2";
    ctx.font = "italic 20px 'Georgia', serif";
    ctx.fillText("Together with their families", canvas.width / 2, 220);

    // Family names
    ctx.fillStyle = "#e5c158";
    ctx.font = "600 28px 'Georgia', serif";
    const groomFam = formData.groomFamily ? `${formData.groomFamily} Family` : "Groom's Family";
    const brideFam = formData.brideFamily ? `${formData.brideFamily} Family` : "Bride's Family";
    ctx.fillText(`${groomFam}  &  ${brideFam}`, canvas.width / 2, 280);

    // Invitation request text
    ctx.fillStyle = "#fcf9f2";
    ctx.font = "18px 'Georgia', serif";
    ctx.fillText("request the honor of your presence to celebrate the", canvas.width / 2, 360);
    ctx.fillText(formData.eventName || "Wedding Ceremony", canvas.width / 2, 400);
    ctx.fillText("of their beloved children", canvas.width / 2, 440);

    // Groom's Name
    ctx.fillStyle = "#e5c158";
    ctx.font = "italic 600 56px 'Georgia', serif";
    ctx.fillText(formData.groomName || "Haris", canvas.width / 2, 540);

    // Ampersand symbol
    ctx.fillStyle = "#fcf9f2";
    ctx.font = "italic 32px 'Georgia', serif";
    ctx.fillText("&", canvas.width / 2, 610);

    // Bride's Name
    ctx.fillStyle = "#e5c158";
    ctx.font = "italic 600 56px 'Georgia', serif";
    ctx.fillText(formData.brideName || "Sana", canvas.width / 2, 690);

    // Date
    ctx.fillStyle = "#fcf9f2";
    ctx.font = "600 24px 'Georgia', serif";
    const dateStr = formData.eventDate 
      ? new Date(formData.eventDate).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      : "Monday, June 15, 2026";
    ctx.fillText(dateStr, canvas.width / 2, 800);

    // Time
    ctx.font = "20px 'Georgia', serif";
    ctx.fillText(`at ${formatTime(formData.eventTime)}`, canvas.width / 2, 850);

    // Venue/Location
    ctx.fillStyle = "#e5c158";
    ctx.font = "italic 22px 'Georgia', serif";
    const locLines = (formData.eventLocation || "Mansion Marquee, Clifton, Karachi").split(",");
    let yPos = 930;
    locLines.forEach(line => {
      ctx.fillText(line.trim(), canvas.width / 2, yPos);
      yPos += 35;
    });

    // Branding RSVP
    ctx.fillStyle = "rgba(252, 249, 242, 0.4)";
    ctx.font = "14px 'Georgia', serif";
    ctx.fillText("R.S.V.P — Mehfil-e-Ishq Weddings", canvas.width / 2, 1110);

    // Generate link & trigger download
    const link = document.createElement("a");
    link.download = `invitation_${formData.groomName || "haris"}_and_${formData.brideName || "sana"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("Premium Invitation Card downloaded successfully!");
  };

  return (
    <section className="section-padding bg-noir">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">
            Guest Management
          </p>
          <h2 className="font-heading text-3xl md:text-5xl text-ivory font-bold mb-4">
            Invitation & RSVP System
          </h2>
          <div className="gold-divider" />
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 justify-center flex-wrap">
          {(["create", "manage", "track"] as const).map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg font-body capitalize transition-all ${
                activeTab === tab
                  ? "bg-gold text-noir font-semibold"
                  : "bg-ivory/10 text-ivory/70 hover:bg-ivory/20"
              }`}
            >
              {tab === "create" ? "Design Card & Invite" : tab}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {/* Create Tab */}
          {activeTab === "create" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Form Input Panel */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-6 glass rounded-2xl p-6 md:p-8 space-y-4"
              >
                <h3 className="font-heading text-2xl text-gold mb-4 border-b border-gold/10 pb-2">
                  Invitation Details
                </h3>
                <div className="space-y-4">
                  {/* Event Type / Name */}
                  <div>
                    <label className="block text-ivory/70 text-sm mb-1">Event Type *</label>
                    <select
                      value={formData.eventName}
                      onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-noir/50 border border-gold/20 text-ivory focus:outline-none focus:ring-2 focus:ring-gold/50"
                    >
                      <option value="Wedding Ceremony">Wedding Ceremony</option>
                      <option value="Nikkah Ceremony">Nikkah Ceremony</option>
                      <option value="Mehndi Ceremony">Mehndi Ceremony</option>
                      <option value="Baraat & Walima">Baraat & Walima</option>
                    </select>
                  </div>

                  {/* Groom's details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-ivory/70 text-sm mb-1">Groom's Name *</label>
                      <input
                        type="text"
                        value={formData.groomName}
                        onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                        placeholder="e.g. Haris"
                        className="w-full px-4 py-3 rounded-lg bg-noir/50 border border-gold/20 text-ivory placeholder:text-ivory/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
                      />
                    </div>
                    <div>
                      <label className="block text-ivory/70 text-sm mb-1">Groom's Family Name *</label>
                      <input
                        type="text"
                        value={formData.groomFamily}
                        onChange={(e) => setFormData({ ...formData, groomFamily: e.target.value })}
                        placeholder="e.g. Khan"
                        className="w-full px-4 py-3 rounded-lg bg-noir/50 border border-gold/20 text-ivory placeholder:text-ivory/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
                      />
                    </div>
                  </div>

                  {/* Bride's details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-ivory/70 text-sm mb-1">Bride's Name *</label>
                      <input
                        type="text"
                        value={formData.brideName}
                        onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                        placeholder="e.g. Sana"
                        className="w-full px-4 py-3 rounded-lg bg-noir/50 border border-gold/20 text-ivory placeholder:text-ivory/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
                      />
                    </div>
                    <div>
                      <label className="block text-ivory/70 text-sm mb-1">Bride's Family Name *</label>
                      <input
                        type="text"
                        value={formData.brideFamily}
                        onChange={(e) => setFormData({ ...formData, brideFamily: e.target.value })}
                        placeholder="e.g. Ahmed"
                        className="w-full px-4 py-3 rounded-lg bg-noir/50 border border-gold/20 text-ivory placeholder:text-ivory/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
                      />
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-ivory/70 text-sm mb-1">Event Date *</label>
                      <input
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-noir/50 border border-gold/20 text-ivory focus:outline-none focus:ring-2 focus:ring-gold/50"
                      />
                    </div>
                    <div>
                      <label className="block text-ivory/70 text-sm mb-1">Event Time</label>
                      <input
                        type="time"
                        value={formData.eventTime}
                        onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg bg-noir/50 border border-gold/20 text-ivory focus:outline-none focus:ring-2 focus:ring-gold/50"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-ivory/70 text-sm mb-1">Event Location *</label>
                    <input
                      type="text"
                      value={formData.eventLocation}
                      onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                      placeholder="e.g. Mansion Marquee, Clifton, Karachi"
                      className="w-full px-4 py-3 rounded-lg bg-noir/50 border border-gold/20 text-ivory placeholder:text-ivory/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={downloadInvitationCard}
                      className="flex-1 py-3 bg-transparent border-2 border-gold text-gold font-semibold rounded-lg hover:bg-gold hover:text-noir transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Download size={18} /> Download Invitation Card
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCreateInvitation}
                      className="btn-luxury flex-1 flex items-center justify-center gap-2"
                    >
                      <Send size={18} /> Activate RSVP Link
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Gold Live Preview Card Panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-6 flex flex-col items-center justify-center"
              >
                <p className="text-gold font-heading text-xs tracking-wider mb-2 uppercase">Live Premium Card Preview</p>
                <div className="w-[380px] h-[570px] bg-[#1e0205] border-[4px] border-[#e5c158] rounded-xl relative p-6 shadow-2xl flex flex-col justify-between items-center text-center overflow-hidden">
                  {/* Subtle ornate gold border inner ring */}
                  <div className="absolute inset-2 border border-[#d4af37]/40 pointer-events-none rounded-lg" />
                  
                  {/* Ornamental corners */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-gold" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-gold" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-gold" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-gold" />

                  {/* Header */}
                  <div className="mt-4">
                    <p className="text-gold font-heading text-lg font-bold select-none leading-none">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                    <p className="text-ivory/60 font-body text-xs italic mt-4">Together with their families</p>
                    <p className="text-gold font-heading text-sm font-semibold tracking-wide mt-2">
                      {formData.groomFamily ? `${formData.groomFamily} Family` : "Groom's Family"} &amp; {formData.brideFamily ? `${formData.brideFamily} Family` : "Bride's Family"}
                    </p>
                  </div>

                  {/* Body */}
                  <div className="my-2">
                    <p className="text-ivory/70 font-body text-[11px]">request the honor of your presence to celebrate the</p>
                    <p className="text-gold font-heading text-sm font-bold tracking-wide mt-1 uppercase">{formData.eventName || "Wedding Ceremony"}</p>
                    <p className="text-ivory/70 font-body text-[11px] mt-1">of their beloved children</p>
                    
                    <p className="text-gold font-heading text-3xl font-bold italic mt-4 tracking-wide leading-none">{formData.groomName || "Haris"}</p>
                    <p className="text-ivory font-body text-md italic my-1">&amp;</p>
                    <p className="text-gold font-heading text-3xl font-bold italic tracking-wide leading-none">{formData.brideName || "Sana"}</p>
                  </div>

                  {/* Date & Location */}
                  <div className="mb-4">
                    <p className="text-ivory font-heading text-xs font-semibold uppercase tracking-widest border-t border-b border-gold/20 py-1">
                      {formData.eventDate 
                        ? new Date(formData.eventDate).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                        : "Monday, June 15, 2026"}
                    </p>
                    <p className="text-ivory/80 font-body text-xs mt-1">at {formatTime(formData.eventTime)}</p>
                    <p className="text-gold font-body text-[11px] italic mt-3 max-w-[280px] truncate-3-lines leading-snug">
                      {formData.eventLocation || "Mansion Marquee, Clifton, Karachi"}
                    </p>
                  </div>

                  {/* Footer RSVP */}
                  <div className="mb-2">
                    <p className="text-ivory/30 font-body text-[9px] uppercase tracking-wider">R.S.V.P — Mehfil-e-Ishq Weddings</p>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Manage Tab */}
          {activeTab === "manage" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 max-w-4xl mx-auto"
            >
              {invitations.map((invitation, idx) => (
                <motion.div
                  key={invitation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass rounded-2xl p-8"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-gold/20 text-gold px-2.5 py-1 rounded text-xs uppercase font-heading tracking-wider">
                          {invitation.eventName}
                        </span>
                      </div>
                      <h3 className="font-heading text-2xl text-ivory font-bold mb-3">
                        {invitation.groomName} &amp; {invitation.brideName}'s Wedding
                      </h3>
                      <div className="space-y-1.5 text-ivory/60 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gold" />
                          {new Date(invitation.eventDate).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-gold" />
                          {invitation.eventTime}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-gold" />
                          {invitation.eventLocation}
                        </div>
                      </div>
                    </div>
                    <QrCode size={40} className="text-gold/40" />
                  </div>

                  {/* Sharing Options */}
                  <div className="bg-noir/30 rounded-lg p-4 mb-6 border border-gold/10">
                    <p className="text-ivory/70 text-sm mb-3">RSVP Invitation Link:</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={invitation.invitationLink}
                        readOnly
                        className="flex-1 px-4 py-2 rounded-lg bg-noir/50 border border-gold/20 text-ivory/70 text-sm focus:outline-none"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyToClipboard(invitation.invitationLink)}
                        className="px-4 py-2 rounded-lg bg-gold/20 text-gold hover:bg-gold/30 transition-colors"
                        title="Copy link"
                      >
                        <Copy size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          toast.success("Shared successfully!");
                        }}
                        className="px-4 py-2 rounded-lg bg-gold/20 text-gold hover:bg-gold/30 transition-colors"
                        title="Share invitation"
                      >
                        <Share2 size={18} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-noir/30 rounded-lg p-4 text-center border border-gold/5">
                      <p className="text-gold text-2xl font-bold">
                        {invitation.totalInvited}
                      </p>
                      <p className="text-ivory/60 text-xs mt-1">Total Invited</p>
                    </div>
                    <div className="bg-emerald-500/10 rounded-lg p-4 text-center border border-emerald-500/10">
                      <p className="text-emerald-400 text-2xl font-bold">
                        {invitation.acceptedCount}
                      </p>
                      <p className="text-ivory/60 text-xs mt-1">Accepted</p>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-4 text-center border border-red-500/10">
                      <p className="text-red-400 text-2xl font-bold">
                        {invitation.declinedCount}
                      </p>
                      <p className="text-ivory/60 text-xs mt-1">Declined</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Track Tab */}
          {activeTab === "track" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 max-w-4xl mx-auto"
            >
              {invitations.map((invitation) => (
                <motion.div
                  key={invitation.id}
                  className="glass rounded-2xl p-8"
                >
                  <h3 className="font-heading text-xl text-ivory mb-6 font-bold border-b border-gold/10 pb-2">
                    {invitation.groomName} &amp; {invitation.brideName}'s Guest List
                  </h3>
                  <div className="space-y-3">
                    {invitation.guests.length === 0 ? (
                      <div className="text-center py-8 text-ivory/40">No RSVPs received yet for this card.</div>
                    ) : invitation.guests.map((guest) => (
                      <div
                        key={guest.id}
                        className="flex items-center justify-between p-4 bg-noir/30 rounded-lg border border-gold/5"
                      >
                        <div className="flex-1">
                          <p className="text-ivory font-body font-medium">
                            {guest.name}
                          </p>
                          <p className="text-ivory/50 text-xs">{guest.email}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-xs font-body px-3 py-1 rounded-full ${
                              guest.status === "accepted"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : guest.status === "declined"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-amber-500/20 text-amber-400"
                            }`}
                          >
                            {guest.status}
                          </span>
                          {guest.status === "pending" && (
                            <div className="flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleRSVP(invitation.id, guest.id, "accepted")}
                                className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                              >
                                <Check size={14} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleRSVP(invitation.id, guest.id, "declined")}
                                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                              >
                                <X size={14} />
                              </motion.button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GuestInvitationSystem;
