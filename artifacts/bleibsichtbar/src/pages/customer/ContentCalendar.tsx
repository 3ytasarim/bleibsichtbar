import { useMemo, useState } from "react";
import { CustomerPortalLayout } from "@/components/layout/CustomerPortalLayout";
import { useGetPortalContentCalendar, type PortalContentCalendarPost } from "@workspace/api-client-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CalendarDays, Loader2, ChevronLeft, ChevronRight, CheckCircle2, Clock, Maximize2, Play } from "lucide-react";

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

function ymKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function monthLabel(d: Date) {
  return d.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
}

/** Real calendar grid for one month — Monday-first, including the leading/trailing days needed to fill full weeks. */
function buildMonthGrid(monthDate: Date): Date[] {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  // getDay(): 0=Sun..6=Sat — convert to Monday-first offset.
  const leadingBlanks = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - leadingBlanks);

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    days.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
  }
  return days;
}

export default function CustomerContentCalendar() {
  const { data, isLoading, isError } = useGetPortalContentCalendar();
  const [viewMonth, setViewMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [lightboxPost, setLightboxPost] = useState<PortalContentCalendarPost | null>(null);

  const entries = data?.entries ?? [];
  const todayKey = dateKey(new Date());

  const byDate = useMemo(() => {
    const map = new Map<string, PortalContentCalendarPost[]>();
    for (const entry of entries) {
      if (!entry.date) continue;
      if (!map.has(entry.date)) map.set(entry.date, []);
      map.get(entry.date)!.push(entry);
    }
    return map;
  }, [entries]);

  const grid = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);
  const selectedPosts = selectedDate ? byDate.get(selectedDate) ?? [] : [];

  const goMonth = (delta: number) => {
    setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
    setSelectedDate(null);
  };

  return (
    <CustomerPortalLayout>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display flex items-center gap-3">
          <CalendarDays className="w-7 h-7 text-[#2563eb]" /> Content Calendar
        </h1>
        <p className="text-muted-foreground mt-2">Ihr echter Buffer-Kalender — geplante und veröffentlichte Beiträge für Ihr Konto.</p>

        <div className="mt-8 bg-card rounded-2xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Lade Content Calendar...
            </div>
          ) : isError ? (
            <div className="text-center py-16">
              <p className="font-medium text-destructive">Content Calendar konnte nicht geladen werden.</p>
            </div>
          ) : !data?.enabled ? (
            <div className="text-center py-16">
              <CalendarDays className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="font-medium">Content Calendar ist für dieses Konto noch nicht aktiviert.</p>
              <p className="text-sm text-muted-foreground mt-1">Bitte wenden Sie sich an Ihren Ansprechpartner.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-5 border-b border-border">
                <button onClick={() => goMonth(-1)} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors" aria-label="Vorheriger Monat">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <p className="font-semibold text-lg capitalize">{monthLabel(viewMonth)}</p>
                <button onClick={() => goMonth(1)} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors" aria-label="Nächster Monat">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-7 border-b border-border">
                {WEEKDAYS.map((w) => (
                  <div key={w} className="p-2.5 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {w}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {grid.map((day, i) => {
                  const key = dateKey(day);
                  const isCurrentMonth = ymKey(day) === ymKey(viewMonth);
                  const posts = byDate.get(key) ?? [];
                  const isToday = key === todayKey;
                  const isSelected = key === selectedDate;
                  return (
                    <button
                      key={i}
                      onClick={() => posts.length > 0 && setSelectedDate(isSelected ? null : key)}
                      disabled={posts.length === 0}
                      className={`min-h-[84px] p-2 border-b border-r border-border text-left align-top transition-colors ${
                        isCurrentMonth ? "bg-card" : "bg-muted/30"
                      } ${isSelected ? "ring-2 ring-inset ring-[#2563eb]" : ""} ${posts.length > 0 ? "hover:bg-[#2563eb]/5 cursor-pointer" : "cursor-default"}`}
                    >
                      <span className={`text-sm inline-flex items-center justify-center w-6 h-6 rounded-full ${isToday ? "bg-[#2563eb] text-white font-semibold" : isCurrentMonth ? "text-foreground" : "text-muted-foreground/50"}`}>
                        {day.getDate()}
                      </span>
                      <div className="mt-1.5 space-y-1">
                        {posts.slice(0, 2).map((p) => (
                          <div
                            key={p.id}
                            className={`text-[10px] leading-tight pl-0.5 pr-1.5 py-0.5 rounded truncate flex items-center gap-1 ${
                              p.status === "sent" ? "bg-emerald-500/10 text-emerald-700" : "bg-[#2563eb]/10 text-[#2563eb]"
                            }`}
                          >
                            {p.thumbnailUrl ? (
                              <img src={p.thumbnailUrl} alt="" className="w-3.5 h-3.5 rounded-sm object-cover shrink-0" />
                            ) : p.status === "sent" ? (
                              <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                            ) : (
                              <Clock className="w-2.5 h-2.5 shrink-0" />
                            )}
                            <span className="truncate">{p.text || "Beitrag"}</span>
                          </div>
                        ))}
                        {posts.length > 2 && <p className="text-[10px] text-muted-foreground pl-1.5">+{posts.length - 2} weitere</p>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedDate && selectedPosts.length > 0 && (
                <div className="p-5 border-t border-border bg-muted/20 space-y-3">
                  <p className="text-sm font-semibold text-foreground">
                    {new Date(selectedDate + "T00:00:00").toLocaleDateString("de-DE", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
                  </p>
                  {selectedPosts.map((p) => (
                    <div key={p.id} className="bg-card rounded-xl border border-border p-4 flex gap-4">
                      {p.thumbnailUrl && (
                        <button
                          type="button"
                          onClick={() => setLightboxPost(p)}
                          className="relative w-28 h-28 rounded-lg shrink-0 border border-border overflow-hidden group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]"
                          aria-label={p.mediaType === "video" ? "Video abspielen" : "Bild vergrößern"}
                        >
                          <img src={p.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            {p.mediaType === "video" ? (
                              <Play className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity fill-white" />
                            ) : (
                              <Maximize2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </div>
                        </button>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {p.status === "sent" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700">
                              <CheckCircle2 className="w-3 h-3" /> Veröffentlicht
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#2563eb]/10 text-[#2563eb]">
                              <Clock className="w-3 h-3" /> Geplant
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{p.text || "—"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {entries.length === 0 && (
                <div className="text-center py-12">
                  <CalendarDays className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                  <p className="font-medium">Noch keine geplanten Beiträge vorhanden.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Dialog open={!!lightboxPost} onOpenChange={(open) => !open && setLightboxPost(null)}>
        <DialogContent className="max-w-3xl w-auto bg-transparent border-none shadow-none p-0 [&>button]:bg-black/50 [&>button]:text-white [&>button]:rounded-full [&>button]:p-1.5 [&>button]:opacity-100 [&>button]:hover:bg-black/70">
          <DialogTitle className="sr-only">{lightboxPost?.mediaType === "video" ? "Video" : "Bild"}</DialogTitle>
          {lightboxPost?.mediaType === "video" ? (
            <video
              key={lightboxPost.id}
              src={lightboxPost.mediaUrl ?? lightboxPost.thumbnailUrl ?? undefined}
              poster={lightboxPost.thumbnailUrl ?? undefined}
              controls
              autoPlay
              className="max-h-[85vh] w-auto max-w-full rounded-xl mx-auto block"
            />
          ) : (
            lightboxPost && (
              <img
                src={lightboxPost.mediaUrl ?? lightboxPost.thumbnailUrl ?? undefined}
                alt=""
                className="max-h-[85vh] w-auto max-w-full rounded-xl mx-auto block"
              />
            )
          )}
        </DialogContent>
      </Dialog>
    </CustomerPortalLayout>
  );
}
