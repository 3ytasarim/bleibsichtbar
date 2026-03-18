import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PhoneMockupProps {
  children: React.ReactNode;
  className?: string;
}

export function PhoneMockup({ children, className }: PhoneMockupProps) {
  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={cn(
        "relative mx-auto w-[300px] h-[600px] bg-white rounded-[3rem] border-[10px] border-gray-900 shadow-2xl overflow-hidden shrink-0",
        className
      )}
    >
      {/* Notch */}
      <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
        <div className="w-32 h-6 bg-gray-900 rounded-b-2xl"></div>
      </div>
      
      {/* Screen Content */}
      <div className="w-full h-full bg-gray-50 overflow-y-auto no-scrollbar relative z-0">
        {children}
      </div>
      
      {/* Home Indicator */}
      <div className="absolute bottom-2 inset-x-0 flex justify-center z-50 pointer-events-none">
        <div className="w-24 h-1 bg-gray-900/20 rounded-full"></div>
      </div>
    </motion.div>
  );
}
