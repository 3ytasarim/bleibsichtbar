import { useState } from "react";
import { motion } from "framer-motion";
import { CustomerPortalLayout } from "@/components/layout/CustomerPortalLayout";
import { ConfettiBurst } from "@/components/shared/ConfettiBurst";
import { TrophyPop } from "@/components/shared/TrophyPop";
import { useEnteredView } from "@/hooks/useEnteredView";
import { useGetPortalInstagram, type PortalInstagramTimeSeriesPoint, type PortalMonthlyMetric, type GetPortalInstagramParams } from "@workspace/api-client-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  RadialBar,
  RadialBarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  CartesianGrid,
  XAxis,
  Label,
  ResponsiveContainer,
} from "recharts";
import {
  Instagram as InstagramIcon,
  Loader2,
  Users,
  Image as ImageIcon,
  Handshake,
  UserCheck,
  Trophy,
  Sparkles,
  CalendarRange,
} from "lucide-react";

// Neutral trend-line color — the sparkline shows the data's shape only, no
// good/bad judgment attached (no percentage badge, no red/green coding).
const SPARKLINE_COLOR = "#2563eb";

function MiniSparkline({ id, data }: { id: string; data: number[] }) {
  if (data.length < 2) return null;
  const points = data.map((v, i) => ({ i, v }));

  return (
    <div className="h-10 -mx-1 mt-3">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={SPARKLINE_COLOR} stopOpacity={0.3} />
              <stop offset="100%" stopColor={SPARKLINE_COLOR} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area dataKey="v" type="monotone" stroke={SPARKLINE_COLOR} strokeWidth={1.5} fill={`url(#${id})`} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface KpiCardProps {
  icon: React.ElementType;
  label: string;
  value: number | null | undefined;
  hint: string;
  sparkline?: number[];
}

function KpiCard({ icon: Icon, label, value, hint, sparkline }: KpiCardProps) {
  return (
    <div className="relative overflow-hidden bg-card rounded-2xl border border-border p-5 hover:border-[#2563eb]/30 hover:shadow-sm transition-all">
      <div className="w-10 h-10 rounded-xl bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center">
        <Icon className="w-[18px] h-[18px]" />
      </div>
      <p className="text-2xl font-bold font-display mt-3 leading-none tabular-nums">
        {value != null ? value.toLocaleString("de-DE") : "—"}
      </p>
      <p className="text-sm font-medium text-foreground mt-1.5">{label}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
      {sparkline && sparkline.length > 1 && <MiniSparkline id={`spark-${label}`} data={sparkline} />}
    </div>
  );
}

function ChartCard({
  title,
  description,
  badge,
  celebrate,
  children,
}: {
  title: string;
  description: string;
  badge?: string;
  /** When true, plays a one-shot 10s confetti burst the first time this card scrolls into view. */
  celebrate?: boolean;
  children: React.ReactNode;
}) {
  const { ref, entered } = useEnteredView<HTMLDivElement>();
  return (
    <div ref={ref} className="relative overflow-hidden bg-card rounded-2xl border border-border p-6">
      {celebrate && <ConfettiBurst active={entered} />}
      {celebrate && <TrophyPop active={entered} />}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        </div>
        {badge && (
          <span className="text-[10px] font-medium uppercase tracking-wide text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full shrink-0">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

const trendConfig = {
  value: { label: "Wert", color: "hsl(199 89% 48%)" },
} satisfies ChartConfig;

/** Real number of days in the current calendar month — 28/29/30/31, never a fixed guess. */
function daysInCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

type RangeSelection =
  | { mode: "default" }
  | { mode: "days"; days: number }
  | { mode: "custom"; from: string; to: string };

const DAY_PRESETS = [5, 7, 14, 30];

function rangeToParams(sel: RangeSelection): GetPortalInstagramParams | undefined {
  if (sel.mode === "days") return { days: sel.days };
  if (sel.mode === "custom" && sel.from) return { since: sel.from, until: sel.to || undefined };
  return undefined;
}

/** How many days this selection actually spans — feeds the display label. */
function rangeLookbackDays(sel: RangeSelection): number {
  if (sel.mode === "days") return sel.days;
  if (sel.mode === "custom" && sel.from) {
    const to = sel.to ? new Date(sel.to + "T00:00:00") : new Date();
    const from = new Date(sel.from + "T00:00:00");
    return Math.max(1, Math.round((to.getTime() - from.getTime()) / 86400000) + 1);
  }
  return daysInCurrentMonth();
}

function rangeLabel(sel: RangeSelection): string {
  if (sel.mode === "custom" && sel.from) {
    const fmt = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
    return `${fmt(sel.from)} – ${sel.to ? fmt(sel.to) : "heute"}`;
  }
  return `Letzte ${rangeLookbackDays(sel)} Tage`;
}

function pillClass(active: boolean) {
  return `px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
    active ? "bg-[#2563eb] text-white" : "bg-muted text-muted-foreground hover:text-foreground"
  }`;
}

/**
 * Shared date-range control for the Kennzahlen KPIs + Entwicklung/Muster
 * charts below it — they all read from the same insights.reachSeries /
 * followerSeries, so one filter drives all of them consistently.
 */
function DateRangeFilter({ selection, onChange }: { selection: RangeSelection; onChange: (s: RangeSelection) => void }) {
  const [showCustom, setShowCustom] = useState(selection.mode === "custom");
  const [fromDraft, setFromDraft] = useState(selection.mode === "custom" ? selection.from : "");
  const [toDraft, setToDraft] = useState(selection.mode === "custom" ? selection.to : "");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground shrink-0">
        <CalendarRange className="w-3.5 h-3.5" /> Zeitraum:
      </span>
      <button type="button" onClick={() => { setShowCustom(false); onChange({ mode: "default" }); }} className={pillClass(selection.mode === "default")}>
        Dieser Monat
      </button>
      {DAY_PRESETS.map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => { setShowCustom(false); onChange({ mode: "days", days: d }); }}
          className={pillClass(selection.mode === "days" && selection.days === d)}
        >
          {d} Tage
        </button>
      ))}
      <button type="button" onClick={() => setShowCustom((v) => !v)} className={pillClass(selection.mode === "custom" || showCustom)}>
        Benutzerdefiniert
      </button>
      {showCustom && (
        <div className="flex items-center gap-1.5">
          <Input type="date" value={fromDraft} onChange={(e) => setFromDraft(e.target.value)} className="h-8 text-xs w-[8.5rem]" />
          <span className="text-xs text-muted-foreground">bis</span>
          <Input type="date" value={toDraft} onChange={(e) => setToDraft(e.target.value)} className="h-8 text-xs w-[8.5rem]" />
          <Button type="button" size="sm" className="h-8 bg-[#2563eb] hover:bg-[#2563eb]/90" disabled={!fromDraft} onClick={() => onChange({ mode: "custom", from: fromDraft, to: toDraft })}>
            Anwenden
          </Button>
        </div>
      )}
    </div>
  );
}

function formatTick(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "short" });
}

