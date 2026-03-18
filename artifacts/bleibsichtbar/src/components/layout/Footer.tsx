import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Instagram, Mail, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitContact } from "@workspace/api-client-react";

const TICKER_ITEMS = Array(14).fill(null);

const schema = z.object({
  name: z.string().min(2, "Name erforderlich"),
  email: z.string().email("Ungültige E-Mail"),
  message: z.string().min(5, "Nachricht erforderlich"),
});
type FormValues = z.infer<typeof schema>;

function FooterContactForm() {
  const { mutate, isPending, isSuccess } = useSubmitContact();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const onSubmit = (data: FormValues) => {
    mutate({ data: { ...data, phone: "", company: "", service: "" } }, { onSuccess: () => reset() });
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <CheckCircle2 className="w-14 h-14 text-accent" />
        <h3 className="text-2xl font-display font-bold text-white">Vielen Dank!</h3>
        <p className="text-white/60 max-w-sm">Wir melden uns in Kürze bei Ihnen.</p>
        <button onClick={() => reset()} className="mt-4 text-sm text-accent hover:text-white transition-colors">
          Weitere Nachricht senden
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {/* Anfrage */}
      <div>
        <input
          {...register("name")}
          placeholder="Anfrage"
          className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          onFocus={e => (e.target.style.borderColor = "rgba(255,107,53,0.5)")}
          onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
        />
        {errors.name && <p className="text-red-400 text-xs mt-1 pl-1">{errors.name.message}</p>}
      </div>

      {/* E-Mail */}
      <div>
        <input
          {...register("email")}
          type="email"
          placeholder="E-Mail"
          className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-white/30 outline-none transition-all"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          onFocus={e => (e.target.style.borderColor = "rgba(255,107,53,0.5)")}
          onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
        />
        {errors.email && <p className="text-red-400 text-xs mt-1 pl-1">{errors.email.message}</p>}
      </div>

      {/* Nachricht */}
      <div>
        <textarea
          {...register("message")}
          placeholder="Nachricht"
          rows={4}
          className="w-full px-4 py-3.5 rounded-xl text-sm text-white placeholder-white/30 outline-none resize-none transition-all"
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          onFocus={e => (e.target.style.borderColor = "rgba(255,107,53,0.5)")}
          onBlur={e => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
        />
        {errors.message && <p className="text-red-400 text-xs mt-1 pl-1">{errors.message.message}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 mt-1"
        style={{ background: "linear-gradient(135deg, #ff6b35, #e85d2c)" }}
      >
        {isPending ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Wird gesendet…</>
        ) : (
          <>Kostenlos Anfragen <ArrowRight className="w-4 h-4" /></>
        )}
      </button>
    </form>
  );
}

export function Footer() {
  return (
    <div className="bg-white">
      <footer
        className="text-white overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #0a1628 0%, #0e2050 55%, #0a1628 100%)",
          borderRadius: "32px 32px 0 0",
        }}
      >

        {/* ═══════════════════════════════════════════
            CONTACT SECTION (top of footer)
        ════════════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-14 border-b border-white/[0.06]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Left — Heading + description */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-accent/80 mb-5">
                // Kontakt
              </p>
              <h2
                className="font-display font-black text-white leading-tight mb-5"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3.4rem)" }}
              >
                Lassen Sie uns<br />
                <em className="not-italic text-accent">über</em> Ihr Projekt<br />
                sprechen
              </h2>
              <p className="text-white/50 text-sm leading-relaxed max-w-sm">
                Ob neue Website, mehr Sichtbarkeit oder KI-Automatisierung — wir beraten Sie ehrlich und zeigen Ihnen, wie Ihr Unternehmen endlich sinnvoll ist. Kostenlos &amp; unverbindlich.
              </p>
            </div>

            {/* Right — Form */}
            <div>
              <FooterContactForm />
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            SCROLLING TICKER
        ════════════════════════════════════════════ */}
        <div
          className="overflow-hidden border-b border-white/[0.06]"
          style={{ paddingTop: "18px", paddingBottom: "18px" }}
        >
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
            className="flex whitespace-nowrap select-none"
          >
            {TICKER_ITEMS.map((_, i) => (
              <span key={i} className="inline-flex items-center shrink-0">
                <span
                  className="font-display font-black uppercase text-white/70"
                  style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)", letterSpacing: "0.14em" }}
                >
                  BLEIBSICHTBAR.COM
                </span>
                <span
                  className="font-display font-black text-white/20 mx-10"
                  style={{ fontSize: "clamp(1rem, 1.8vw, 1.3rem)" }}
                >
                  –
                </span>
              </span>
            ))}
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════
            BOTTOM FOOTER — 3 Columns
        ════════════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 items-start pb-10 border-b border-white/[0.06]">

            {/* Col 1 — Big Statement */}
            <div>
              <h3
                className="font-display font-black text-white uppercase leading-none"
                style={{ fontSize: "clamp(1.4rem, 2.8vw, 2rem)", letterSpacing: "-0.01em", lineHeight: 1.1 }}
              >
                LASSEN SIE UNS IHR<br />
                UNTERNEHMEN<br />
                <span className="text-accent">SICHTBAR</span> MACHEN.
              </h3>
            </div>

            {/* Col 2 — Datenschutz / Impressum */}
            <div className="md:px-4">
              <ul className="space-y-3">
                {[
                  { label: "Datenschutz", href: "/datenschutz" },
                  { label: "Impressum", href: "/impressum" },
                  { label: "Social Media", href: "/social-media" },
                  { label: "Webseiten", href: "/webseiten" },
                  { label: "Marketing Ads", href: "/marketing-ads" },
                  { label: "KI & Automatisierungen", href: "/ki-automatisierungen" },
                  { label: "Analyse", href: "/analyse" },
                ].map(l => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-white/50 hover:text-white transition-colors text-sm font-medium"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Kontakt */}
            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase text-white/30 mb-5">Kontakt</h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="mailto:info@bleibsichtbar.com"
                    className="flex items-center gap-2 text-white/55 hover:text-white transition-colors text-sm font-medium"
                  >
                    <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
                    info@bleibsichtbar.com
                  </a>
                </li>
                <li>
                  <Link
                    href="/kontakt"
                    className="flex items-center gap-2 text-white/55 hover:text-white transition-colors text-sm font-medium group"
                  >
                    <span className="w-3.5 h-3.5 shrink-0 text-accent text-base leading-none">✦</span>
                    Kostenlose Erstberatung
                  </Link>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/bleibsichtbar/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/55 hover:text-white transition-colors text-sm font-medium"
                  >
                    <Instagram className="w-3.5 h-3.5 text-accent shrink-0" />
                    Folgen Sie uns auf Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-7 flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-white/25 text-xs tracking-wide">
              © Bleibsichtbar {new Date().getFullYear()}, Alle Rechte vorbehalten
            </p>
            <Link href="/admin/login" className="text-white/10 text-xs hover:text-white/30 transition-colors">
              Admin
            </Link>
          </div>
        </div>

      </footer>
    </div>
  );
}
