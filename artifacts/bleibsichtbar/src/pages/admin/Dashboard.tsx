import React from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { useGetProjects, useGetBlogPosts, useGetReferences } from "@workspace/api-client-react";
import { FileText, Image, MessageSquare } from "lucide-react";

export default function AdminDashboard() {
  const { data: projects } = useGetProjects();
  const { data: blogPosts } = useGetBlogPosts();
  const { data: references } = useGetReferences();

  const stats = [
    { name: "Projekte", value: projects?.length || 0, icon: <Image className="w-8 h-8 text-blue-500" />, color: "bg-blue-50" },
    { name: "Blogbeiträge", value: blogPosts?.length || 0, icon: <FileText className="w-8 h-8 text-green-500" />, color: "bg-green-50" },
    { name: "Referenzen", value: references?.length || 0, icon: <MessageSquare className="w-8 h-8 text-purple-500" />, color: "bg-purple-50" },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display">Dashboard Übersicht</h1>
        <p className="text-muted-foreground mt-2">Verwalten Sie Ihre Inhalte für Bleibsichtbar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map(stat => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mr-6 ${stat.color}`}>
              {stat.icon}
            </div>
            <div>
              <div className="text-3xl font-bold font-display">{stat.value}</div>
              <div className="text-muted-foreground font-medium">{stat.name}</div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-2xl border border-border shadow-sm p-8 text-center max-w-2xl mx-auto mt-12">
        <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center font-display font-bold text-3xl mx-auto mb-6">
          B
        </div>
        <h2 className="text-2xl font-bold mb-4 font-display">Willkommen im Admin Panel</h2>
        <p className="text-muted-foreground mb-8">
          Nutzen Sie die Navigation auf der linken Seite, um Projekte, Blogbeiträge und Referenzen zu verwalten. Änderungen werden sofort auf der Live-Website sichtbar.
        </p>
      </div>
    </AdminLayout>
  );
}
