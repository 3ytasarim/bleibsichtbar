import { CustomerPortalLayout } from "@/components/layout/CustomerPortalLayout";
import { useGetPortalContentPlanning, type NotionBlockNode, type NotionRichText } from "@workspace/api-client-react";
import { NotebookText, Loader2, CheckSquare, Square } from "lucide-react";

function RichText({ parts }: { parts?: NotionRichText[] }) {
  if (!parts || parts.length === 0) return null;
  return (
    <>
      {parts.map((t, i) => {
        let node: React.ReactNode = t.text;
        if (t.code) node = <code key={i} className="bg-muted px-1.5 py-0.5 rounded text-[0.9em] font-mono">{node}</code>;
        return (
          <span
            key={i}
            className={[
              t.bold ? "font-semibold" : "",
              t.italic ? "italic" : "",
              t.strikethrough ? "line-through" : "",
            ].filter(Boolean).join(" ")}
          >
            {t.href ? (
              <a href={t.href} target="_blank" rel="noopener noreferrer" className="text-[#2563eb] hover:underline">
                {node}
              </a>
            ) : (
              node
            )}
          </span>
        );
      })}
    </>
  );
}

/** Recursively renders one Notion block and its children — unrecognized block types are skipped silently rather than breaking the whole page. */
function Block({ block }: { block: NotionBlockNode }) {
  const children = block.children && block.children.length > 0 ? (
    <div className="pl-5 mt-1 space-y-1">
      {block.children.map((c) => <Block key={c.id} block={c} />)}
    </div>
  ) : null;

  switch (block.type) {
    case "heading_1":
      return <h2 className="text-xl font-bold font-display text-foreground mt-6 mb-2 first:mt-0"><RichText parts={block.richText} /></h2>;
    case "heading_2":
      return <h3 className="text-lg font-bold font-display text-foreground mt-5 mb-2 first:mt-0"><RichText parts={block.richText} /></h3>;
    case "heading_3":
      return <h4 className="text-base font-semibold text-foreground mt-4 mb-1.5 first:mt-0"><RichText parts={block.richText} /></h4>;
    case "paragraph":
      return (
        <>
          <p className="text-sm text-foreground/90 leading-relaxed"><RichText parts={block.richText} /></p>
          {children}
        </>
      );
    case "bulleted_list_item":
      return (
        <div className="flex gap-2 text-sm text-foreground/90 leading-relaxed">
          <span className="text-muted-foreground shrink-0">•</span>
          <div className="min-w-0"><RichText parts={block.richText} />{children}</div>
        </div>
      );
    case "numbered_list_item":
      return (
        <div className="flex gap-2 text-sm text-foreground/90 leading-relaxed">
          <span className="text-muted-foreground shrink-0">–</span>
          <div className="min-w-0"><RichText parts={block.richText} />{children}</div>
        </div>
      );
    case "to_do":
      return (
        <div className="flex items-start gap-2 text-sm leading-relaxed">
          {block.checked ? (
            <CheckSquare className="w-4 h-4 mt-0.5 shrink-0 text-[#2563eb]" />
          ) : (
            <Square className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
          )}
          <div className={`min-w-0 ${block.checked ? "line-through text-muted-foreground" : "text-foreground/90"}`}>
            <RichText parts={block.richText} />
            {children}
          </div>
        </div>
      );
    case "quote":
      return (
        <blockquote className="border-l-2 border-[#2563eb]/40 pl-3 text-sm text-foreground/80 italic">
          <RichText parts={block.richText} />
        </blockquote>
      );
    case "callout":
      return (
        <div className="flex gap-3 bg-[#2563eb]/5 border border-[#2563eb]/15 rounded-xl p-3.5 text-sm text-foreground/90">
          {block.icon && <span className="shrink-0">{block.icon}</span>}
          <div className="min-w-0"><RichText parts={block.richText} />{children}</div>
        </div>
      );
    case "code":
      return (
        <pre className="bg-muted rounded-xl p-3.5 text-xs font-mono overflow-x-auto text-foreground/90">
          <code>{block.richText?.map((t) => t.text).join("")}</code>
        </pre>
      );
    case "toggle":
      return (
        <details className="text-sm text-foreground/90 [&_summary]:cursor-pointer">
          <summary className="font-medium"><RichText parts={block.richText} /></summary>
          {children}
        </details>
      );
    case "image":
      return block.imageUrl ? (
        <figure>
          <img src={block.imageUrl} alt={block.caption ?? ""} className="rounded-xl border border-border max-w-full" />
          {block.caption && <figcaption className="text-xs text-muted-foreground mt-1.5">{block.caption}</figcaption>}
        </figure>
      ) : null;
    case "divider":
      return <hr className="border-border" />;
    default:
      return children;
  }
}

export default function CustomerContentPlanung() {
  const { data, isLoading, isError } = useGetPortalContentPlanning();

  return (
    <CustomerPortalLayout>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display flex items-center gap-3">
          <NotebookText className="w-7 h-7 text-[#2563eb]" /> Content Planung
        </h1>
        <p className="text-muted-foreground mt-2">Ihr Planungs-Dokument — live aus Notion, nur für Sie sichtbar.</p>

        <div className="mt-8 bg-card rounded-2xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Lade Content Planung...
            </div>
          ) : isError ? (
            <div className="text-center py-16">
              <p className="font-medium text-destructive">Content Planung konnte nicht geladen werden.</p>
            </div>
          ) : !data?.enabled ? (
            <div className="text-center py-16">
              <NotebookText className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="font-medium">Content Planung ist für dieses Konto noch nicht aktiviert.</p>
              <p className="text-sm text-muted-foreground mt-1">Bitte wenden Sie sich an Ihren Ansprechpartner.</p>
            </div>
          ) : (
            <div className="p-6 sm:p-8 space-y-3">
              {data.title && <h1 className="text-2xl font-bold font-display text-foreground mb-4">{data.title}</h1>}
              {data.blocks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="font-medium text-muted-foreground">Diese Seite ist noch leer.</p>
                </div>
              ) : (
                data.blocks.map((b) => <Block key={b.id} block={b} />)
              )}
            </div>
          )}
        </div>
      </div>
    </CustomerPortalLayout>
  );
}
