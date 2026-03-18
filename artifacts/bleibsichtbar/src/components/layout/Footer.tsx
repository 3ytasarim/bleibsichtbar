import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Instagram, Facebook, Linkedin, Mail, Music2 } from "lucide-react";

const TICKER_ITEMS = Array(16).fill(null);

export function Footer() {
  return (
    <footer className="bg-primary text-white overflow-hidden">

      {/* ── Scrolling Ticker ── */}
      <div className="relative overflow-hidden border-y border-white/[0.06]"
        style={{ background: "rgba(0,0,0,0.2)", paddingTop: "18px", paddingBottom: "18px" }}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, ease: "linear", repeat: Infinity }}
          className="flex whitespace-nowrap select-none"
        >
          {TICKER_ITEMS.map((_, i) => (
            <span key={i} className="inline-flex items-center shrink-0">
              <span
                className="font-display font-black uppercase tracking-widest text-white/80"
                style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)", letterSpacing: "0.12em" }}
              >
                BLEIBSICHTBAR.COM
              </span>
              <span
                className="font-display font-black text-white/25 mx-8"
                style={{ fontSize: "clamp(1rem, 1.8vw, 1.3rem)" }}
              >
                –
              </span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Main Footer Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

          {/* Brand Column */}
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3 mb-7 group">
              <div className="w-10 h-10 bg-accent text-white rounded-xl flex items-center justify-center font-display font-bold text-xl shadow-lg shadow-accent/30 group-hover:scale-105 transition-transform">
                B
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                Bleibsichtbar<span className="text-accent">.</span>
              </span>
            </Link>
            <p className="text-white/50 max-w-xs mb-8 leading-relaxed text-sm">
              Ihre professionelle Social Media Agentur für nachhaltige digitale Sichtbarkeit. Wir bringen Ihre Marke genau dorthin, wo Ihre Kunden sind.
            </p>
            {/* Social icons */}
            <div className="flex gap-3">
              {[
                { icon: <Instagram className="w-4 h-4" />, href: "https://www.instagram.com/bleibsichtbar/" },
                { icon: <Music2 className="w-4 h-4" />, href: "#" },
                { icon: <Facebook className="w-4 h-4" />, href: "#" },
                { icon: <Linkedin className="w-4 h-4" />, href: "#" },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:bg-accent hover:text-white transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Leistungen Column */}
          <div className="md:col-span-3 md:col-start-6">
            <h4 className="text-xs font-bold tracking-widest uppercase text-white/30 mb-6">Leistungen</h4>
            <ul className="space-y-3.5">
              {[
                { label: "Social Media Management", href: "/social-media" },
                { label: "Webseiten & Design", href: "/webseiten" },
                { label: "Marketing Ads", href: "/marketing-ads" },
                { label: "KI & Automatisierungen", href: "/ki-automatisierungen" },
                { label: "Analyse & Strategie", href: "/analyse" },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-white/55 hover:text-accent transition-colors text-sm font-medium">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontakt & Rechtliches Column */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-bold tracking-widest uppercase text-white/30 mb-6">Kontakt</h4>
            <ul className="space-y-3.5 mb-10">
              <li>
                <a href="mailto:info@bleibsichtbar.com"
                  className="flex items-center gap-2.5 text-white/55 hover:text-accent transition-colors text-sm font-medium">
                  <Mail className="w-3.5 h-3.5 text-accent shrink-0" />
                  info@bleibsichtbar.com
                </a>
              </li>
              <li>
                <Link href="/kontakt" className="text-white/55 hover:text-accent transition-colors text-sm font-medium">
                  Kontaktformular
                </Link>
              </li>
              <li>
                <Link href="/projekte" className="text-white/55 hover:text-accent transition-colors text-sm font-medium">
                  Projekte
                </Link>
              </li>
            </ul>

            <h4 className="text-xs font-bold tracking-widest uppercase text-white/30 mb-6">Rechtliches</h4>
            <ul className="space-y-3.5">
              {[
                { label: "Impressum", href: "/impressum" },
                { label: "Datenschutz", href: "/datenschutz" },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-white/55 hover:text-accent transition-colors text-sm font-medium">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} Bleibsichtbar. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/impressum" className="text-white/25 text-xs hover:text-accent/80 transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="text-white/25 text-xs hover:text-accent/80 transition-colors">Datenschutz</Link>
            <Link href="/admin/login" className="text-white/15 text-xs hover:text-white/40 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
