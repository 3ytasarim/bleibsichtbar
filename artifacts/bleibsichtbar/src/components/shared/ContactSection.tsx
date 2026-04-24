import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useSubmitContact } from "@workspace/api-client-react";
import { useT } from "@/i18n";

type ContactFormValues = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
  service?: string;
};

export function ContactSection() {
  const { t } = useT();
  const cs = t.contactSection;
  const { mutate, isPending, isSuccess } = useSubmitContact();

  const contactSchema = z.object({
    name: z.string().min(2, cs.errorName),
    email: z.string().email(cs.errorEmail),
    phone: z.string().optional(),
    company: z.string().optional(),
    message: z.string().min(10, cs.errorMessage),
    service: z.string().optional(),
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = (data: ContactFormValues) => {
    mutate({ data }, {
      onSuccess: () => {
        reset();
      }
    });
  };

  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden" id="kontakt">
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              {cs.heading} <span className="text-accent">{cs.headingAccent}</span>
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-lg leading-relaxed">
              {cs.subheading}
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                <div>
                  <p className="text-sm text-primary-foreground/60">{cs.writeUs}</p>
                  <p className="text-lg font-medium">hallo@bleibsichtbar.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-2xl text-foreground"
          >
            {isSuccess ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-bold font-display">{cs.thanks}</h3>
                <p className="text-muted-foreground max-w-md">
                  {cs.successMessage}
                </p>
                <Button variant="outline" className="mt-8" onClick={() => reset()}>
                  {cs.successBtn}
                </Button>
              </div>
            ) : (
              <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{cs.labelName}</label>
                    <Input {...register("name")} placeholder={cs.placeholderName} className={errors.name ? "border-destructive" : ""} />
                    {errors.name && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200/80 text-xs text-red-600 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.name.message}</span>
                      </motion.div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{cs.labelEmail}</label>
                    <Input {...register("email")} type="email" placeholder={cs.placeholderEmail} className={errors.email ? "border-destructive" : ""} />
                    {errors.email && (
                      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200/80 text-xs text-red-600 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.email.message}</span>
                      </motion.div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{cs.labelPhone}</label>
                    <Input {...register("phone")} placeholder={cs.placeholderPhone} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{cs.labelCompany}</label>
                    <Input {...register("company")} placeholder={cs.placeholderCompany} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{cs.labelMessage}</label>
                  <Textarea {...register("message")} placeholder={cs.placeholderMessage} className={errors.message ? "border-destructive" : ""} />
                  {errors.message && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                      className="flex items-center gap-2 mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200/80 text-xs text-red-600 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.message.message}</span>
                    </motion.div>
                  )}
                </div>

                <Button type="submit" variant="accent" size="lg" className="w-full text-lg" disabled={isPending}>
                  {isPending ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {cs.sending}</>
                  ) : (
                    <><Send className="w-5 h-5 mr-2" /> {cs.submit}</>
                  )}
                </Button>
              </form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
