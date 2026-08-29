const GRAPH_API_VERSION = "v21.0";
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET || "";

export interface TokenExchangeResult {
  success: boolean;
  accessToken?: string;
  expiresAt?: Date;
  error?: string;
}

/**
 * Exchanges a short-lived Instagram Login token (~1h) for a long-lived one
 * (~60 days). Requires INSTAGRAM_APP_SECRET to be configured — if it isn't,
 * this is a no-op failure and callers should fall back to storing the raw
 * token as-is rather than blocking the customer from being saved.
 */
export async function exchangeForLongLivedToken(shortLivedToken: string): Promise<TokenExchangeResult> {
  if (!INSTAGRAM_APP_SECRET) {
    return { success: false, error: "INSTAGRAM_APP_SECRET ist nicht konfiguriert." };
  }
  const url = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${encodeURIComponent(INSTAGRAM_APP_SECRET)}&access_token=${encodeURIComponent(shortLivedToken)}`;

  try {
    const response = await fetch(url);
    const data: any = await response.json();
    if (!response.ok || data.error || !data.access_token) {
      return { success: false, error: data?.error?.message || "Token-Verlängerung fehlgeschlagen" };
    }
    const expiresInSeconds = typeof data.expires_in === "number" ? data.expires_in : 60 * 24 * 60 * 60;
    return {
      success: true,
      accessToken: data.access_token,
      expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Netzwerkfehler bei der Verbindung zu Meta" };
  }
}

/**
 * Refreshes an already-long-lived token for another ~60 days. Unlike the
 * initial exchange, this does not need the app secret — the long-lived
 * token itself authorizes the refresh. Meta requires the token to be at
 * least 24h old.
 */
export async function refreshLongLivedToken(longLivedToken: string): Promise<TokenExchangeResult> {
  const url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(longLivedToken)}`;

  try {
    const response = await fetch(url);
    const data: any = await response.json();
    if (!response.ok || data.error || !data.access_token) {
      return { success: false, error: data?.error?.message || "Token-Aktualisierung fehlgeschlagen" };
    }
    const expiresInSeconds = typeof data.expires_in === "number" ? data.expires_in : 60 * 24 * 60 * 60;
    return {
      success: true,
      accessToken: data.access_token,
      expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Netzwerkfehler bei der Verbindung zu Meta" };
  }
}

export interface InstagramTestResult {
  success: boolean;
  username?: string;
  followers?: number;
  error?: string;
}

export async function testInstagramConnection(
  accountId: string,
  accessToken: string
): Promise<InstagramTestResult> {
  const url = `https://graph.instagram.com/${GRAPH_API_VERSION}/${encodeURIComponent(accountId)}?fields=username,followers_count&access_token=${encodeURIComponent(accessToken)}`;

  try {
    const response = await fetch(url);
    const data: any = await response.json();

    if (!response.ok || data.error) {
      return {
        success: false,
        error: data?.error?.message || "Instagram-Verbindung fehlgeschlagen",
      };
    }

    return {
      success: true,
      username: data.username,
      followers: data.followers_count,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Netzwerkfehler bei der Verbindung zu Meta" };
  }
}

export interface InstagramTimeSeriesPoint {
  date: string;
  value: number;
}

export interface InstagramInsights {
  reach?: number;
  accountsEngaged?: number;
  totalInteractions?: number;
  profileViews?: number;
  websiteClicks?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  replies?: number;
  reachSeries?: InstagramTimeSeriesPoint[];
  followerSeries?: InstagramTimeSeriesPoint[];
  /** Self-tracked history (not from Meta) — filled in by the portal route, starts accumulating from first load. */
  totalInteractionsSeries?: InstagramTimeSeriesPoint[];
  profileViewsSeries?: InstagramTimeSeriesPoint[];
  accountsEngagedSeries?: InstagramTimeSeriesPoint[];
}

export interface InstagramMedia {
  id: string;
  caption?: string;
  mediaType: string;
  mediaProductType?: string;
  thumbnailUrl?: string;
  permalink: string;
  timestamp: string;
  likeCount: number;
  commentsCount: number;
}

export interface InstagramProfile {
  connected: boolean;
  username?: string;
  profilePictureUrl?: string;
  followers?: number;
  mediaCount?: number;
  insights?: InstagramInsights;
  topMedia?: InstagramMedia[];
  topReels?: InstagramMedia[];
  error?: string;
}

/**
 * Fetches same-day account-level Insights (Reach, Interactions, Profile Views...).
 * Optional and best-effort: some Instagram accounts/tokens don't have Insights
 * access, so a failure here must never block the rest of the profile from loading.
 */
async function getInstagramInsights(accountId: string, accessToken: string): Promise<InstagramInsights | undefined> {
  const metrics = "reach,accounts_engaged,total_interactions,profile_views,website_clicks,likes,comments,shares,saves,replies";
  const url = `https://graph.instagram.com/${GRAPH_API_VERSION}/${encodeURIComponent(accountId)}/insights?metric=${metrics}&period=day&metric_type=total_value&access_token=${encodeURIComponent(accessToken)}`;

  try {
    const response = await fetch(url);
    const data: any = await response.json();
    if (!response.ok || data.error || !Array.isArray(data.data)) return undefined;

    const byName: Record<string, number> = {};
    for (const entry of data.data) {
      if (entry?.name && typeof entry?.total_value?.value === "number") {
        byName[entry.name] = entry.total_value.value;
      }
    }

    return {
      reach: byName.reach,
      accountsEngaged: byName.accounts_engaged,
      totalInteractions: byName.total_interactions,
      profileViews: byName.profile_views,
      websiteClicks: byName.website_clicks,
      likes: byName.likes,
      comments: byName.comments,
      shares: byName.shares,
      saves: byName.saves,
      replies: byName.replies,
    };
  } catch {
    return undefined;
  }
}

function formatInsightDate(isoEndTime: string): string {
  return isoEndTime.slice(0, 10);
}

/**
 * Fetches recent posts and ranks them by likes+comments (both come back on
 * the single /media list call — no per-post insights round trip needed, so
 * this stays cheap even with many posts). Best-effort: a failure here must
 * never block the rest of the profile from loading.
 */
async function getTopMedia(
  accountId: string,
  accessToken: string,
  limit = 15,
  reelsLimit = 8
): Promise<{ topMedia: InstagramMedia[]; topReels: InstagramMedia[] } | undefined> {
  const fields = "id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count";
  const url = `https://graph.instagram.com/${GRAPH_API_VERSION}/${encodeURIComponent(accountId)}/media?fields=${fields}&limit=30&access_token=${encodeURIComponent(accessToken)}`;

  try {
    const response = await fetch(url);
    const data: any = await response.json();
    if (!response.ok || data.error || !Array.isArray(data.data)) return undefined;

    const all: InstagramMedia[] = data.data
      .map((m: any): InstagramMedia => ({
        id: m.id,
        caption: m.caption,
        mediaType: m.media_type,
        mediaProductType: m.media_product_type,
        thumbnailUrl: m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url,
        permalink: m.permalink,
        timestamp: m.timestamp,
        likeCount: m.like_count ?? 0,
        commentsCount: m.comments_count ?? 0,
      }))
      .sort((a: InstagramMedia, b: InstagramMedia) => b.likeCount + b.commentsCount - (a.likeCount + a.commentsCount));

    return {
      topMedia: all.slice(0, limit),
      topReels: all.filter((m) => m.mediaProductType === "REELS").slice(0, reelsLimit),
    };
  } catch {
    return undefined;
  }
}

/**
 * Fetches a real daily series for a single metric, `daysBack` days up to
 * today. Only "reach" and "follower_count" support Meta's day-bucketed
 * time_series (other metrics like total_interactions only support
 * metric_type=total_value, i.e. a single current-day aggregate — confirmed
 * empirically, they return an empty series for period=day) — so this must
 * only be called for those two.
 */
async function getDailyTimeSeries(
  accountId: string,
  accessToken: string,
  metric: "reach" | "follower_count",
  since: number,
  until: number
): Promise<InstagramTimeSeriesPoint[] | undefined> {
  const url = `https://graph.instagram.com/${GRAPH_API_VERSION}/${encodeURIComponent(accountId)}/insights?metric=${metric}&period=day&since=${since}&until=${until}&access_token=${encodeURIComponent(accessToken)}`;

  try {
    const response = await fetch(url);
    const data: any = await response.json();
    const values = data?.data?.[0]?.values;
    if (!response.ok || data.error || !Array.isArray(values)) return undefined;

    return values
      .filter((v: any) => typeof v?.value === "number" && typeof v?.end_time === "string")
      .map((v: any) => ({ date: formatInsightDate(v.end_time), value: v.value as number }));
  } catch {
    return undefined;
  }
}

/** Real number of days in the current calendar month — 28/29/30/31, never a fixed guess. */
function daysInCurrentMonth(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

/** N days back from right now, as a Unix-second {since, until} pair. */
function daysBackRange(daysBack: number): { since: number; until: number } {
  const until = Math.floor(Date.now() / 1000);
  return { since: until - daysBack * 24 * 60 * 60, until };
}

/**
 * Always the real current calendar month, regardless of whatever custom
 * date-range the customer's dashboard filter is displaying — used
 * exclusively to roll up monthly_metrics, which must never be corrupted by
 * a display-only filter (e.g. "letzte 5 Tage" would otherwise make the
 * current month's roll-up sum near-zero).
 */
export async function getCurrentMonthReachSeries(accountId: string, accessToken: string): Promise<InstagramTimeSeriesPoint[] | undefined> {
  const { since, until } = daysBackRange(daysInCurrentMonth());
  return getDailyTimeSeries(accountId, accessToken, "reach", since, until);
}

/**
 * Meta's follower_count series is a daily delta (new followers gained that
 * day), not a running total. Reconstructs a real cumulative curve by
 * subtracting each day's delta backwards from today's actual follower count
 * — every point on the resulting curve is derived from genuine API data.
 */
function buildCumulativeFollowerSeries(deltas: InstagramTimeSeriesPoint[], currentTotal: number): InstagramTimeSeriesPoint[] {
  const chronological = [...deltas].sort((a, b) => a.date.localeCompare(b.date));
  const cumulative: InstagramTimeSeriesPoint[] = new Array(chronological.length);
  let runningTotal = currentTotal;
  for (let i = chronological.length - 1; i >= 0; i--) {
    cumulative[i] = { date: chronological[i].date, value: runningTotal };
    runningTotal -= chronological[i].value;
  }
  return cumulative;
}

export interface HistoricalMonth {
  yearMonth: string;
  followers: number | null;
  reach: number | null;
}

/**
 * Real historical monthly follower/reach totals, reconstructed from up to a
 * year of Meta's day-level insights (the only two metrics that support a
 * daily time_series at all — confirmed empirically). Only complete past
 * months are returned (never the current, still-in-progress month).
 * totalInteractions/profileViews/accountsEngaged are NOT included: Meta's
 * API has no historical day-level data for them, only a "today" snapshot —
 * there is no honest way to backfill those, so callers must leave them null
 * for backfilled months rather than fabricate a number.
 */
export async function getHistoricalMonthlyBackfill(
  accountId: string,
  accessToken: string,
  currentFollowers: number | undefined,
  daysBack = 365
): Promise<HistoricalMonth[]> {
  const { since, until } = daysBackRange(daysBack);
  const [reachDaily, followerDeltas] = await Promise.all([
    getDailyTimeSeries(accountId, accessToken, "reach", since, until),
    getDailyTimeSeries(accountId, accessToken, "follower_count", since, until),
  ]);

  const followerDaily =
    followerDeltas && typeof currentFollowers === "number"
      ? buildCumulativeFollowerSeries(followerDeltas, currentFollowers)
      : undefined;

  const currentYearMonth = new Date().toISOString().slice(0, 7);
  const byMonth = new Map<string, { followers: number[]; reach: number[] }>();

  const bucket = (date: string) => {
    const ym = date.slice(0, 7);
    if (ym >= currentYearMonth) return null; // skip the in-progress current month
    if (!byMonth.has(ym)) byMonth.set(ym, { followers: [], reach: [] });
    return byMonth.get(ym)!;
  };

  for (const p of followerDaily ?? []) {
    const b = bucket(p.date);
    if (b) b.followers.push(p.value);
  }
  for (const p of reachDaily ?? []) {
    const b = bucket(p.date);
    if (b) b.reach.push(p.value);
  }

  return Array.from(byMonth.entries())
    .map(([yearMonth, v]) => ({
      yearMonth,
      // Followers is a point-in-time total — use the last real reading of the month.
      followers: v.followers.length ? v.followers[v.followers.length - 1] : null,
      // Reach is per-day — sum across the month, matching rollUpCurrentMonth's semantics.
      reach: v.reach.length ? v.reach.reduce((s, n) => s + n, 0) : null,
    }))
    .sort((a, b) => a.yearMonth.localeCompare(b.yearMonth));
}

export async function getInstagramProfile(
  accountId: string,
  accessToken: string,
  options?: { daysBack?: number; since?: string; until?: string }
): Promise<InstagramProfile> {
  const url = `https://graph.instagram.com/${GRAPH_API_VERSION}/${encodeURIComponent(accountId)}?fields=username,followers_count,media_count,profile_picture_url&access_token=${encodeURIComponent(accessToken)}`;

  try {
    const response = await fetch(url);
    const data: any = await response.json();

    if (!response.ok || data.error) {
      return { connected: false, error: data?.error?.message || "Instagram-Daten konnten nicht geladen werden" };
    }

    const [insights, media] = await Promise.all([
      getInstagramInsights(accountId, accessToken),
      getTopMedia(accountId, accessToken),
    ]);

    if (insights) {
      // Both reach and follower deltas evaluate over the real current
      // calendar month (28–31 days) by default — matches the
      // "Reichweite"/"Follower" KPI cards' deltas below. The customer-facing
      // date-range filter can request either a relative window (daysBack,
      // e.g. "letzte 5 Tage") or an absolute since/until range.
      let since: number;
      let until: number;
      if (options?.since) {
        since = Math.floor(new Date(options.since + "T00:00:00Z").getTime() / 1000);
        until = options?.until
          ? Math.floor(new Date(options.until + "T23:59:59Z").getTime() / 1000)
          : Math.floor(Date.now() / 1000);
      } else {
        ({ since, until } = daysBackRange(options?.daysBack ?? daysInCurrentMonth()));
      }
      const [reachSeries, followerDeltas] = await Promise.all([
        getDailyTimeSeries(accountId, accessToken, "reach", since, until),
        getDailyTimeSeries(accountId, accessToken, "follower_count", since, until),
      ]);
      insights.reachSeries = reachSeries;
      if (followerDeltas && typeof data.followers_count === "number") {
        insights.followerSeries = buildCumulativeFollowerSeries(followerDeltas, data.followers_count);
      }
    }

    return {
      connected: true,
      username: data.username,
      profilePictureUrl: data.profile_picture_url,
      followers: data.followers_count,
      mediaCount: data.media_count,
      insights,
      topMedia: media?.topMedia,
      topReels: media?.topReels,
    };
  } catch {
    return { connected: false, error: "Netzwerkfehler bei der Verbindung zu Meta" };
  }
}
