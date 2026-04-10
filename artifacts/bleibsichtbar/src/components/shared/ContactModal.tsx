import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, CheckCircle2, Loader2, Instagram, Globe, Megaphone, AlertCircle, Zap } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitContact } from "@workspace/api-client-react";

const schema = z.object({
  name: z.string().min(2, "Name erforderlich"),
  email: z.string().email("Ungültige E-Mail"),
  message: z.string().min(5, "Nachricht erforderlich"),
});
type FormValues = z.infer<typeof schema>;

const SERVICES = [
  {
    id: "social-media",
    label: "Social Media",
    icon: Instagram,
    color: "#E1306C",
    glow: "rgba(225,48,108,0.18)",
    desc: "Instagram, TikTok, LinkedIn",
  },
  {
    id: "webseiten",
    label: "Webseiten",
    icon: Globe,
    color: "#3B82F6",
    glow: "rgba(59,130,246,0.18)",
    desc: "Design & Entwicklung",
  },
  {
    id: "marketing-ads",
    label: "Marketing Ads",
    icon: Megaphone,
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.18)",
    desc: "Google & Meta Ads",
  },
  {
    id: "ki-automatisierung",
    label: "KI & Automatisierung",
    icon: Zap,
    color: "#8B5CF6",
    glow: "rgba(139,92,246,0.18)",
    desc: "Workflows & KI-Tools",
  },
];

