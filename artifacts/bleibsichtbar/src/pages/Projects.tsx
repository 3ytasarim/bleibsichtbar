import React from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useGetProjects } from "@workspace/api-client-react";
import { motion } from "framer-motion";

export default function Projects() {
  const { data: projects = [], isLoading } = useGetProjects({ published: true });

  return (
    <PublicLayout>
      <section className="py-24 bg-gray-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Unsere <span className="text-accent">Projekte</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Einblicke in unsere erfolgreichen Kundenprojekte.
          </p>
        </div>
      </section>

      <section className="py-24 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[4/3] rounded-3xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              Noch keine Projekte veröffentlicht.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {projects.map((project, index) => (
                <motion.div 
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="rounded-3xl overflow-hidden mb-6 relative aspect-[4/3] bg-gray-100 border border-border/50 shadow-sm group-hover:shadow-xl transition-all duration-300">
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-display text-xl">Kein Bild</div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1 rounded-full">
                      {project.category}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold font-display mb-2 group-hover:text-accent transition-colors">{project.title}</h3>
                  {project.clientName && <p className="text-muted-foreground mb-3 font-medium">{project.clientName}</p>}
                  <p className="text-foreground/80 line-clamp-2">{project.description}</p>
                  
                  {project.tags && project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">{tag}</span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