function findPeak(data: PortalInstagramTimeSeriesPoint[]) {
  return data.reduce((best, p) => (p.value > best.value ? p : best), data[0]);
}

function ChartTypeToggle({ mode, onChange }: { mode: "area" | "bar"; onChange: (m: "area" | "bar") => void }) {
  return (
    <div className="inline-flex items-center gap-0.5 bg-muted rounded-lg p-0.5">
      {(["area", "bar"] as const).map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
            mode === m ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {m === "area" ? "Fläche" : "Balken"}
        </button>
      ))}
    </div>
  );
}

function ReachAreaChart({ data, rangeLabel }: { data: PortalInstagramTimeSeriesPoint[] | null | undefined; rangeLabel: string }) {
  const [mode, setMode] = useState<"area" | "bar">("area");
  const hasData = data && data.length > 1;
  const total = hasData ? data![data!.length - 1].value : undefined;
  const peak = hasData ? findPeak(data!) : undefined;

  return (
    <ChartCard
      title="Reichweite"
      description={`Erreichte Konten pro Tag · ${rangeLabel}`}
      badge={total !== undefined ? `Heute ${total}` : undefined}
      celebrate={!!peak}
    >
      {!hasData ? (
        <EmptyChart />
      ) : (
        <>
          <div className="flex justify-end mb-2">
            <ChartTypeToggle mode={mode} onChange={setMode} />
          </div>
          <ChartContainer config={trendConfig} className="h-[280px] w-full aspect-auto">
            {mode === "area" ? (
              <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="fill-reach" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tickFormatter={formatTick} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={(v) => formatTick(v as string)} indicator="line" />} />
                <Area dataKey="value" type="monotone" fill="url(#fill-reach)" stroke="var(--color-value)" strokeWidth={2} isAnimationActive={false} />
              </AreaChart>
            ) : (
              <BarChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tickFormatter={formatTick} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={(v) => formatTick(v as string)} indicator="dashed" />} />
                <Bar dataKey="value" fill="var(--color-value)" radius={4} />
              </BarChart>
            )}
          </ChartContainer>
          {peak && (
            <div className="flex items-center gap-2.5 mt-3 rounded-xl bg-emerald-500/10 px-3.5 py-2.5">
              <Trophy className="w-5 h-5 text-emerald-600 shrink-0" />
              <p className="text-sm sm:text-base font-bold text-emerald-700">
                Bester Tag: {formatTick(peak.date)} mit {peak.value.toLocaleString("de-DE")} erreichten Konten
              </p>
            </div>
          )}
        </>
      )}
    </ChartCard>
  );
}

