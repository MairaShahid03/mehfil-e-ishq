import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import WhatsAppButton from "@/components/WhatsAppButton";

const Booking = () => (
  <div className="min-h-screen bg-noir">
    <Navbar />
    <div className="pt-28 pb-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <p className="text-gold font-heading text-sm tracking-[0.3em] uppercase mb-3">Book Your Event</p>
          <h1 className="font-heading text-3xl md:text-5xl text-ivory font-bold mb-4">
            Let's Create Something Beautiful
          </h1>
          <div className="gold-divider" />
        </div>
        <BookingForm />
      </div>
    </div>
    <Footer />
    <WhatsAppButton />
  </div>
);

export default Booking;
