import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import logo from "@/assets/logo.png";

const Login = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", fullName: "", phone: "" });

  useEffect(() => {
    if (user) {
      navigate(isAdmin ? "/admin" : "/dashboard");
    }
  }, [user, isAdmin, navigate]);

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: form.fullName, phone: form.phone },
          },
        });
        if (error) throw error;
        toast.success("Account created! Please check your email to verify.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!form.email) { toast.error("Please enter your email first"); return; }
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset link sent to your email");
  };

  const inputClass = "w-full pl-10 pr-4 py-3 rounded-lg bg-ivory/5 border border-gold/20 text-ivory font-body placeholder:text-ivory/30 focus:outline-none focus:border-gold/50 transition-colors";

  return (
    <div className="min-h-screen bg-noir">
      <Navbar />
      <div className="pt-28 pb-20 px-4 flex items-center justify-center min-h-screen">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src={logo} alt="Mehfil-e-Ishq" className="h-16 w-auto mx-auto mb-4" />
            <h1 className="font-heading text-3xl text-ivory font-bold">{isSignup ? "Create Account" : "Welcome Back"}</h1>
            <p className="text-ivory/50 font-body text-sm mt-2">{isSignup ? "Join Mehfil-e-Ishq for a premium experience" : "Sign in to manage your events"}</p>
          </div>

          <div className="glass rounded-2xl p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignup && (
                <>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40" size={18} />
                    <input type="text" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Full Name" required className={inputClass} />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40" size={18} />
                    <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Phone Number" className={inputClass} />
                  </div>
                </>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40" size={18} />
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="Email Address" required className={inputClass} />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/40" size={18} />
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Password" required minLength={6} className={inputClass + " pr-12 [&::-ms-reveal]:hidden [&::-webkit-reveal]:hidden"} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/40 hover:text-ivory/70">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {!isSignup && (
                <div className="text-right">
                  <button type="button" onClick={handleForgotPassword} className="text-gold/70 hover:text-gold text-sm font-body transition-colors">Forgot Password?</button>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-luxury w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {loading && <Loader2 className="animate-spin" size={18} />}
                {isSignup ? "Create Account" : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-ivory/40 text-sm font-body">
                {isSignup ? "Already have an account?" : "Don't have an account?"}
                <button onClick={() => setIsSignup(!isSignup)} className="text-gold ml-2 hover:text-gold-light transition-colors">
                  {isSignup ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