function findBestGrowthDay(data: PortalInstagramTimeSeriesPoint[]) {
  let best: { date: string; gain: number } | undefined;
  for (let i = 1; i < data.length; i++) {
    const gain = data[i].value - data[i - 1].value;
    if (!best || gain > best.gain) best = { date: data[i].date, gain };
  }
  return best && best.gain > 0 ? best : undefined;
}

function FollowerLineChart({ data, rangeLabel }: { data: PortalInstagramTimeSeriesPoint[] | null | undefined; rangeLabel: string }) {
  const hasData = data && data.length > 1;
  const total = hasData ? data![data!.length - 1].value : undefined;
  const bestGrowth = hasData ? findBestGrowthDay(data!) : undefined;

  return (
    <ChartCard
      title="Follower-Entwicklung"
      description={`Gesamtbestand über Zeit · ${rangeLabel}`}
      badge={total !== undefined ? total.toLocaleString("de-DE") : undefined}
      celebrate={!!bestGrowth}
    >
      {!hasData ? (
        <EmptyChart />
      ) : (
        <>
        <ChartContainer config={trendConfig} className="h-[280px] w-full aspect-auto">
          <LineChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} tickFormatter={formatTick} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent labelFormatter={(v) => formatTick(v as string)} indicator="dot" />} />
            <Line dataKey="value" type="monotone" stroke="var(--color-value)" strokeWidth={2.5} dot={false} isAnimationActive={false} />
          </LineChart>
        </ChartContainer>
        {bestGrowth && (
          <div className="flex items-center gap-2.5 mt-3 rounded-xl bg-emerald-500/10 px-3.5 py-2.5">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm sm:text-base font-bold text-emerald-700">
              Stärkster Zuwachs: {formatTick(bestGrowth.date)} mit +{bestGrowth.gain.toLocaleString("de-DE")} Followern
            </p>
          </div>
        )}
        </>
      )}
    </ChartCard>
  );
}

const activityConfig = {
  value: { label: "Heute", color: "hsl(199 89% 48%)" },
} satisfies ChartConfig;

interface ActivityDatum {
  metric: string;
  value: number;
}

