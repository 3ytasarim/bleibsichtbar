import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { SimpleModal } from "@/components/admin/SimpleModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";
import { useGetBlogPosts, useCreateBlogPost, useUpdateBlogPost, useDeleteBlogPost, type BlogPost } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils";

const blogSchema = z.object({
  title: z.string().min(1, "Titel erforderlich"),
  slug: z.string().min(1, "Slug erforderlich"),
  excerpt: z.string().min(1, "Auszug erforderlich"),
  content: z.string().min(1, "Inhalt erforderlich"),
  imageUrl: z.string().url("Muss eine gültige URL sein").or(z.literal("")).nullable(),
  author: z.string().min(1, "Autor erforderlich"),
  published: z.boolean().default(true),
});

type FormValues = z.infer<typeof blogSchema>;

export default function AdminBlog() {
  const queryClient = useQueryClient();
  const { data: posts = [], isLoading } = useGetBlogPosts();
  const createMut = useCreateBlogPost();
  const updateMut = useUpdateBlogPost();
  const deleteMut = useDeleteBlogPost();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: { published: true, author: "Admin" }
  });

  // Auto-generate slug from title
  const titleVal = watch("title");
  React.useEffect(() => {
    if (titleVal && !editingId) {
      setValue("slug", titleVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  }, [titleVal, editingId, setValue]);

  const openCreate = () => {
    setEditingId(null);
    reset({ title: "", slug: "", excerpt: "", content: "", imageUrl: "", author: "Bleibsichtbar Team", published: true });
    setIsModalOpen(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingId(post.id);
    reset({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      imageUrl: post.imageUrl || "",
      author: post.author,
      published: post.published
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Blogbeitrag wirklich löschen?")) {
      deleteMut.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/blog"] })
      });
    }
  };

  const onSubmit = (data: FormValues) => {
    const payload = { ...data, imageUrl: data.imageUrl || null, publishedAt: data.published ? new Date().toISOString() : null };
    
    if (editingId) {
      updateMut.mutate({ id: editingId, data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
          setIsModalOpen(false);
        }
      });
    } else {
      createMut.mutate({ data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
          setIsModalOpen(false);
        }
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display">Blog</h1>
          <p className="text-muted-foreground">Artikel verwalten</p>
        </div>
        <Button onClick={openCreate} className="bg-accent hover:bg-accent/90">
          <Plus className="w-5 h-5 mr-2" /> Neuer Artikel
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Lade Artikel...</div>
        ) : posts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Keine Artikel gefunden.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-border">
                  <th className="p-4 font-semibold text-sm">Titel</th>
                  <th className="p-4 font-semibold text-sm">Autor</th>
                  <th className="p-4 font-semibold text-sm">Datum</th>
                  <th className="p-4 font-semibold text-sm">Status</th>
                  <th className="p-4 font-semibold text-sm text-right">Aktionen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {posts.map(post => (
                  <tr key={post.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-medium">{post.title}</td>
                    <td className="p-4 text-muted-foreground">{post.author}</td>
                    <td className="p-4 text-muted-foreground">{formatDate(post.createdAt)}</td>
                    <td className="p-4">
                      {post.published ? 
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><Check className="w-3 h-3 mr-1"/> Online</span> : 
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><X className="w-3 h-3 mr-1"/> Entwurf</span>
                      }
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(post)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SimpleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? "Artikel bearbeiten" : "Neuer Artikel"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Titel</label>
              <Input {...register("title")} className={errors.title ? "border-destructive" : ""} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Slug</label>
              <Input {...register("slug")} className={errors.slug ? "border-destructive" : ""} />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">Kurzer Auszug</label>
            <Textarea {...register("excerpt")} rows={2} className={errors.excerpt ? "border-destructive min-h-[80px]" : "min-h-[80px]"} />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Inhalt (Markdown/Text)</label>
            <Textarea {...register("content")} className={errors.content ? "border-destructive min-h-[200px]" : "min-h-[200px]"} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Titelbild URL</label>
              <Input {...register("imageUrl")} placeholder="https://..." />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Autor</label>
              <Input {...register("author")} />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="publishedBlog" {...register("published")} className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
              <label htmlFor="publishedBlog" className="text-sm font-medium">Veröffentlichen</label>
            </div>
            
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Abbrechen</Button>
              <Button type="submit" disabled={createMut.isPending || updateMut.isPending}>
                {createMut.isPending || updateMut.isPending ? "Speichern..." : "Speichern"}
              </Button>
            </div>
          </div>
        </form>
      </SimpleModal>
    </AdminLayout>
  );
}
