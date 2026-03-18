import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ContactSection } from "../shared/ContactSection";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <ContactSection />
      <Footer />
    </div>
  );
}