function ActivityBarChart({ data }: { data: ActivityDatum[] }) {
  return (
    <ChartCard title="Tagesaktivität" description="Interaktionen, Profil & Klicks · heute">
      <ChartContainer config={activityConfig} className="h-[220px] w-full aspect-auto">
        <BarChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis dataKey="metric" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
          <Bar dataKey="value" fill="var(--color-value)" radius={6} barSize={48} isAnimationActive={false} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}

const PIE_COLORS = ["hsl(199 89% 48%)", "hsl(160 84% 39%)", "hsl(215 20% 55%)", "hsl(199 60% 75%)", "hsl(160 50% 60%)"];

interface PieDatum {
  name: string;
  value: number;
}

function InteractionPieChart({ data }: { data: PieDatum[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const pieConfig = Object.fromEntries(data.map((d, i) => [d.name, { label: d.name, color: PIE_COLORS[i % PIE_COLORS.length] }])) as ChartConfig;

  return (
    <ChartCard title="Interaktions-Verteilung" description="Likes, Kommentare & Speichern · heute">
      {total === 0 ? (
        <EmptyChart label="Heute noch keine Interaktionen." />
      ) : (
        <>
          <ChartContainer config={pieConfig} className="h-[200px] w-full aspect-auto">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4} cornerRadius={6} strokeWidth={0} isAnimationActive={false}>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (!viewBox || !("cx" in viewBox)) return null;
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-xl font-bold font-display">
                          {total.toLocaleString("de-DE")}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 18} className="fill-muted-foreground text-[11px]">
                          gesamt
                        </tspan>
                      </text>
                    );
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-2">
            {data.map((d, i) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                {d.name} <span className="text-foreground font-medium">{d.value}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </ChartCard>
  );
}

const radialConfig = {
  rate: { label: "Engagement-Rate", color: "hsl(160 84% 39%)" },
} satisfies ChartConfig;

function EngagementRadialChart({ reach, accountsEngaged }: { reach: number | null | undefined; accountsEngaged: number | null | undefined }) {
  const hasData = reach != null && accountsEngaged != null && reach > 0;
  const rate = hasData ? Math.min(100, Math.round((accountsEngaged! / reach!) * 1000) / 10) : 0;
  const data = [{ name: "rate", value: rate, fill: "hsl(160 84% 39%)" }];

  return (
    <ChartCard title="Engagement-Rate" description="Engagierte Konten ÷ Reichweite · heute">
      {!hasData ? (
        <EmptyChart />
      ) : (
        <ChartContainer config={radialConfig} className="h-[220px] w-full aspect-auto">
          <RadialBarChart data={data} innerRadius={70} outerRadius={110} startAngle={90} endAngle={90 - 360 * (rate / 100)}>
            <PolarGrid gridType="circle" radialLines={false} stroke="none" className="first:fill-muted last:fill-background" polarRadius={[74, 66]} />
            <RadialBar dataKey="value" background cornerRadius={10} isAnimationActive={false} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || !("cx" in viewBox)) return null;
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                      <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-2xl font-bold font-display">
                        {rate}%
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 20} className="fill-muted-foreground text-[11px]">
                        Rate
                      </tspan>
                    </text>
                  );
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      )}
    </ChartCard>
  );
}

const WEEKDAY_LABELS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];

const weekdayConfig = {
  value: { label: "Ø Reichweite", color: "hsl(199 89% 48%)" },
} satisfies ChartConfig;

function ReachWeekdayRadarChart({ data, rangeLabel }: { data: PortalInstagramTimeSeriesPoint[] | null | undefined; rangeLabel: string }) {
  const hasData = data && data.length >= 7;
  const grouped = hasData ? groupByWeekday(data!) : [];

  return (
    <ChartCard title="Reichweite nach Wochentag" description={`Durchschnitt · ${rangeLabel}`}>
      {!hasData ? (
        <EmptyChart />
      ) : (
        <ChartContainer config={weekdayConfig} className="h-[300px] w-full aspect-auto">
          <RadarChart data={grouped}>
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <PolarAngleAxis dataKey="day" fontSize={11} />
            <PolarGrid />
            <Radar dataKey="value" fill="var(--color-value)" fillOpacity={0.2} stroke="var(--color-value)" strokeWidth={2} isAnimationActive={false} />
          </RadarChart>
        </ChartContainer>
      )}
    </ChartCard>
  );
}

function groupByWeekday(series: PortalInstagramTimeSeriesPoint[]) {
  const sums = new Array(7).fill(0);
  const counts = new Array(7).fill(0);
  for (const point of series) {
    const dow = new Date(point.date + "T00:00:00").getDay();
    sums[dow] += point.value;
    counts[dow] += 1;
  }
  return WEEKDAY_LABELS.map((day, i) => ({ day, value: counts[i] > 0 ? Math.round((sums[i] / counts[i]) * 10) / 10 : 0 }));
}

function EmptyChart({ label = "Für diesen Zeitraum noch nicht genügend Daten." }: { label?: string }) {
  return <div className="h-[180px] flex items-center justify-center text-sm text-muted-foreground text-center px-4">{label}</div>;
}

type MonthlyMetricKey = "followers" | "reach" | "totalInteractions" | "profileViews" | "accountsEngaged";

