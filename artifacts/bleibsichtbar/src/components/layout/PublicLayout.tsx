import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { GlobalScripts } from "@/components/shared/GlobalScripts";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <GlobalScripts />
      <Navbar />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
