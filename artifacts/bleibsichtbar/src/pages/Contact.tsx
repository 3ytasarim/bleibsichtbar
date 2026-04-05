import React from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSubmitContact } from "@workspace/api-client-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name ist erforderlich (mind. 2 Zeichen)"),
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein"),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, "Nachricht muss mindestens 10 Zeichen lang sein"),
  service: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const WHATSAPP_NUMBER = "4915567152351";
const WHATSAPP_TEXT = encodeURIComponent(
  "Hallo Bleibsichtbar Team, ich würde gerne eine kostenlose Erstberatung anfragen."
);

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Contact() {
  const { mutate, isPending, isSuccess } = useSubmitContact();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data: ContactFormValues) => {
    mutate({ data }, { onSuccess: () => reset() });
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section
        className="py-24 pt-36 text-white relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #0a1628 0%, #163060 50%, #0a1628 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="text-xs font-bold tracking-widest uppercase text-accent/80 mb-4"
          >
            // Kontakt
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-black text-white leading-tight mb-5"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)" }}
          >
            Lassen Sie uns über<br />
            <em className="not-italic text-accent">Ihr Projekt</em> sprechen
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Ob neue Webseite, mehr Sichtbarkeit oder KI-Automatisierung — wir beraten Sie ehrlich und kostenlos.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Left — Form */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100"
            >
              <h2 className="text-2xl font-display font-bold mb-2">Kostenlose Erstanfrage</h2>
              <p className="text-muted-foreground text-sm mb-8">Füllen Sie das Formular aus — wir melden uns innerhalb von 24 Stunden.</p>

              {isSuccess ? (
                <div className="min-h-[360px] flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold font-display">Vielen Dank!</h3>
                  <p className="text-muted-foreground max-w-md">
                    Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns in Kürze bei Ihnen.
                  </p>
                  <Button variant="outline" className="mt-4" onClick={() => reset()}>
                    Weitere Nachricht senden
                  </Button>
                </div>
              ) : (
                <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Name *</label>
                      <Input {...register("name")} placeholder="Max Mustermann" className={errors.name ? "border-destructive" : ""} />
                      {errors.name && (
                        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                          className="flex items-center gap-2 mt-1.5 px-3 py-2 rounded-lg bg-red-50 border border-red-200/80 text-xs text-red-600 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.name.message}</span>
                        </motion.div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">E-Mail *</label>
                      <Input {...register("email")} type="email" placeholder="max@beispiel.de" className={errors.email ? "border-destructive" : ""} />
                      {errors.email && (
                        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                          className="flex items-center gap-2 mt-1.5 px-3 py-2 rounded-lg bg-red-50 border border-red-200/80 text-xs text-red-600 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.email.message}</span>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Telefon</label>
                      <Input {...register("phone")} placeholder="+49 123 456789" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Unternehmen</label>
                      <Input {...register("company")} placeholder="Ihre Firma GmbH" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Nachricht *</label>
                    <Textarea
                      {...register("message")}
                      placeholder="Wie können wir Ihnen helfen?"
                      rows={5}
                      className={errors.message ? "border-destructive" : ""}
                    />
                    {errors.message && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 mt-1.5 px-3 py-2 rounded-lg bg-red-50 border border-red-200/80 text-xs text-red-600 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.message.message}</span>
                      </motion.div>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isPending}
                    whileHover={{ scale: 1.02, boxShadow: "0 8px 28px rgba(255,107,53,0.35)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-base text-white disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #ff6b35 0%, #e8522a 100%)" }}
                  >
                    {isPending ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Wird gesendet…</>
                    ) : (
                      <><Send className="w-5 h-5" /> Nachricht senden</>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>

            {/* Right — WhatsApp + Info */}
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
              className="flex flex-col gap-6"
            >
              {/* WhatsApp CTA */}
              <motion.div variants={fadeUp}>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_TEXT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 p-6 rounded-2xl text-white group transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: "linear-gradient(135deg, #128C7E 0%, #25D366 100%)",
                    boxShadow: "0 8px 32px rgba(37,211,102,0.30)",
                  }}
                >
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <WhatsAppIcon className="w-9 h-9 text-white" />
                  </div>
                  <div>
                    <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">Sofort schreiben</p>
                    <p className="text-xl font-display font-black">WhatsApp Nachricht</p>
                    <p className="text-white/70 text-sm mt-1">Wir antworten innerhalb weniger Stunden</p>
                  </div>
                </a>
              </motion.div>

              {/* Info cards */}
              {[
                {
                  label: "E-Mail",
                  value: "info@bleibsichtbar.com",
                  href: "mailto:info@bleibsichtbar.com",
                  desc: "Wir antworten innerhalb von 24 Stunden",
                },
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <a
                    href={item.href}
                    className="block p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-300 group"
                  >
                    <p className="text-xs font-bold tracking-widest uppercase text-accent/70 mb-2">{item.label}</p>
                    <p className="text-lg font-bold font-display text-foreground group-hover:text-accent transition-colors">{item.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                  </a>
                </motion.div>
              ))}

              {/* Trust badges */}
              <motion.div variants={fadeUp}
                className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm"
              >
                <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-4">Warum Bleibsichtbar?</p>
                <ul className="space-y-3">
                  {[
                    "Kostenlose & unverbindliche Erstberatung",
                    "Antwort innerhalb von 24 Stunden",
                    "Individuelle Lösungen — kein Standard",
                    "Transparente Kommunikation immer",
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 mt-0.5">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