const MONTHLY_METRICS: { key: MonthlyMetricKey; label: string }[] = [
  { key: "followers", label: "Follower" },
  { key: "reach", label: "Reichweite" },
  { key: "totalInteractions", label: "Interaktionen" },
  { key: "profileViews", label: "Profilaktivität" },
  { key: "accountsEngaged", label: "Engagierte Konten" },
];

const MONTH_NUMBERS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

// Green-led palette for Jahresvergleich lines — distinct from the pie
// chart's own PIE_COLORS so changing one doesn't affect the other.
const YEAR_COLORS = ["hsl(160 84% 39%)", "hsl(199 89% 48%)", "hsl(38 92% 50%)", "hsl(160 50% 60%)", "hsl(215 20% 55%)"];

function formatMonthShort(monthNum: string) {
  return new Date(`2000-${monthNum}-01T00:00:00`).toLocaleDateString("de-DE", { month: "short" });
}

function formatYearMonthLabel(yearMonth: string) {
  const d = new Date(yearMonth + "-01T00:00:00");
  return d.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
}

/**
 * Same metric across every recorded year, one line per year, aligned on
 * month (Jan–Dez) so e.g. this August lines up with last August. Builds
 * entirely from real monthlyHistory rows — a year with no data for a given
 * month just leaves a gap in that year's line rather than interpolating.
 */
