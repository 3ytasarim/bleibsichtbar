import React from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Contact() {
  return (
    <PublicLayout>
      <section className="py-24 bg-gray-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Kontakt</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Wir freuen uns darauf, von Ihnen zu hören.
          </p>
        </div>
      </section>

      {/* The Contact form is already rendered via PublicLayout's ContactSection, 
          so here we just show additional contact info */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-3xl border border-border">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-display mb-2">Besuchen Sie uns</h3>
              <p className="text-muted-foreground">Musterstraße 123<br/>10115 Berlin<br/>Deutschland</p>
            </div>

            <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-3xl border border-border">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-display mb-2">Rufen Sie an</h3>
              <p className="text-muted-foreground">+49 30 123456789<br/>Mo-Fr: 09:00 - 18:00 Uhr</p>
            </div>

            <div className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-3xl border border-border">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                <Mail className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-display mb-2">Schreiben Sie uns</h3>
              <p className="text-muted-foreground">hallo@bleibsichtbar.com<br/>Wir antworten innerhalb von 24h</p>
            </div>

          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
