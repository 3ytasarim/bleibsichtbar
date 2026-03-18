import React from "react";
import { useRoute } from "wouter";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { useGetBlogPost } from "@workspace/api-client-react";
import { formatDate } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:id");
  const id = parseInt(params?.id || "0");
  
  const { data: post, isLoading, error } = useGetBlogPost(id, {
    query: { enabled: id > 0 }
  });

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">Lade Artikel...</div>
      </PublicLayout>
    );
  }

  if (error || !post) {
    return (
      <PublicLayout>
        <div className="max-w-3xl mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold mb-4">Artikel nicht gefunden</h1>
          <Link href="/blog" className="text-accent hover:underline">Zurück zum Blog</Link>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <article className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-accent mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Zurück zur Übersicht
          </Link>
          
          <header className="mb-12">
            <div className="flex items-center text-sm text-muted-foreground mb-6">
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              <span className="mx-2">•</span>
              <span className="font-medium text-foreground">{post.author}</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight mb-8">
              {post.title}
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          </header>
          
          {post.imageUrl && (
            <div className="rounded-3xl overflow-hidden mb-16 shadow-lg border border-border">
              <img src={post.imageUrl} alt={post.title} className="w-full h-auto object-cover max-h-[500px]" />
            </div>
          )}
          
          <div className="prose prose-lg prose-blue max-w-none text-foreground/80 font-serif">
            {/* Very basic markdown rendering for demonstration since we just have a string */}
            {post.content.split('\n').map((paragraph, i) => (
              <p key={i} className="mb-6 leading-relaxed">{paragraph}</p>
            ))}
          </div>
          
          <div className="mt-16 pt-8 border-t border-border flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold font-display text-xl">
                {post.author.charAt(0)}
              </div>
              <div>
                <div className="font-bold">{post.author}</div>
                <div className="text-sm text-muted-foreground">Bleibsichtbar Team</div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </PublicLayout>
  );
}
