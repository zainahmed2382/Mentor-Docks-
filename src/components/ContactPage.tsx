import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Send, CheckCircle2, MessageSquare, ArrowRight, Sparkles, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please provide a valid email address";
    }
    if (formData.website.trim() && !/^https?:\/\//i.test(formData.website) && !/\.[a-z]{2,}/i.test(formData.website)) {
      newErrors.website = "Please provide a valid website domain link";
    }
    if (!formData.message.trim()) newErrors.message = "Message text is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: "", email: "", website: "", message: "" });
    }, 1500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-16 pt-10 pb-20 font-sans flex flex-col gap-10">
      {/* Page Header */}
      <div className="border-b border-gray-200/60 dark:border-slate-800/60 pb-6">
        <h1 className="font-display text-3xl font-extrabold text-[#1A1A1A] dark:text-[#E2E8F0] tracking-tight flex items-center gap-2">
          <Mail className="h-7 w-7 text-indigo-600 dark:text-indigo-400" /> Get in Touch
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
          Have ideas, customization requests, or custom crawler inquiries? We'd love to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Card: Info panel */}
        <div className="lg:col-span-5 bg-indigo-900 dark:bg-indigo-950/60 text-white rounded-[40px] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden shadow-lg">
          {/* Ambient light effects */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center gap-2 bg-white/10 border border-white/10 px-3.5 py-1.5 rounded-full w-fit">
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
              <span className="text-[10px] font-sans font-bold tracking-wider uppercase text-indigo-200">
                Support & Inquiries
              </span>
            </div>

            <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
              We help developers fix layout flaws.
            </h2>
            <p className="text-xs md:text-sm text-indigo-200 leading-relaxed font-semibold">
              Have feedback on our audit metrics? Need customized web scraping setups for legacy WordPress or Shopify backends? Our design mentors are ready to respond to your queries.
            </p>
          </div>

          <div className="flex flex-col gap-5 mt-10 relative z-10 border-t border-white/10 pt-8">
            <div className="flex gap-4 items-center">
              <div className="p-2.5 bg-white/10 rounded-xl text-indigo-300 shrink-0">
                <Phone className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] text-indigo-200 font-bold uppercase block">Support hotline</span>
                <span className="text-xs font-mono font-bold">+1 (800) DESIGN-AIDE</span>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="p-2.5 bg-white/10 rounded-xl text-indigo-300 shrink-0">
                <Mail className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] text-indigo-200 font-bold uppercase block">Direct Email</span>
                <span className="text-xs font-mono font-bold">mentors@aidesignmentor.com</span>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="p-2.5 bg-white/10 rounded-xl text-indigo-300 shrink-0">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[10px] text-indigo-200 font-bold uppercase block">HQ Campus</span>
                <span className="text-xs font-bold text-white leading-tight">Silicon Valley, CA</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Form submission */}
        <div className="lg:col-span-7 bg-white dark:bg-[#131520] border border-gray-200 dark:border-slate-800 rounded-[40px] p-6 md:p-10 shadow-sm flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form
                key="contact-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col gap-5"
              >
                <div className="flex flex-col md:flex-row gap-5">
                  {/* Name field */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className={`w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border text-sm text-[#1A1A1A] dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/40 transition-all ${
                        errors.name ? "border-rose-300 focus:ring-rose-50" : "border-gray-200/80 dark:border-slate-800/80 focus:border-indigo-500"
                      }`}
                    />
                    {errors.name && (
                      <span className="text-[11px] text-rose-600 font-semibold">{errors.name}</span>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@website.com"
                      className={`w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border text-sm text-[#1A1A1A] dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/40 transition-all ${
                        errors.email ? "border-rose-300 focus:ring-rose-50" : "border-gray-200/80 dark:border-slate-800/80 focus:border-indigo-500"
                      }`}
                    />
                    {errors.email && (
                      <span className="text-[11px] text-rose-600 font-semibold">{errors.email}</span>
                    )}
                  </div>
                </div>

                {/* Website URL (optional) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                    Your Website URL <span className="text-[10px] text-gray-400 dark:text-gray-500 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com"
                    className={`w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border text-sm text-[#1A1A1A] dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/40 transition-all ${
                      errors.website ? "border-rose-300 focus:ring-rose-50" : "border-gray-200/80 dark:border-slate-800/80 focus:border-indigo-500"
                    }`}
                  />
                  {errors.website && (
                    <span className="text-[11px] text-rose-600 font-semibold">{errors.website}</span>
                  )}
                </div>

                {/* Message block */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your design questions or platform feedback..."
                    className={`w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border text-sm text-[#1A1A1A] dark:text-slate-100 outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/40 transition-all resize-none ${
                      errors.message ? "border-rose-300 focus:ring-rose-50" : "border-gray-200/80 dark:border-slate-800/80 focus:border-indigo-500"
                    }`}
                  />
                  {errors.message && (
                    <span className="text-[11px] text-rose-600 font-semibold">{errors.message}</span>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-sans font-bold text-sm py-4 px-6 rounded-2xl cursor-pointer shadow-sm hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Transmit Message</span>
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="contact-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-6"
              >
                <div className="h-16 w-16 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-full flex items-center justify-center text-emerald-500 shadow-md mb-5">
                  <CheckCircle2 className="h-8 w-8" />
                </div>

                <h3 className="font-display text-2xl font-extrabold text-[#1A1A1A] dark:text-slate-100 tracking-tight">
                  Transmission Succeeded!
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-sm leading-relaxed">
                  Thank you for reaching out. A Design Mentor from our core engineering team will contact you shortly.
                </p>

                <button
                  onClick={() => setIsSuccess(false)}
                  className="mt-8 px-6 py-2.5 rounded-2xl bg-gray-100 dark:bg-slate-800 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-[#1A1A1A] dark:text-slate-100 hover:text-white text-xs font-bold transition-all cursor-pointer shadow-sm flex items-center gap-2"
                >
                  <span>Compose Another Message</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
