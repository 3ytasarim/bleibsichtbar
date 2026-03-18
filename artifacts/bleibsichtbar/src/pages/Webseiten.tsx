import React from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedHeroBackground, heroFadeUp } from "@/components/shared/AnimatedHero";
import { useGetProjects } from "@workspace/api-client-react";
import { Monitor, Zap, Smartphone, Search, Palette, RefreshCw, CheckCircle2, ArrowRight } from "lucide-react";

const WEB_RE = /websei?ten?|web.?design|e.?commerce|webseite|online.?shop|landing/i;

// ─── Infinite Code Rain Background ────────────────────────────────────────────
const CODE_BLOCKS = [
  [
    "import React, { useState } from 'react';",
    "export default function App() {",
    "  const [active, setActive] = useState(false);",
    "  return (",
    "    <main className=\"container\">",
    "      <Header title=\"Bleibsichtbar\" />",
    "      <Hero onCta={() => setActive(true)} />",
    "      <Services data={services} />",
    "    </main>",
    "  );",
    "}",
    "",
    "const services = [",
    "  { id: 1, title: 'Social Media' },",
    "  { id: 2, title: 'Webseiten' },",
    "  { id: 3, title: 'Marketing Ads' },",
    "];",
    "",
    "function Hero({ onCta }) {",
    "  return <section className=\"hero\">",
    "    <h1>Ihr digitaler Auftritt</h1>",
    "    <button onClick={onCta}>Jetzt starten</button>",
    "  </section>;",
    "}",
  ],
  [
    ".container {",
    "  max-width: 1280px;",
    "  margin: 0 auto;",
    "  padding: 0 1.5rem;",
    "}",
    ".hero {",
    "  background: linear-gradient(",
    "    135deg, #0a1628 0%, #1a3a6b 100%",
    "  );",
    "  min-height: 100vh;",
    "  display: flex;",
    "  align-items: center;",
    "}",
    ".card {",
    "  border-radius: 1.5rem;",
    "  box-shadow: 0 20px 60px rgba(0,0,0,.1);",
    "  transition: transform .3s ease;",
    "}",
    ".card:hover { transform: translateY(-8px); }",
    ".btn-primary {",
    "  background: #f97316;",
    "  border-radius: 9999px;",
    "  font-weight: 700;",
    "  padding: .75rem 2rem;",
    "}",
  ],
  [
    "const router = createBrowserRouter([",
    "  { path: '/', element: <Home /> },",
    "  { path: '/about', element: <About /> },",
    "  { path: '/contact', element: <Contact /> },",
    "]);",
    "",
    "async function fetchProjects() {",
    "  const res = await fetch('/api/projects');",
    "  return res.json();",
    "}",
    "",
    "const queryClient = new QueryClient({",
    "  defaultOptions: {",
    "    queries: { staleTime: 60_000 },",
    "  },",
    "});",
    "",
    "export function useProjects() {",
    "  return useQuery({",
    "    queryKey: ['projects'],",
    "    queryFn: fetchProjects,",
    "  });",
    "}",
  ],
  [
    "<html lang=\"de\">",
    "<head>",
    "  <meta charset=\"UTF-8\" />",
    "  <meta name=\"viewport\"",
    "    content=\"width=device-width\" />",
    "  <title>Bleibsichtbar</title>",
    "  <link rel=\"stylesheet\" href=\"/style.css\">",
    "</head>",
    "<body>",
    "  <nav class=\"navbar\">",
    "    <a href=\"/\">Bleibsichtbar</a>",
    "    <ul>",
    "      <li><a href=\"/social-media\">",
    "        Social Media</a></li>",
    "      <li><a href=\"/webseiten\">",
    "        Webseiten</a></li>",
    "    </ul>",
    "  </nav>",
    "  <main id=\"root\"></main>",
    "  <script src=\"/app.js\"></script>",
    "</body>",
    "</html>",
  ],
  [
    "import { motion } from 'framer-motion';",
    "",
    "const fadeUp = {",
    "  hidden: { opacity: 0, y: 32 },",
    "  visible: {",
    "    opacity: 1, y: 0,",
    "    transition: { duration: 0.6 }",
    "  },",
    "};",
    "",
    "function AnimatedCard({ children }) {",
    "  return (",
    "    <motion.div",
    "      variants={fadeUp}",
    "      initial=\"hidden\"",
    "      whileInView=\"visible\"",
    "      viewport={{ once: true }}",
    "      whileHover={{ y: -8 }}",
    "      className=\"card\"",
    "    >",
    "      {children}",
    "    </motion.div>",
    "  );",
    "}",
  ],
  [
    "// Performance & SEO",
    "export const metadata = {",
    "  title: 'Bleibsichtbar | Agentur',",
    "  description: 'Ihre Agentur',",
    "  openGraph: {",
    "    type: 'website',",
    "    locale: 'de_DE',",
    "  },",
    "};",
    "",
    "const vitals = {",
    "  LCP: '0.8s',",
    "  FID: '12ms',",
    "  CLS: '0.01',",
    "  score: 98,",
    "};",
    "",
    "function optimizeImages(src) {",
    "  return src",
    "    .replace(/\\.jpg$/, '.webp')",
    "    .replace(/\\/upload\\//, '/upload/q_auto/');",
    "}",
    "",
    "export { vitals, optimizeImages };",
  ],
];

