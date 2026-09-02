import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  useGetCustomerMe,
  useGetPortalInstagram,
  useGetPortalInvoices,
  useGetPortalFiles,
  getGetCustomerMeQueryKey,
  type PortalMonthlyMetric,
} from "@workspace/api-client-react";
import { CustomerPortalLayout } from "@/components/layout/CustomerPortalLayout";
import { LightTrustBackground } from "@/components/shared/LightTrustBackground";
import { DaysWithUsCounter } from "@/components/customer/DaysWithUsCounter";
import { ConfettiBurst } from "@/components/shared/ConfettiBurst";
import { TrophyPop } from "@/components/shared/TrophyPop";
import { SupportTicketSection } from "@/components/customer/SupportTicketSection";
import { heroFadeUp } from "@/components/shared/AnimatedHero";
import {
  Instagram,
  FolderOpen,
  Receipt,
  UserRound,
  ArrowUpRight,
  Users,
  Image as ImageIcon,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Radar,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface MonthlyDelta {
  pct: number | null;
  diff: number;
  positive: boolean;
}

/**
 * Real month-over-month change (latest vs. previous entry in monthlyHistory).
 * Returns undefined when there isn't yet a second month to compare against —
 * never invents a comparison out of a single data point.
 */
function computeMonthlyDelta(
  history: PortalMonthlyMetric[] | null | undefined,
  key: "followers" | "reach"
): MonthlyDelta | undefined {
  if (!history || history.length < 2) return undefined;
  const latest = history[history.length - 1][key];
  const prev = history[history.length - 2][key];
  if (latest == null || prev == null) return undefined;
  const diff = latest - prev;
  const pct = prev !== 0 ? Math.round((diff / prev) * 1000) / 10 : null;
  return { pct, diff, positive: diff >= 0 };
}

function DeltaBadge({ delta }: { delta: MonthlyDelta }) {
  const Icon = delta.positive ? TrendingUp : TrendingDown;
  const text = delta.pct !== null ? `${delta.positive ? "+" : ""}${delta.pct}%` : `${delta.positive ? "+" : ""}${delta.diff}`;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full",
        delta.positive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-[#7F9287]/10 text-[#7F9287]"
      )}
    >
      <Icon className="w-3 h-3" /> {text} ggü. Vormonat
    </span>
  );
}

