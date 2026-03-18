import React from "react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-display font-bold text-xl">
                B
              </div>
              <span className="font-display font-bold text-xl tracking-tight">
                Bleibsichtbar<span className="text-accent">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
              Ihre professionelle Social Media Agentur für nachhaltige digitale Sichtbarkeit. Wir bringen Ihre Marke nach vorne.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 font-display">Navigation</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><Link href="/" className="hover:text-accent transition-colors">Startseite</Link></li>
              <li><Link href="/services" className="hover:text-accent transition-colors">Leistungen</Link></li>
              <li><Link href="/projekte" className="hover:text-accent transition-colors">Projekte</Link></li>
              <li><Link href="/referenzen" className="hover:text-accent transition-colors">Referenzen</Link></li>
              <li><Link href="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 font-display">Rechtliches</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><Link href="/impressum" className="hover:text-accent transition-colors">Impressum</Link></li>
              <li><Link href="/datenschutz" className="hover:text-accent transition-colors">Datenschutz</Link></li>
              <li><Link href="/agb" className="hover:text-accent transition-colors">AGB</Link></li>
              <li><Link href="/admin/login" className="hover:text-accent transition-colors">Admin Login</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Bleibsichtbar. Alle Rechte vorbehalten.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-accent transition-colors">Instagram</a>
            <a href="#" className="hover:text-accent transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-accent transition-colors">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
