import React from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useGetBlogPosts } from "@workspace/api-client-react";
import { formatDate } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Blog() {
  const { data: posts = [], isLoading } = useGetBlogPosts({ published: true });

  return (
    <PublicLayout>
      <section className="py-24 bg-gray-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">Wissen & <span className="text-accent">Insights</span></h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Aktuelle Trends, Tipps und Strategien rund um Social Media Marketing.
          </p>
        </div>
      </section>

      <section className="py-24 min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3].map(i => (
                <div key={i} className="animate-pulse bg-white p-6 rounded-3xl border border-border">
                  <div className="bg-gray-200 aspect-video rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              Noch keine Blogbeiträge vorhanden.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-3xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all group h-full flex flex-col"
                  >
                    <div className="aspect-video bg-gray-100 overflow-hidden relative">
                      {post.imageUrl ? (
                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20 font-display">Bleibsichtbar</div>
                      )}
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                        <span className="mx-2">•</span>
                        <span>{post.author}</span>
                      </div>
                      <h2 className="text-2xl font-bold font-display mb-4 group-hover:text-accent transition-colors line-clamp-2">{post.title}</h2>
                      <p className="text-muted-foreground mb-6 line-clamp-3 flex-grow">{post.excerpt}</p>
                      <div className="text-primary font-bold inline-flex items-center group-hover:text-accent transition-colors mt-auto">
                        Weiterlesen <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
