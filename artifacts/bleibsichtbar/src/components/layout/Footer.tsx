import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Instagram, Mail, ArrowRight, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSubmitContact } from "@workspace/api-client-react";
import { useT } from "@/i18n";

const TICKER_ITEMS = Array(14).fill(null);

function makeSchema(t: ReturnType<typeof useT>["t"]) {
  return z.object({
    name: z.string().min(2, t.footer.validation.nameRequired),
    email: z.string().email(t.footer.validation.emailInvalid),
    message: z.string().min(5, t.footer.validation.messageRequired),
  });
}

type FormValues = { name: string; email: string; message: string };

const fieldVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const inputBase: React.CSSProperties = {
  background: "rgba(15, 30, 65, 0.7)",
  border: "1.5px solid rgba(255,255,255,0.09)",
  backdropFilter: "blur(8px)",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

function FooterField({
  field,
  placeholder,
  type = "text",
  index,
  error,
  rows,
}: {
  field: React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  placeholder: string;
  type?: string;
  index: number;
  error?: string;
  rows?: number;
}) {
  const focusStyle = {
    borderColor: "rgba(255,107,53,0.65)",
    boxShadow: "0 0 0 3px rgba(255,107,53,0.12)",
  };
  const blurStyle = {
    borderColor: "rgba(255,255,255,0.09)",
    boxShadow: "none",
  };

  return (
    <motion.div custom={index} variants={fieldVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {rows ? (
        <textarea
          {...(field as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-5 py-4 rounded-2xl text-sm text-white placeholder-white/30 outline-none resize-none"
          style={inputBase}
          onFocus={e => Object.assign(e.target.style, focusStyle)}
          onBlur={e => Object.assign(e.target.style, blurStyle)}
        />
      ) : (
        <input
          {...(field as React.InputHTMLAttributes<HTMLInputElement>)}
          type={type}
          placeholder={placeholder}
          className="w-full px-5 py-4 rounded-2xl text-sm text-white placeholder-white/30 outline-none"
          style={inputBase}
          onFocus={e => Object.assign(e.target.style, focusStyle)}
          onBlur={e => Object.assign(e.target.style, blurStyle)}
        />
      )}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
          className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 font-medium"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}
    </motion.div>
  );
}

function FooterContactForm() {
  const { t } = useT();
  const schema = makeSchema(t);
  const { mutate, isPending, isSuccess } = useSubmitContact();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  const onSubmit = (data: FormValues) => {
    mutate({ data: { ...data, phone: "", company: "", service: "" } }, { onSuccess: () => reset() });
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center gap-4 py-14 text-center"
      >
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        >
          <CheckCircle2 className="w-16 h-16 text-accent" />
        </motion.div>
        <h3 className="text-2xl font-display font-bold text-white">{t.footer.thanks}</h3>
        <p className="text-white/55 max-w-xs text-sm">{t.footer.thanksSub}</p>
        <button onClick={() => reset()} className="mt-3 text-sm text-accent/70 hover:text-accent transition-colors">
          {t.footer.sendMore}
        </button>
      </motion.div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <FooterField field={register("name")} placeholder={t.footer.namePlaceholder} index={0} error={errors.name?.message} />
      <FooterField field={register("email")} placeholder={t.footer.emailPlaceholder} type="email" index={1} error={errors.email?.message} />
      <FooterField field={register("message")} placeholder={t.footer.messagePlaceholder} index={2} error={errors.message?.message} rows={5} />

      <motion.div custom={3} variants={fieldVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <motion.button
          type="submit"
          disabled={isPending}
          whileHover={{ scale: 1.03, boxShadow: "0 8px 28px rgba(255,107,53,0.35)" }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-sm text-white disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #ff6b35 0%, #e8522a 100%)" }}
        >
          {isPending ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> {t.footer.sending}</>
          ) : (
            <>{t.footer.submit} <ArrowRight className="w-4 h-4" /></>
          )}
        </motion.button>
      </motion.div>
    </form>
  );
}

export function Footer() {
  const { t } = useT();

  return (
    <div className="bg-white">
      <footer
        className="text-white overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #0a1628 0%, #0e2050 55%, #0a1628 100%)",
          borderRadius: "32px 32px 0 0",
        }}
      >
        {/* CONTACT SECTION */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-14 border-b border-white/[0.06]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-xs font-bold tracking-widest uppercase text-accent/80 mb-5"
              >
                {t.footer.label}
              </motion.p>
              <h2
                className="font-display font-black text-white leading-tight mb-5"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3.4rem)" }}
              >
                {t.footer.heading1}<br />
                <em className="not-italic text-accent">{t.footer.heading2}</em> {t.footer.heading3}
                {t.footer.heading4 && <><br />{t.footer.heading4}</>}
              </h2>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-white/50 text-sm leading-relaxed max-w-sm"
              >
                {t.footer.sub}
              </motion.p>
            </motion.div>

            <div>
              <FooterContactForm />
            </div>
          </div>
        </div>

        {/* SCROLLING TICKER */}
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

        {/* BOTTOM FOOTER */}
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 items-start pb-10 border-b border-white/[0.06]">

            <div>
              <h3
                className="font-display font-black text-white uppercase leading-none"
                style={{ fontSize: "clamp(1.4rem, 2.8vw, 2rem)", letterSpacing: "-0.01em", lineHeight: 1.1 }}
              >
                {t.footer.statement1}<br />
                {t.footer.statement2}<br />
                <span className="text-accent">{t.footer.statement3}</span> {t.footer.statement4}
              </h3>
            </div>

            <div className="md:px-4">
              <ul className="space-y-3">
                {[
                  { label: t.footer.datenschutz, href: "/datenschutz" },
                  { label: t.footer.impressum, href: "/impressum" },
                  { label: t.footer.agb, href: "/agb" },
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

            <div>
              <h4 className="text-xs font-bold tracking-widest uppercase text-white/30 mb-5">{t.footer.contactLabel}</h4>
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
                    {t.footer.freeConsult}
                  </Link>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/bleibsichtbarr/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/55 hover:text-white transition-colors text-sm font-medium"
                  >
                    <Instagram className="w-3.5 h-3.5 text-accent shrink-0" />
                    {t.footer.followInsta}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-7 flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-white/25 text-xs tracking-wide">
              © Bleibsichtbar {new Date().getFullYear()}, {t.footer.copyright}
            </p>
            <Link href="/login" className="text-white/10 text-xs hover:text-white/30 transition-colors">
              Admin
            </Link>
          </div>
        </div>

      </footer>
    </div>
  );
}
