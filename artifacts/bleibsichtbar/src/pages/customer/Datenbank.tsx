import { CustomerPortalLayout } from "@/components/layout/CustomerPortalLayout";
import { useGetPortalFilesKi } from "@workspace/api-client-react";
import { Database, Loader2, ExternalLink } from "lucide-react";

/** KI & Automatisierungen file area — its own Nextcloud share link, independent from the Social Media "Dateien" page. */
export default function CustomerDatenbank() {
  const { data, isLoading, isError } = useGetPortalFilesKi();

  return (
    <CustomerPortalLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <h1 className="text-2xl sm:text-3xl font-bold font-display flex items-center gap-3 shrink-0">
          <Database className="w-7 h-7 text-[#2563eb]" /> Datenbank
        </h1>
        <p className="text-muted-foreground mt-2 shrink-0">Ihr Datenbereich für KI &amp; Automatisierungen.</p>

        <div className="mt-6 flex-1 min-h-0 bg-card rounded-2xl border border-border overflow-hidden flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Lade Datenbank...
            </div>
          ) : isError || !data?.enabled || !data?.shareLink ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <Database className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="font-medium">Datenbank ist für dieses Konto noch nicht aktiviert.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Bitte wenden Sie sich an Ihren Ansprechpartner, um den Datenbereich einzurichten.
              </p>
            </div>
          ) : (
            <>
              <div className="p-3 border-b border-border flex items-center justify-end shrink-0">
                <a
                  href={data.shareLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2563eb] hover:underline"
                >
                  In neuem Tab öffnen <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <iframe
                src={data.shareLink}
                title="Datenbank"
                className="flex-1 w-full border-0"
              />
            </>
          )}
        </div>
      </div>
    </CustomerPortalLayout>
  );
}
