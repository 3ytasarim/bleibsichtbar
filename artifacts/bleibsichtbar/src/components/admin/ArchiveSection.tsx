import { FolderOpen, ExternalLink } from "lucide-react";

export function ArchiveSection({ shareLink }: { shareLink: string | null | undefined }) {
  if (!shareLink) {
    return (
      <div className="bg-muted/40 rounded-2xl border border-dashed border-border py-16 text-center">
        <FolderOpen className="w-8 h-8 mx-auto text-muted-foreground/40 mb-3" />
        <p className="font-medium">Dateispeicher ist für diesen Kunden noch nicht aktiviert.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Nextcloud-Freigabelink lässt sich unter „Benutzer hinzufügen" → Kunde bearbeiten hinterlegen.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col h-[70vh]">
      <div className="p-3 border-b border-border flex items-center justify-end shrink-0">
        <a
          href={shareLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
        >
          In neuem Tab öffnen <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
      <iframe src={shareLink} title="Archiv" className="flex-1 w-full border-0" />
    </div>
  );
}