function YearComparisonChart({ data }: { data: PortalMonthlyMetric[] | null | undefined }) {
  const hasData = data && data.length > 0;
  const [metric, setMetric] = useState<MonthlyMetricKey>("followers");

  const years = hasData ? Array.from(new Set(data!.map((m) => m.yearMonth.slice(0, 4)))).sort() : [];

  const chartData = MONTH_NUMBERS.map((monthNum) => {
    const row: Record<string, number | string | undefined> = { month: monthNum };
    for (const year of years) {
      const entry = data!.find((m) => m.yearMonth === `${year}-${monthNum}`);
      row[year] = entry?.[metric] ?? undefined;
    }
    return row;
  });

  const yearColors = years.reduce<Record<string, string>>((acc, year, i) => {
    acc[year] = YEAR_COLORS[i % YEAR_COLORS.length];
    return acc;
  }, {});
  const yearConfig = Object.fromEntries(years.map((y) => [y, { label: y, color: yearColors[y] }])) as ChartConfig;

  return (
    <ChartCard title="Jahresvergleich" description="Jeder Monat über alle erfassten Jahre hinweg vergleichen">
      {!hasData ? (
        <EmptyChart label="Noch kein abgeschlossener Monat erfasst — diese Ansicht baut sich ab jetzt automatisch auf." />
      ) : (
        <>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {MONTHLY_METRICS.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMetric(m.key)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  metric === m.key ? "bg-[#2563eb] text-white" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <ChartContainer config={yearConfig} className="h-[220px] w-full aspect-auto">
            <LineChart data={chartData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={formatMonthShort} />
              <ChartTooltip cursor={{ strokeDasharray: "3 3" }} content={<ChartTooltipContent labelFormatter={(v) => formatMonthShort(v as string)} indicator="line" />} />
              <ChartLegend content={<ChartLegendContent />} />
              {years.map((year) => (
                <Line
                  key={year}
                  dataKey={year}
                  type="monotone"
                  stroke={yearColors[year]}
                  strokeWidth={2.5}
                  isAnimationActive={false}
                  connectNulls
                  dot={{ r: 3, fill: yearColors[year], strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ChartContainer>

          {years.length < 2 && (
            <p className="text-[11px] text-muted-foreground mt-2">
              Erst {years[0]} erfasst — sobald ein weiteres Jahr Daten hat, erscheint hier ein echter Jahresvergleich.
            </p>
          )}

          <div className="mt-5 pt-4 border-t border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">Monat für Monat</p>
            <div className="space-y-1.5">
              {data!
                .filter((entry) => entry[metric] != null)
                .slice()
                .reverse()
                .map((entry) => (
                  <div key={entry.yearMonth} className="flex items-center justify-between py-1.5 px-1 rounded-lg hover:bg-muted/40 transition-colors">
                    <span className="text-sm text-foreground">{formatYearMonthLabel(entry.yearMonth)}</span>
                    <span className="text-sm font-semibold tabular-nums text-foreground">{(entry[metric] as number).toLocaleString("de-DE")}</span>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </ChartCard>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={fadeUp} className="mt-10">
      <h2 className="text-lg font-semibold font-display mb-4">{title}</h2>
      {children}
    </motion.div>
  );
}

export default function CustomerInstagram() {
  const [range, setRange] = useState<RangeSelection>({ mode: "default" });
  const { data, isLoading } = useGetPortalInstagram(rangeToParams(range));
  const insights = data?.insights;

  const activityData: ActivityDatum[] = [
    { metric: "Interaktionen", value: insights?.totalInteractions ?? 0 },
    { metric: "Profilaktivität", value: insights?.profileViews ?? 0 },
    { metric: "Engagiert", value: insights?.accountsEngaged ?? 0 },
    { metric: "Klicks", value: insights?.websiteClicks ?? 0 },
  ];

  const pieData: PieDatum[] = [
    { name: "Likes", value: insights?.likes ?? 0 },
    { name: "Kommentare", value: insights?.comments ?? 0 },
    { name: "Speichern", value: insights?.saves ?? 0 },
    { name: "Shares", value: insights?.shares ?? 0 },
  ].filter((d) => d.value > 0);

  const rangeText = rangeLabel(range);

  return (
    <CustomerPortalLayout>
      <div className="w-full">
        <h1 className="text-2xl sm:text-3xl font-bold font-display flex items-center gap-3">
          <InstagramIcon className="w-7 h-7 text-[#2563eb]" /> Instagram
        </h1>
        <p className="text-muted-foreground mt-2">Ihr Social-Media-Dashboard für Instagram.</p>

        <div className="mt-8 bg-card rounded-2xl border border-border p-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Lade Instagram-Daten...
            </div>
          ) : !data?.connected ? (
            <div className="text-center py-8">
              <InstagramIcon className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="font-medium">Instagram ist für dieses Konto noch nicht verbunden.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Bitte wenden Sie sich an Ihren Ansprechpartner, um die Verbindung einzurichten.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center shrink-0">
                <InstagramIcon className="w-7 h-7" />
              </div>
              <div>
                <p className="text-lg font-semibold">@{data.username}</p>
                <p className="text-sm text-muted-foreground">Verbundenes Instagram-Konto</p>
              </div>
            </div>
          )}
        </div>

        {!isLoading && data?.connected && (
          <>
            <div className="mt-6">
              <DateRangeFilter selection={range} onChange={setRange} />
            </div>

            <Section title="Kennzahlen">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <KpiCard icon={Users} label="Follower" value={data.followers} hint={rangeText} sparkline={insights?.followerSeries?.map((p) => p.value)} />
                <KpiCard icon={ImageIcon} label="Beiträge" value={data.mediaCount} hint="Veröffentlicht" />
                <KpiCard icon={Handshake} label="Reichweite" value={insights?.reach} hint={rangeText} sparkline={insights?.reachSeries?.map((p) => p.value)} />
                <KpiCard icon={UserCheck} label="Profilaktivität" value={insights?.profileViews} hint="Profilbesuche heute" />
                <KpiCard icon={Users} label="Engagierte Konten" value={insights?.accountsEngaged} hint="Heute interagiert" />
                <KpiCard icon={Handshake} label="Website-Klicks" value={insights?.websiteClicks} hint="Heute" />
              </div>
              {!insights && (
                <p className="text-xs text-muted-foreground mt-3">Erweiterte Kennzahlen sind für dieses Konto derzeit nicht verfügbar.</p>
              )}
            </Section>

            <Section title="Entwicklung">
              <div className="grid gap-4">
                <ReachAreaChart data={insights?.reachSeries} rangeLabel={rangeText} />
                <FollowerLineChart data={insights?.followerSeries} rangeLabel={rangeText} />
              </div>
            </Section>

            <Section title="Heute im Detail">
              <div className="grid lg:grid-cols-3 gap-4">
                <ActivityBarChart data={activityData} />
                <InteractionPieChart data={pieData} />
                <EngagementRadialChart reach={insights?.reach} accountsEngaged={insights?.accountsEngaged} />
              </div>
            </Section>

            <Section title="Jahresvergleich">
              <YearComparisonChart data={data.monthlyHistory} />
            </Section>

            <Section title="Muster">
              <ReachWeekdayRadarChart data={insights?.reachSeries} rangeLabel={rangeText} />
            </Section>
          </>
        )}
      </div>
    </CustomerPortalLayout>
  );
}