const inputBase: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1.5px solid rgba(255,255,255,0.08)",
  transition: "border-color 0.2s, box-shadow 0.2s",
};
const inputFocus = {
  borderColor: "rgba(255,107,53,0.6)",
  boxShadow: "0 0 0 3px rgba(255,107,53,0.1)",
};
const inputBlur = {
  borderColor: "rgba(255,255,255,0.08)",
  boxShadow: "none",
};

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const { mutate, isPending, isSuccess, reset: resetMutation } = useSubmitContact();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const toggleService = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const onSubmit = (data: FormValues) => {
    const service = selected.map(id => SERVICES.find(s => s.id === id)?.label).filter(Boolean).join(", ");
    mutate({ data: { ...data, phone: "", company: "", service } }, {
      onSuccess: () => { reset(); setSelected([]); }
    });
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      reset();
      setSelected([]);
      resetMutation();
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop — clicking closes modal */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100]"
            style={{ background: "rgba(5,10,22,0.82)", backdropFilter: "blur(12px)" }}
            onClick={handleClose}
          />

          {/* Modal wrapper — clicking outside closes */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[101] flex items-center justify-center px-4 py-8"
            onClick={handleClose}
          >
            {/* Modal card — stop propagation so inner clicks don't close */}
            <div
              className="relative w-full max-w-xl"
              style={{
                background: "linear-gradient(145deg, #0c1a36 0%, #0e2050 100%)",
                borderRadius: "28px",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset",
                maxHeight: "92vh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Decorative orbs */}
              <div
                className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)" }}
              />
              <div
                className="pointer-events-none absolute -bottom-16 -left-16 w-48 h-48 rounded-full"
                style={{ background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)" }}
              />

              {/* Close button — fixed inside card, above scrollable area */}
              <button
                type="button"
                onClick={handleClose}
                className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable content area */}
              <div
                className="relative z-10 flex-1 overflow-y-auto px-7 pt-8 pb-8"
                style={{ scrollbarWidth: "none" } as React.CSSProperties}
              >
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-10 gap-5"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.1 }}
                    >
                      <CheckCircle2 className="w-20 h-20 text-accent" />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                      <h3 className="text-2xl font-display font-black text-white mb-2">Anfrage gesendet!</h3>
                      <p className="text-white/55 text-sm max-w-xs mx-auto">
                        Wir melden uns innerhalb von 24 Stunden bei Ihnen. Kostenlos &amp; unverbindlich.
                      </p>
                    </motion.div>
                    <motion.button
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                      onClick={handleClose}
                      className="mt-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition-all"
                    >
                      Schließen
                    </motion.button>
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.05 }}
                      className="mb-7"
                    >
                      <p className="text-xs font-bold tracking-widest uppercase text-accent/80 mb-2">
                        // Kostenloses Angebot
                      </p>
                      <h2 className="font-display font-black text-white text-2xl leading-snug">
                        Welche Leistung interessiert Sie?
                      </h2>
                      <p className="text-white/45 text-sm mt-1.5">Wählen Sie eine oder mehrere Optionen</p>
                    </motion.div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
                      {SERVICES.map((svc, i) => {
                        const Icon = svc.icon;
                        const isActive = selected.includes(svc.id);
                        return (
                          <motion.button
                            key={svc.id}
                            type="button"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => toggleService(svc.id)}
                            className="relative flex flex-col items-center gap-2.5 p-4 rounded-2xl text-center transition-all duration-200 overflow-hidden"
                            style={{
                              background: isActive
                                ? `linear-gradient(135deg, ${svc.glow.replace("0.18", "0.35")}, ${svc.glow})`
                                : "rgba(255,255,255,0.04)",
                              border: `1.5px solid ${isActive ? svc.color + "55" : "rgba(255,255,255,0.07)"}`,
                              boxShadow: isActive ? `0 4px 20px ${svc.glow}` : "none",
                            }}
                          >
                            <AnimatePresence>
                              {isActive && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                  className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                                  style={{ background: svc.color }}
                                >
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </motion.div>
                              )}
                            </AnimatePresence>
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center"
                              style={{ background: `linear-gradient(135deg, ${svc.color}33, ${svc.color}18)`, border: `1px solid ${svc.color}30` }}
                            >
                              <Icon className="w-5 h-5" style={{ color: svc.color }} />
                            </div>
                            <div>
                              <p className="text-white font-semibold text-xs leading-tight">{svc.label}</p>
                              <p className="text-white/35 text-[10px] mt-0.5 leading-tight">{svc.desc}</p>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.32 }}>
                        <input
                          {...register("name")}
                          placeholder="Ihr Name"
                          className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                          style={inputBase}
                          onFocus={e => Object.assign(e.target.style, inputFocus)}
                          onBlur={e => Object.assign(e.target.style, inputBlur)}
                        />
                        {errors.name && (
                          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                            className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.name.message}</span>
                          </motion.div>
                        )}
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.38 }}>
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="Ihre E-Mail-Adresse"
                          className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                          style={inputBase}
                          onFocus={e => Object.assign(e.target.style, inputFocus)}
                          onBlur={e => Object.assign(e.target.style, inputBlur)}
                        />
                        {errors.email && (
                          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                            className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.email.message}</span>
                          </motion.div>
                        )}
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.44 }}>
                        <textarea
                          {...register("message")}
                          placeholder="Kurze Beschreibung Ihres Projekts…"
                          rows={3}
                          className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-white/30 outline-none resize-none"
                          style={inputBase}
                          onFocus={e => Object.assign(e.target.style, inputFocus)}
                          onBlur={e => Object.assign(e.target.style, inputBlur)}
                        />
                        {errors.message && (
                          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                            className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{errors.message.message}</span>
                          </motion.div>
                        )}
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
                        <motion.button
                          type="submit"
                          disabled={isPending}
                          whileHover={{ scale: 1.02, boxShadow: "0 10px 32px rgba(255,107,53,0.4)" }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold text-sm text-white disabled:opacity-60"
                          style={{ background: "linear-gradient(135deg, #ff6b35 0%, #e8522a 100%)" }}
                        >
                          {isPending ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Wird gesendet…</>
                          ) : (
                            <>Kostenlos Anfragen <ArrowRight className="w-4 h-4" /></>
                          )}
                        </motion.button>
                        <p className="text-center text-white/25 text-xs mt-3">
                          100% kostenlos &amp; unverbindlich · Antwort innerhalb 24h
                        </p>
                      </motion.div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