const COL_CONFIG = [
  { speed: "38s", opacity: 0.28, delay: "0s",   fontSize: "11px" },
  { speed: "52s", opacity: 0.20, delay: "-12s",  fontSize: "10px" },
  { speed: "44s", opacity: 0.32, delay: "-6s",   fontSize: "11px" },
  { speed: "60s", opacity: 0.18, delay: "-22s",  fontSize: "10px" },
  { speed: "46s", opacity: 0.26, delay: "-34s",  fontSize: "11px" },
  { speed: "55s", opacity: 0.20, delay: "-18s",  fontSize: "10px" },
];

function CodeRainBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      <div className="flex h-full w-full gap-2">
        {COL_CONFIG.map((cfg, colIdx) => {
          const block = CODE_BLOCKS[colIdx % CODE_BLOCKS.length];
          const lines = [...block, ...block, ...block, ...block];
          return (
            <div key={colIdx} className="flex-1 overflow-hidden" style={{ opacity: cfg.opacity }}>
              <div
                className="animate-code-scroll whitespace-pre font-mono"
                style={{
                  "--code-dur": cfg.speed,
                  animationDelay: cfg.delay,
                  fontSize: cfg.fontSize,
                  color: "#93c5fd",
                  lineHeight: "1.7",
                } as React.CSSProperties}
              >
                {[...lines, ...lines].map((line, i) => (
                  <div key={i} className="truncate">{line || "\u00A0"}</div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {/* Soft dark vignette – keeps text readable without killing the code */}
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(10,22,40,0.35) 0%, rgba(10,22,40,0.1) 60%, rgba(10,22,40,0.45) 100%)" }} />
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-24"
        style={{ background: "linear-gradient(to top, rgba(10,22,40,0.9), transparent)" }} />
    </div>
  );
}

function MultiDeviceShowcase({ src, alt }: { src?: string; alt: string }) {
  const img = src || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80";
  return (
    <div className="relative w-full px-2 py-4">
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-20 rounded-full blur-3xl opacity-20" style={{ background: "#f97316" }} />
      </div>

      {/* Browser window */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
        className="relative w-full rounded-xl shadow-[0_30px_80px_rgba(0,0,0,0.9)] ring-1 ring-white/10 overflow-hidden"
        style={{ background: "linear-gradient(160deg,#222 0%,#141414 100%)" }}
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-3 py-2.5" style={{ background: "#1a1a1a" }}>
          <div className="flex gap-1.5 shrink-0">
            {["#ff5f57","#ffbd2e","#28c840"].map(c => (
              <div key={c} className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: c }} />
            ))}
          </div>
          <div className="flex-1 flex items-center bg-[#2d2d2d] rounded-full h-5 px-3 gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 shrink-0" />
            <div className="flex-1 h-1 bg-[#444] rounded-full" />
          </div>
        </div>
        {/* Screenshot */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <img src={img} alt={alt} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const leistungen = [
  { icon: <Monitor className="w-6 h-6" />, title: "Webseiten-Design & Neuerstellung", desc: "Individuelle, moderne Webseiten von Grund auf – angepasst an Ihre Marke und Zielgruppe." },
  { icon: <RefreshCw className="w-6 h-6" />, title: "Optimierung bestehender Seiten", desc: "Wir analysieren Ihre bestehende Webseite und verbessern Design, Struktur und Performance." },
  { icon: <Palette className="w-6 h-6" />, title: "Struktur & Nutzerführung", desc: "Klare Seitenarchitektur, die Besucher gezielt zu Anfragen und Conversions führt." },
  { icon: <Search className="w-6 h-6" />, title: "Inhalte & visuelles Design", desc: "Überzeugende Texte, starke Bilder und ein kohärentes visuelles Erscheinungsbild." },
  { icon: <Smartphone className="w-6 h-6" />, title: "Mobile & Ladezeit-Optimierung", desc: "Vollständig mobiloptimiert und blitzschnell – für bestmögliche Nutzererfahrung." },
  { icon: <Zap className="w-6 h-6" />, title: "Laufende Betreuung", desc: "Auch nach dem Launch bleiben wir an Ihrer Seite und optimieren kontinuierlich." },
];

const steps = [
  {
    num: "1",
    title: "Analyse",
    desc: "Wir analysieren Ihr Unternehmen, Ihre Ziele und Ihre aktuelle Online-Präsenz. Darauf basierend definieren wir Struktur, Inhalte und eine klare Ausrichtung für Ihre neue Webseite.",
  },
  {
    num: "2",
    title: "Konzept",
    desc: "Wir entwickeln ein modernes Design und eine klare Seitenstruktur, abgestimmt auf Ihre Marke und Zielgruppe. So entsteht ein Auftritt, der professionell wirkt und Vertrauen schafft.",
  },
  {
    num: "3",
    title: "Umsetzung",
    desc: "Wir setzen Ihre Webseite technisch sauber und performant um. Schnell, mobiloptimiert und bereit für einen starken digitalen Auftritt.",
  },
  {
    num: "4",
    title: "Betreuung",
    desc: "Auch nach dem Launch bleiben wir an Ihrer Seite. Ihre Webseite wird laufend optimiert, erweitert und an Ihr Wachstum angepasst.",
  },
];

const includes = [
  "Individuelles Webdesign",
  "Mobile First Entwicklung",
  "SEO-Grundoptimierung",
  "Ladezeit-Optimierung",
  "Kontaktformulare & CTAs",
  "Google Analytics Integration",
  "SSL & Sicherheit",
  "Laufende Betreuung optional",
];

export default function Webseiten() {
  const { data: allProjects = [] } = useGetProjects({ published: true });
  const webProjects = allProjects.filter(p => WEB_RE.test(p.category ?? ""));

  return (
    <PublicLayout>
      {/* HERO */}
      <section className="relative bg-primary text-white overflow-hidden pt-32 pb-24">
        <AnimatedHeroBackground />
        <CodeRainBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block bg-white/10 border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 tracking-wide">
                Webseiten Optimierung & Design
              </span>
              <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 leading-tight">
                Ihr digitaler <br />
                <span className="text-accent">erster Eindruck</span>
              </h1>
              <p className="text-xl text-white/80 mb-10 max-w-lg">
                Ihre Webseite entscheidet in Sekunden über Vertrauen. Wir entwickeln klare, moderne Auftritte, die Ihr Unternehmen hochwertig präsentieren und Besucher gezielt zu Anfragen führen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="rounded-full px-8 bg-accent hover:bg-accent/90 text-white font-bold">
                  <Link href="/kontakt">Webseite anfragen</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-white/30 text-white bg-transparent hover:bg-white/10">
                  <Link href="/projekte">Projekte ansehen</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block">
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6">
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&fit=crop"
                    alt="Webdesign"
                    className="rounded-2xl w-full object-cover h-72"
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">Ladezeit</div>
                      <div className="text-accent text-2xl font-black">0.8s</div>
                    </div>
                    <div>
                      <div className="text-white font-bold">Mobile Score</div>
                      <div className="text-green-400 text-2xl font-black">98/100</div>
                    </div>
                    <div>
                      <div className="text-white font-bold">Conversion</div>
                      <div className="text-white text-2xl font-black">+240%</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* LEISTUNGEN ÜBERBLICK */}
      <section className="py-28 bg-white relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(10,22,40,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(10,22,40,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        {/* Top glow blob */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-accent/8 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section header */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            className="text-center mb-20"
          >
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            >
              <span className="inline-flex items-center gap-2 bg-accent/10 border border-accent/25 text-accent text-xs font-bold px-4 py-1.5 rounded-full tracking-widest uppercase mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Unsere Leistungen im Überblick
              </span>
            </motion.div>
            <motion.h2
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary leading-tight"
            >
              Alles aus{" "}
              <span className="relative inline-block">
                <span className="text-accent">einer Hand</span>
                <motion.span
                  initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
                  className="absolute -bottom-1 left-0 right-0 h-[3px] bg-accent origin-left rounded-full"
                />
              </span>
            </motion.h2>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, delay: 0.1 } } }}
              className="mt-5 text-gray-500 text-lg max-w-xl mx-auto"
            >
              Professionelle Webauftritte, die überzeugen — vom ersten Pixel bis zum laufenden Betrieb.
            </motion.p>
          </motion.div>

          {/* Cards grid */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }}
            variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {leistungen.map((l, i) => (
              <motion.div
                key={i}
                variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } }}
                whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                className="group relative bg-white border border-gray-100 rounded-2xl p-7 overflow-hidden cursor-default shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(249,115,22,0.07) 0%, transparent 70%)" }} />
                {/* Top border accent */}
                <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-accent/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />

                {/* Number badge */}
                <div className="absolute top-6 right-6 w-7 h-7 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-gray-400 group-hover:text-accent transition-colors">{String(i + 1).padStart(2, "0")}</span>
                </div>

                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.4 } }}
                  className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-all duration-300 shadow-sm"
                >
                  {l.icon}
                </motion.div>

                <h3 className="text-lg font-display font-bold text-primary mb-3 group-hover:text-accent transition-colors duration-300 leading-snug pr-6">
                  {l.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-600 transition-colors duration-300">
                  {l.desc}
                </p>

                {/* Bottom line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 * i, ease: "easeOut" }}
                  className="absolute bottom-0 left-7 right-7 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent origin-left"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PROZESS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Unser Prozess</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold">
                Struktur. Klarheit. <span className="text-accent">Ergebnisse.</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mt-4">
                Klare Prozesse schaffen messbare Ergebnisse. Wir begleiten Sie von der ersten Analyse bis zur laufenden Optimierung.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {steps.map((step, i) => (
                <motion.div key={i} variants={fadeUp} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-6 right-6 text-7xl font-black text-gray-100 leading-none">{step.num}</div>
                  <div className="relative z-10">
                    <div className="w-10 h-10 bg-accent text-white rounded-xl flex items-center justify-center font-bold text-lg mb-5">{step.num}</div>
                    <h3 className="text-xl font-display font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* WAS ENTHALTEN IST */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp}>
                <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Unser Anspruch</p>
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Modern. Klar. <span className="text-accent">Überzeugend.</span></h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Wir verbinden Design, Struktur und Nutzerführung zu einer Webseite, die professionell wirkt und messbar funktioniert. Von der ersten Idee bis zur finalen Umsetzung entsteht ein digitaler Auftritt, der Ihre Marke stärkt und langfristig Ergebnisse liefert.
                </p>
              </motion.div>
              <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {includes.map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                    <span className="text-sm font-medium">{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
              <img
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=700&q=80&fit=crop"
                alt="Moderne Webseite"
                className="rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* PROJEKTE SHOWCASE */}
      {webProjects.length > 0 && (
        <section className="py-28 text-white overflow-hidden relative"
          style={{ background: "radial-gradient(ellipse 110% 80% at 50% 40%, #0d1f3c 0%, #070e1d 55%, #020810 100%)" }}>
          {/* Decorative ambient orbs */}
          <div className="absolute top-1/4 left-10 w-80 h-80 rounded-full blur-[140px] opacity-15 pointer-events-none" style={{ background: "#f97316" }} />
          <div className="absolute bottom-1/4 right-10 w-72 h-72 rounded-full blur-[120px] opacity-10 pointer-events-none" style={{ background: "#3b82f6" }} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp} className="text-center mb-20">
                <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-4">Referenzprojekte</p>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-white">
                  Webseiten, die <span className="text-accent">überzeugen</span>
                </h2>
                <p className="text-white/60 text-lg mt-5 max-w-xl mx-auto">
                  Vollständig responsiv – auf Desktop, Tablet und Smartphone perfekt.
                </p>
              </motion.div>

              <div className="space-y-10">
                {webProjects.map((project, i) => (
                  <motion.div key={project.id} variants={fadeUp}
                    className="group relative rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
                    style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {/* Hover gradient border effect */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.06) 0%, transparent 60%)" }} />

                    <div className="grid lg:grid-cols-2 gap-0 items-stretch">
                      {/* Device showcase panel */}
                      <div className={`relative flex items-center justify-center p-8 md:p-10 ${i % 2 === 1 ? "lg:order-2" : ""}`}
                        style={{ background: "rgba(0,0,0,0.25)" }}>
                        <MultiDeviceShowcase src={project.imageUrl ?? undefined} alt={project.title} />
                        {/* Panel separator */}
                        <div className={`hidden lg:block absolute top-8 bottom-8 w-px ${i % 2 === 1 ? "left-0" : "right-0"}`}
                          style={{ background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.1) 30%, rgba(255,255,255,0.1) 70%, transparent)" }} />
                      </div>

                      {/* Info panel */}
                      <div className={`flex flex-col justify-center p-8 md:p-12 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                        <div className="flex items-center gap-3 mb-5">
                          <span className="inline-flex items-center bg-accent/15 text-accent text-xs font-bold px-3.5 py-1.5 rounded-full border border-accent/20">
                            {project.category}
                          </span>
                          {project.clientName && (
                            <span className="text-white/30 text-sm">·</span>
                          )}
                          {project.clientName && (
                            <span className="text-white/50 text-sm font-medium">{project.clientName}</span>
                          )}
                        </div>
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-white mb-4 leading-tight">
                          {project.title}
                        </h3>
                        <p className="text-white/60 leading-relaxed text-base md:text-lg">{project.description}</p>
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-7">
                            {project.tags.map(tag => (
                              <span key={tag} className="text-[11px] font-semibold text-white/50 px-3 py-1 rounded-full"
                                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Bereit für Ihre neue <span className="text-accent">Webseite?</span>
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Lassen Sie uns gemeinsam einen digitalen Auftritt entwickeln, der Ihr Unternehmen von seiner besten Seite zeigt.
          </p>
          <Button asChild size="lg" className="rounded-full px-10 bg-accent hover:bg-accent/90 text-white font-bold text-lg">
            <Link href="/kontakt">Jetzt kostenlos anfragen <ArrowRight className="ml-2 w-5 h-5 inline" /></Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
