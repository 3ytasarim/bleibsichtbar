import { useGetCustomerMe, getGetCustomerMeQueryKey } from "@workspace/api-client-react";
import { CustomerPortalLayout, type CustomerNavItem } from "@/components/layout/CustomerPortalLayout";
import { LightTrustBackground } from "@/components/shared/LightTrustBackground";
import { DaysWithUsCounter } from "@/components/customer/DaysWithUsCounter";
import { SupportTicketSection } from "@/components/customer/SupportTicketSection";
import { LayoutDashboard, UserRound, LifeBuoy, Sparkles, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

// Temporary nav for KI & Automatisierungen customers — deliberately minimal
// (only what's true regardless of service type) until the real set of
// sections for this dashboard is defined.
const KI_NAV_ITEMS: CustomerNavItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Support-Tickets", path: "/dashboard/support", icon: LifeBuoy },
  { name: "Profil", path: "/dashboard/profil", icon: UserRound },
];

/**
 * Dashboard for customers booked only for "KI & Automatisierungen" (no
 * Social Media) — same portal shell/infrastructure as the main
 * CustomerDashboard, but without any Instagram-specific content. Content
 * cards for this dashboard are still to be defined; the nav above is a
 * placeholder for the same reason.
 */
export default function CustomerDashboardKI() {
  const { data: customer } = useGetCustomerMe({ query: { retry: false, queryKey: getGetCustomerMeQueryKey() } });

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Guten Morgen" : hour < 18 ? "Guten Tag" : "Guten Abend";
  const isEvening = greeting === "Guten Abend";
  const GreetingIcon = isEvening ? Moon : Sun;

  return (
    <CustomerPortalLayout navItems={KI_NAV_ITEMS}>
      <div className="w-full">
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-10 bg-white border border-slate-200">
          <LightTrustBackground />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="flex items-center gap-1.5 text-base font-semibold text-slate-700">
                <GreetingIcon className={cn("w-4 h-4", isEvening ? "text-[#0a1f44]" : "text-sky-400")} />
                {greeting}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold font-display mt-1 text-slate-900">
                {customer?.companyName}
              </h1>
              <p className="text-slate-600 mt-3 max-w-lg">
                Ihr Kundenportal für KI &amp; Automatisierungen.
              </p>
            </div>

            <DaysWithUsCounter startDate={customer?.startDate} />
          </div>
        </div>

        <div className="mt-6 bg-card border border-border rounded-2xl p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold font-display text-foreground">Ihr Bereich wird vorbereitet</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Die Übersicht für Ihre KI- &amp; Automatisierungs-Projekte folgt in Kürze. Bei Fragen erreichen Sie uns
            jederzeit über ein Support-Ticket.
          </p>
        </div>

        <SupportTicketSection />
      </div>
    </CustomerPortalLayout>
  );
}
