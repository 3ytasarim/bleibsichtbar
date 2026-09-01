/**
 * Buffer GraphQL API client. Buffer's API is GraphQL-only (single POST
 * endpoint), Bearer-token authenticated. One shared Buffer account holds
 * every client's connected Instagram/TikTok channel — a customer is mapped
 * to their channel by matching `bufferChannelName` (the Buffer channel's
 * `name`, e.g. an Instagram handle) against the live channel list, resolved
 * to a real channelId at publish time rather than stored statically, so a
 * reconnected/renamed channel in Buffer doesn't silently break anything.
 *
 * BUFFER_API_KEY must be set in the environment — never hardcoded, never
 * logged.
 */

const BUFFER_API_URL = "https://api.buffer.com";

interface BufferGraphQLError {
  message: string;
}

interface BufferGraphQLResponse<T> {
  data?: T;
  errors?: BufferGraphQLError[];
}

async function bufferGraphQL<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const apiKey = process.env.BUFFER_API_KEY;
  if (!apiKey) {
    throw new Error("BUFFER_API_KEY ist nicht konfiguriert.");
  }

  const res = await fetch(BUFFER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Buffer API antwortete mit Status ${res.status}.`);
  }

  const json = (await res.json()) as BufferGraphQLResponse<T>;
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  if (!json.data) {
    throw new Error("Buffer API: leere Antwort.");
  }
  return json.data;
}

export interface BufferChannel {
  id: string;
  name: string;
  displayName: string;
  service: string;
  avatar: string | null;
  isQueuePaused: boolean;
}

// The organization id rarely changes for a given account — cached in-process
// to avoid an extra round-trip on every channel lookup / post creation.
let cachedOrganizationId: string | null = null;

async function getOrganizationId(): Promise<string> {
  if (cachedOrganizationId) return cachedOrganizationId;

  const data = await bufferGraphQL<{ account: { organizations: { id: string; name: string; ownerEmail: string }[] } }>(
    `query GetOrganizations { account { organizations { id name ownerEmail } } }`
  );

  const org = data.account.organizations[0];
  if (!org) throw new Error("Kein Buffer-Organisationskonto gefunden.");
  cachedOrganizationId = org.id;
  return org.id;
}

export async function listBufferChannels(): Promise<BufferChannel[]> {
  const organizationId = await getOrganizationId();
  const data = await bufferGraphQL<{ channels: BufferChannel[] }>(
    `query GetChannels($organizationId: OrganizationId!) {
      channels(input: { organizationId: $organizationId }) {
        id
        name
        displayName
        service
        avatar
        isQueuePaused
      }
    }`,
    { organizationId }
  );
  return data.channels;
}

/**
 * Resolves a stored `bufferChannelName` to a live channelId. When the same
 * name is connected under multiple services (e.g. an Instagram AND a TikTok
 * channel both named "eat_a_cut" — a real case in this account), Instagram
 * is preferred since this portal's Content Calendar is Instagram-focused.
 * Returns null if no channel with that name is currently connected.
 */
export async function resolveBufferChannelId(channelName: string): Promise<string | null> {
  const channels = await listBufferChannels();
  const matches = channels.filter((c) => c.name.toLowerCase() === channelName.toLowerCase());
  if (matches.length === 0) return null;
  const instagram = matches.find((c) => c.service.toLowerCase() === "instagram");
  return (instagram ?? matches[0]).id;
}

export interface BufferPost {
  id: string;
  text: string;
  dueAt: string | null;
  status: string;
  channelId: string;
  /**
   * `Asset.thumbnail` is a small preview image (also used as the video
   * poster frame). `Asset.source` is the full-quality original — for images
   * a bigger version of the same file, for videos the actual playable
   * .mp4 — confirmed via introspection (the nested ImageAsset.image /
   * VideoAsset.video metadata objects expose no URL, only dimensions/
   * altText, but the top-level `source` string field on the Asset
   * interface itself does). Used for the calendar's click-to-enlarge /
   * autoplay popup.
   */
  assets: { thumbnail: string; source: string; type: string; mimeType: string }[];
}

/**
 * Real scheduled + already-sent posts for one channel, newest-due first —
 * this is what powers the customer-facing calendar. It reflects Buffer's
 * actual state, not just what was created through this portal's own
 * "Buffer'a Zamanla" button, so anything the team schedules directly in
 * Buffer's own UI shows up here too.
 */
export async function listBufferPosts(channelId: string): Promise<BufferPost[]> {
  const organizationId = await getOrganizationId();
  const data = await bufferGraphQL<{ posts: { edges: { node: BufferPost }[] } }>(
    `query GetPosts($organizationId: OrganizationId!, $channelIds: [ChannelId!], $statuses: [PostStatus!]) {
      posts(
        input: {
          organizationId: $organizationId
          filter: { channelIds: $channelIds, status: $statuses }
          sort: [{ field: dueAt, direction: desc }]
        }
      ) {
        edges {
          node {
            id
            text
            dueAt
            status
            channelId
            assets { thumbnail source type mimeType }
          }
        }
      }
    }`,
    { organizationId, channelIds: [channelId], statuses: ["scheduled", "sent"] }
  );
  return data.posts.edges.map((e) => e.node);
}

