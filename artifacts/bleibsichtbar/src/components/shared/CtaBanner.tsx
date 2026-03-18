import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CtaBannerProps {
  label?: string;
  heading: string;
  headingAccent: string;
  subtext: string;
  buttonText?: string;
  buttonHref?: string;
}

export function CtaBanner({
  label = "Jetzt durchstarten",
  heading,
  headingAccent,
  subtext,
  buttonText = "Jetzt kostenlos anfragen",
  buttonHref = "/kontakt",
}: CtaBannerProps) {
  return (
    <section className="relative py-28 overflow-hidden bg-white">
      {/* Animated light blobs */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.18, 0.32, 0.18] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 left-1/3 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)" }}
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-20 right-1/4 w-[340px] h-[340px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(26,86,219,0.09) 0%, transparent 70%)" }}
      />

      {/* Animated floating dots */}
      {[
        { x: "10%", y: "20%", size: 6, delay: 0, dur: 3.5 },
        { x: "85%", y: "15%", size: 4, delay: 0.8, dur: 4.2 },
        { x: "75%", y: "75%", size: 8, delay: 1.2, dur: 3.8 },
        { x: "20%", y: "80%", size: 5, delay: 0.4, dur: 4.5 },
        { x: "50%", y: "10%", size: 3, delay: 1.8, dur: 3.2 },
        { x: "92%", y: "50%", size: 5, delay: 0.6, dur: 5 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: dot.x,
            top: dot.y,
            width: dot.size,
            height: dot.size,
            background: i % 2 === 0 ? "rgba(249,115,22,0.35)" : "rgba(26,86,219,0.25)",
          }}
          animate={{ y: [0, -14, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: dot.dur, delay: dot.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #0a1628 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.14 } } }}
        >
          {/* Label */}
          <motion.p
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            className="text-accent font-black text-sm tracking-widest uppercase mb-5"
          >
            {label}
          </motion.p>

          {/* Heading */}
          <motion.h2
            variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6"
            style={{ color: "#0a1628" }}
          >
            {heading}{" "}
            <span className="text-accent">{headingAccent}</span>
          </motion.h2>

          {/* Subtext */}
          <motion.p
            variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            className="text-lg text-gray-500 mb-12 max-w-xl mx-auto leading-relaxed"
          >
            {subtext}
          </motion.p>

          {/* Button with pulsing ring */}
          <motion.div
            variants={{ hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }}
            className="flex justify-center"
          >
            <div className="relative inline-block">
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.35, 0, 0.35] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-accent/35"
              />
              <Button
                asChild
                size="lg"
                className="relative rounded-full px-10 bg-accent hover:bg-accent/90 text-white font-bold text-lg shadow-xl shadow-accent/25 transition-all"
              >
                <Link href={buttonHref}>
                  {buttonText} <ArrowRight className="ml-2 w-5 h-5 inline" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
