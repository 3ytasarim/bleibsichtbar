/**
 * Notion API client (REST, Bearer-token authenticated). One shared internal
 * integration token (NOTION_API_KEY) is used to fetch every customer's own
 * Content Planung page — the integration must be explicitly shared with
 * each customer's page in Notion's UI ("Connections" on the page), just
 * like the token itself must be kept private. Content is fetched
 * server-side and rendered in our own UI — never publicly embedded — so a
 * customer's planning page stays private even though Notion has no
 * per-customer scoping of its own.
 *
 * NOTION_API_KEY must be set in the environment — never hardcoded, never logged.
 */

const NOTION_API_URL = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

async function notionFetch<T>(path: string): Promise<T> {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    throw new Error("NOTION_API_KEY ist nicht konfiguriert.");
  }

  const res = await fetch(`${NOTION_API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Notion-Version": NOTION_VERSION,
    },
  });

  if (!res.ok) {
    const body: any = await res.json().catch(() => null);
    throw new Error(body?.message || `Notion API antwortete mit Status ${res.status}.`);
  }

  return (await res.json()) as T;
}

/**
 * Accepts either a raw Notion page ID (dashed or undashed 32-hex) or a full
 * notion.so/notion.site URL and extracts+normalizes it to the canonical
 * dashed UUID format the API expects. Returns null if nothing hex-32-like
 * can be found.
 */
export function parseNotionPageId(input: string): string | null {
  const cleaned = input.trim();
  const hexOnly = cleaned.replace(/-/g, "");
  // A Notion URL's page ID is always the last 32 hex chars in the path/slug.
  const match = hexOnly.match(/([0-9a-fA-F]{32})(?!.*[0-9a-fA-F]{32})/);
  if (!match) return null;
  const hex = match[1].toLowerCase();
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export interface NotionRichText {
  text: string;
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  href?: string | null;
}

export interface NotionBlockNode {
  id: string;
  type: string;
  richText?: NotionRichText[];
  checked?: boolean;
  imageUrl?: string;
  caption?: string;
  language?: string;
  icon?: string;
  children?: NotionBlockNode[];
}

function mapRichText(arr: any[] | undefined): NotionRichText[] {
  if (!Array.isArray(arr)) return [];
  return arr.map((t) => ({
    text: t?.plain_text ?? "",
    bold: !!t?.annotations?.bold,
    italic: !!t?.annotations?.italic,
    strikethrough: !!t?.annotations?.strikethrough,
    code: !!t?.annotations?.code,
    href: t?.href ?? null,
  }));
}

interface RawBlocksResponse {
  results: any[];
  has_more: boolean;
  next_cursor: string | null;
}

/** Real children for one block/page, paginating through all of Notion's 100-per-page results. */
async function fetchAllChildren(blockId: string): Promise<any[]> {
  const all: any[] = [];
  let cursor: string | null = null;
  do {
    const qs = cursor ? `?start_cursor=${encodeURIComponent(cursor)}&page_size=100` : `?page_size=100`;
    const page: RawBlocksResponse = await notionFetch(`/blocks/${blockId}/children${qs}`);
    all.push(...page.results);
    cursor = page.has_more ? page.next_cursor : null;
  } while (cursor);
  return all;
}

function mapBlock(raw: any): NotionBlockNode {
  const type = raw.type as string;
  const data = raw[type] ?? {};
  const node: NotionBlockNode = { id: raw.id, type };

  switch (type) {
    case "paragraph":
    case "heading_1":
    case "heading_2":
    case "heading_3":
    case "bulleted_list_item":
    case "numbered_list_item":
    case "quote":
      node.richText = mapRichText(data.rich_text);
      break;
    case "to_do":
      node.richText = mapRichText(data.rich_text);
      node.checked = !!data.checked;
      break;
    case "callout":
      node.richText = mapRichText(data.rich_text);
      node.icon = data.icon?.emoji ?? undefined;
      break;
    case "code":
      node.richText = mapRichText(data.rich_text);
      node.language = data.language ?? undefined;
      break;
    case "toggle":
      node.richText = mapRichText(data.rich_text);
      break;
    case "image": {
      const url = data.type === "external" ? data.external?.url : data.file?.url;
      node.imageUrl = url ?? undefined;
      node.caption = mapRichText(data.caption).map((t) => t.text).join("") || undefined;
      break;
    }
    case "divider":
    case "unsupported":
    default:
      break;
  }

  return node;
}

/**
 * Real page content, recursively resolved up to a bounded depth (3 levels —
 * a Content Planung page is a flat planning doc, not a deeply nested wiki,
 * and unbounded recursion would be slow/expensive on every dashboard load).
 * Blocks whose type this app doesn't render come back as `type: "unsupported"`
 * with no content, rather than throwing — one exotic block must never break
 * the whole page.
 */
export async function getNotionPageBlocks(pageId: string, depth = 0): Promise<NotionBlockNode[]> {
  const raw = await fetchAllChildren(pageId);
  const nodes = raw.map(mapBlock);

  if (depth < 3) {
    await Promise.all(
      raw.map(async (r, i) => {
        if (r.has_children && r.type !== "child_page" && r.type !== "child_database") {
          try {
            nodes[i].children = await getNotionPageBlocks(r.id, depth + 1);
          } catch {
            nodes[i].children = [];
          }
        }
      })
    );
  }

  return nodes;
}

/** Best-effort page title — a missing/unreadable title must never block the content itself from loading. */
export async function getNotionPageTitle(pageId: string): Promise<string | null> {
  try {
    const page: any = await notionFetch(`/pages/${pageId}`);
    const props = page?.properties ?? {};
    const titleProp = Object.values(props).find((p: any) => p?.type === "title") as any;
    const richText = titleProp?.title;
    if (!Array.isArray(richText)) return null;
    const title = richText.map((t: any) => t?.plain_text ?? "").join("");
    return title || null;
  } catch {
    return null;
  }
}
