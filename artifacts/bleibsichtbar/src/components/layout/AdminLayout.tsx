import React from "react";
import { Link, useLocation } from "wouter";
import { useGetMe, useAdminLogout } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, FileText, Image, MessageSquare, LogOut, Loader2, Menu, X, ClipboardList, Users, Search, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const adminLinks = [
  { name: "Dashboard", path: "/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "Projekte", path: "/admin/projekte", icon: <Image className="w-5 h-5" /> },
  { name: "Blog", path: "/admin/blog", icon: <FileText className="w-5 h-5" /> },
  { name: "Referenzen", path: "/admin/referenzen", icon: <MessageSquare className="w-5 h-5" /> },
  { name: "Kunden", path: "/admin/kunden", icon: <Users className="w-5 h-5" /> },
  { name: "Partner", path: "/admin/partner", icon: <Handshake className="w-5 h-5" /> },
  { name: "Onboarding", path: "/admin/onboarding", icon: <ClipboardList className="w-5 h-5" /> },
  { name: "SEO", path: "/admin/seo", icon: <Search className="w-5 h-5" /> },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: user, isLoading, error } = useGetMe({ query: { retry: false } });
  const { mutate: logout } = useAdminLogout();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && (error || !user)) {
      setLocation("/admin/login");
    }
  }, [user, isLoading, error, setLocation]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!user) return null;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        localStorage.removeItem("bs_auth_token");
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        setLocation("/admin/login");
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-primary text-white z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:block",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-20 flex items-center px-6 border-b border-white/10">
          <div className="w-8 h-8 bg-white text-primary rounded-lg flex items-center justify-center font-display font-bold text-lg mr-3">
            B
          </div>
          <span className="font-display font-bold text-xl">Admin Panel</span>
        </div>

        <nav className="p-4 space-y-2">
          {adminLinks.map(link => {
            const active = location === link.path || (link.path !== "/admin" && location.startsWith(link.path));
            return (
              <Link 
                key={link.path} 
                href={link.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors",
                  active ? "bg-accent text-white font-medium" : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 inset-x-0 p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Abmelden</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button className="lg:hidden mr-4" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold font-display hidden sm:block">Bleibsichtbar CMS</h2>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium">Hallo, {user.username}</span>
            <Button asChild variant="outline" size="sm">
              <Link href="/">Zur Website</Link>
            </Button>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
