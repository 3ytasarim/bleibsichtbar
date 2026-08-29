import React from "react";
import { Link, useLocation } from "wouter";
import { useGetCustomerMe, useCustomerLogout, useGetPortalNotifications, getGetCustomerMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard, Instagram, FolderOpen, Receipt, UserRound, LogOut, Menu, X, Loader2, CalendarDays, FileStack, LifeBuoy, Kanban, Database, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/customer/NotificationBell";

export interface CustomerNavItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

// The full Instagram-centric nav — used for customers booked for Social
// Media only.
export const DEFAULT_NAV_ITEMS: CustomerNavItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Instagram", path: "/dashboard/instagram", icon: Instagram },
  { name: "Content Calendar", path: "/dashboard/content-calendar", icon: CalendarDays },
  { name: "Dateien", path: "/dashboard/dateien", icon: FolderOpen },
  { name: "Rechnungen & Zahlungen", path: "/dashboard/rechnungen", icon: Receipt },
  { name: "Dokumente", path: "/dashboard/dokumente", icon: FileStack },
  { name: "Profil", path: "/dashboard/profil", icon: UserRound },
  { name: "Support-Tickets", path: "/dashboard/support", icon: LifeBuoy },
];

const UPDATE_NAV_ITEM: CustomerNavItem = { name: "Update", path: "/dashboard/update", icon: Kanban };
const DATENBANK_NAV_ITEM: CustomerNavItem = { name: "Datenbank", path: "/dashboard/datenbank", icon: Database };

// Used for customers booked for KI & Automatisierungen only (no Social
// Media) — same portal shell/infrastructure, no Instagram-specific content.
export const KI_NAV_ITEMS: CustomerNavItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  UPDATE_NAV_ITEM,
  DATENBANK_NAV_ITEM,
  { name: "Rechnungen & Zahlungen", path: "/dashboard/rechnungen", icon: Receipt },
  { name: "Support-Tickets", path: "/dashboard/support", icon: LifeBuoy },
  { name: "Profil", path: "/dashboard/profil", icon: UserRound },
];

// Used for customers booked for BOTH Social Media and KI & Automatisierungen
// — the Social Media nav with the KI-only additions (Update, Datenbank)
// merged in.
const SOCIAL_AND_KI_NAV_ITEMS: CustomerNavItem[] = [
  DEFAULT_NAV_ITEMS[0], // Dashboard
  UPDATE_NAV_ITEM,
  DEFAULT_NAV_ITEMS[1], // Instagram
  DEFAULT_NAV_ITEMS[2], // Content Calendar
  DEFAULT_NAV_ITEMS[3], // Dateien (Social Media)
  DATENBANK_NAV_ITEM,
  ...DEFAULT_NAV_ITEMS.slice(4), // Rechnungen, Dokumente, Profil, Support-Tickets
];

/**
 * Picks the right nav set for a customer's serviceTypes. Centralized here
 * (rather than left to each page) so every customer sub-page — not just the
 * two dashboard home pages — automatically shows the correct sidebar for
 * that customer, with no risk of a page forgetting to pass the right one.
 */
function resolveNavItems(serviceTypes: string[] | undefined | null): CustomerNavItem[] {
  const types = serviceTypes ?? ["social_media"];
  const hasSocial = types.includes("social_media");
  const hasKi = types.includes("ki_automatisierungen");
  if (hasKi && hasSocial) return SOCIAL_AND_KI_NAV_ITEMS;
  if (hasKi) return KI_NAV_ITEMS;
  return DEFAULT_NAV_ITEMS;
}

export function CustomerPortalLayout({ children, navItems }: { children: React.ReactNode; navItems?: CustomerNavItem[] }) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: customer, isLoading, error } = useGetCustomerMe({ query: { retry: false, queryKey: getGetCustomerMeQueryKey() } });
  const { mutate: logout, isPending: loggingOut } = useCustomerLogout();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Unread ticket-status/reply notifications surface as a small inbox-style
  // count badge directly on the "Support-Tickets" nav item — not just in the
  // bell — so an update is hard to miss even if the bell dropdown goes unread.
  const { data: notifications = [] } = useGetPortalNotifications({ query: { refetchInterval: 60_000, enabled: !!customer } });
  const unreadTicketCount = notifications.filter((n) => n.type === "support_ticket" && !n.read).length;

  React.useEffect(() => {
    if (!isLoading && (error || !customer)) {
      setLocation("/login");
    }
  }, [customer, isLoading, error, setLocation]);

  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!customer) return null;

  const resolvedNavItems = navItems ?? resolveNavItems(customer.serviceTypes);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ["/api/customer-auth/me"] });
        setLocation("/login");
      },
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-72 bg-card border-r border-border z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-20 flex items-center justify-between px-6 border-b border-border">
          <div className="flex flex-col justify-center">
            <span className="font-display font-black text-[16px] tracking-[0.18em] uppercase text-foreground">
              Bleibsichtbar
            </span>
            <span className="text-xs text-muted-foreground mt-0.5">Kundenportal</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label="Menü schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {resolvedNavItems.map((item) => {
            const active = location === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  active ? "bg-[#2563eb]/10 text-[#2563eb]" : "text-foreground/70 hover:bg-muted hover:text-foreground"
                )}
              >
                {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-[#2563eb]" />}
                <Icon className="w-[18px] h-[18px] shrink-0" />
                <span className="flex-1">{item.name}</span>
                {item.path === "/dashboard/support" && unreadTicketCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#2563eb] text-white text-[11px] font-bold">
                    {unreadTicketCount > 9 ? "9+" : unreadTicketCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-1">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground/60 hover:bg-muted hover:text-foreground transition-colors w-full disabled:opacity-50"
          >
            {loggingOut ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <LogOut className="w-[18px] h-[18px]" />}
            Abmelden
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <button className="lg:hidden text-foreground" onClick={() => setSidebarOpen(true)} aria-label="Menü">
            <Menu className="w-6 h-6" />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="w-9 h-9 rounded-full bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center font-semibold text-sm">
              {customer.companyName?.charAt(0)?.toUpperCase() || "K"}
            </div>
            <span className="text-sm font-medium text-foreground">{customer.companyName}</span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
