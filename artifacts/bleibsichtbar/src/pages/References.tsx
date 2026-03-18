import React from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useGetReferences } from "@workspace/api-client-react";
import { motion } from "framer-motion";

export default function References() {
  const { data: references = [], isLoading } = useGetReferences({ published: true });

  return (
    <PublicLayout>
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Unsere <span className="text-accent">Referenzen</span></h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Erfolgsgeschichten und Stimmen unserer zufriedenen Kunden.
          </p>
        </div>
      </section>

      <section className="py-24 bg-gray-50 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-12">Lade Referenzen...</div>
          ) : references.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              Noch keine Referenzen vorhanden.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {references.map((ref, index) => (
                <motion.div 
                  key={ref.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-10 rounded-[2rem] shadow-lg border border-border/50 relative"
                >
                  <div className="absolute top-10 right-10 opacity-10">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                  </div>
                  
                  <div className="flex items-center space-x-1 mb-8 text-accent">
                    {[...Array(ref.rating || 5)].map((_, i) => (
                      <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  
                  <p className="text-xl leading-relaxed mb-8 relative z-10 text-foreground/90 font-serif italic">
                    "{ref.testimonial}"
                  </p>
                  
                  <div className="flex items-center pt-8 border-t border-border">
                    {ref.logoUrl ? (
                      <img src={ref.logoUrl} alt={ref.company} className="w-14 h-14 rounded-full object-cover mr-4 border border-border" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-xl mr-4">
                        {ref.clientName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-lg">{ref.clientName}</div>
                      <div className="text-muted-foreground">{ref.clientTitle && `${ref.clientTitle}, `}{ref.company}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