function GrowthSparkline({ id, data, positive }: { id: string; data: number[]; positive: boolean }) {
  const color = positive ? "hsl(160 84% 39%)" : "#7F9287";
  const points = data.map((v, i) => ({ i, v }));
  return (
    <div className="h-12 mt-3">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area dataKey="v" type="monotone" stroke={color} strokeWidth={2} fill={`url(#${id})`} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function GrowthCard({
  title,
  icon: Icon,
  history,
  dataKey,
  suffix,
}: {
  title: string;
  icon: typeof Users;
  history: PortalMonthlyMetric[] | null | undefined;
  dataKey: "followers" | "reach";
  suffix: string;
}) {
  const points = (history ?? []).filter((h) => h[dataKey] != null);
  const latest = points.length ? points[points.length - 1][dataKey] : null;
  const delta = computeMonthlyDelta(history, dataKey);
  const [inView, setInView] = useState(false);
  const celebrate = inView && delta?.positive === true;

  return (
    <motion.div
      custom={dataKey === "followers" ? 0 : 1}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      onViewportEnter={() => setInView(true)}
      variants={heroFadeUp}
      className="relative overflow-hidden bg-card border border-border rounded-2xl p-6"
    >
      {celebrate && <ConfettiBurst active={celebrate} />}
      {celebrate && <TrophyPop active={celebrate} />}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4" />
          </div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
        </div>
        {delta && <DeltaBadge delta={delta} />}
      </div>

      {latest !== null ? (
        <>
          <p className="text-3xl font-bold font-display mt-4 tabular-nums text-foreground">
            {latest.toLocaleString("de-DE")}
            <span className="text-sm font-medium text-muted-foreground ml-1.5">{suffix}</span>
          </p>
          {points.length >= 2 ? (
            <GrowthSparkline id={`grow-${dataKey}`} data={points.map((p) => p[dataKey] as number)} positive={delta?.positive ?? true} />
          ) : (
            <p className="text-xs text-muted-foreground mt-3">Erster Monat erfasst — Trend ab dem nächsten Monat sichtbar.</p>
          )}
        </>
      ) : (
        <p className="text-sm text-muted-foreground mt-4">Noch keine Daten vorhanden.</p>
      )}
    </motion.div>
  );
}

export default function CustomerDashboard() {
  const { data: customer } = useGetCustomerMe({ query: { retry: false, queryKey: getGetCustomerMeQueryKey() } });
  const { data: instagram, isLoading: instagramLoading } = useGetPortalInstagram();
  const { data: invoices, isLoading: invoicesLoading } = useGetPortalInvoices();
  const { data: files, isLoading: filesLoading } = useGetPortalFiles();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Guten Morgen" : hour < 18 ? "Guten Tag" : "Guten Abend";
  const isEvening = greeting === "Guten Abend";
  const GreetingIcon = isEvening ? Moon : Sun;

  const openInvoiceCount = invoices?.filter((i) => i.status === "open" || i.status === "overdue").length ?? 0;
  const followerDelta = computeMonthlyDelta(instagram?.monthlyHistory, "followers");

  return (
    <CustomerPortalLayout>
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
                Ihr Kundenportal auf einen Blick — Instagram-Performance, Dateien und Rechnungen.
              </p>

              {followerDelta && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="inline-flex items-center gap-1.5 mt-5 text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3.5 py-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  Follower sind diesen Monat um {followerDelta.positive ? "+" : ""}
                  {followerDelta.pct !== null ? `${followerDelta.pct}%` : followerDelta.diff} gewachsen.
                </motion.p>
              )}
            </div>

            <DaysWithUsCounter startDate={customer?.startDate} />
          </div>
        </div>

        {instagram?.connected && (
          <div className="grid sm:grid-cols-2 gap-4 mt-6">
            <GrowthCard title="Follower-Wachstum" icon={Users} history={instagram.monthlyHistory} dataKey="followers" suffix="Follower" />
            <GrowthCard title="Reichweite" icon={Radar} history={instagram.monthlyHistory} dataKey="reach" suffix="Accounts" />
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <motion.div custom={0} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={heroFadeUp}>
            <Link
              href="/dashboard/instagram"
              className="group relative flex flex-col justify-between bg-card border border-border rounded-2xl p-6 hover:border-[#2563eb]/40 hover:shadow-sm transition-all min-h-[164px]"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-[#2563eb] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Instagram</p>
                {instagramLoading ? (
                  <div className="h-8 w-20 mt-2 rounded-md bg-muted animate-pulse" />
                ) : instagram?.connected ? (
                  <div className="flex items-end gap-4 mt-1.5">
                    <div>
                      <p className="text-xl font-bold font-display leading-none text-foreground">{instagram.followers?.toLocaleString("de-DE") ?? "—"}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1"><Users className="w-3 h-3" /> Follower</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold font-display leading-none text-foreground">{instagram.mediaCount?.toLocaleString("de-DE") ?? "—"}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1"><ImageIcon className="w-3 h-3" /> Beiträge</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1.5">Nicht verbunden</p>
                )}
              </div>
            </Link>
          </motion.div>

          <motion.div custom={1} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={heroFadeUp}>
            <Link
              href="/dashboard/rechnungen"
              className="group relative flex flex-col justify-between bg-card border border-border rounded-2xl p-6 hover:border-[#2563eb]/40 hover:shadow-sm transition-all min-h-[164px]"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-[#2563eb] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Rechnungen & Zahlungen</p>
                {invoicesLoading ? (
                  <div className="h-8 w-24 mt-2 rounded-md bg-muted animate-pulse" />
                ) : openInvoiceCount > 0 ? (
                  <div className="mt-1.5">
                    <p className="text-xl font-bold font-display leading-none text-foreground">{openInvoiceCount}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">offene Rechnung{openInvoiceCount !== 1 ? "en" : ""}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Alles beglichen
                  </p>
                )}
              </div>
            </Link>
          </motion.div>

          <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={heroFadeUp}>
            <Link
              href="/dashboard/dateien"
              className="group relative flex flex-col justify-between bg-card border border-border rounded-2xl p-6 hover:border-[#2563eb]/40 hover:shadow-sm transition-all min-h-[164px]"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center shrink-0">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-[#2563eb] group-hover:-translate-y-0.5 transition-all" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Dateien</p>
                {filesLoading ? (
                  <div className="h-5 w-24 mt-2.5 rounded-md bg-muted animate-pulse" />
                ) : (
                  <p className={cn("text-sm mt-1.5 flex items-center gap-1.5", files?.enabled ? "text-foreground" : "text-muted-foreground")}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", files?.enabled ? "bg-emerald-500" : "bg-muted-foreground/40")} />
                    {files?.enabled ? "Dateispeicher aktiv" : "Nicht aktiviert"}
                  </p>
                )}
              </div>
            </Link>
          </motion.div>

          <motion.div custom={3} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} variants={heroFadeUp}>
            <Link
              href="/dashboard/profil"
              className="group flex flex-col justify-between bg-card border border-border rounded-2xl p-6 hover:border-[#2563eb]/40 hover:shadow-sm transition-all min-h-[164px]"
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center shrink-0">
                  <UserRound className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-[#2563eb] group-hover:-translate-y-0.5 transition-all" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Profil</p>
                <p className="text-sm text-muted-foreground mt-1.5">Ihre Kontodaten verwalten.</p>
              </div>
            </Link>
          </motion.div>
        </div>

        <SupportTicketSection />
      </div>
    </CustomerPortalLayout>
  );
}
