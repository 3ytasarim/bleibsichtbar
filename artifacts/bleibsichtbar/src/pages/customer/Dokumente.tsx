import { CustomerPortalLayout } from "@/components/layout/CustomerPortalLayout";
import { useGetPortalDocuments, type CustomerDocument } from "@workspace/api-client-react";
import { FileStack, Loader2, FileText, FileDown } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  briefing: "Briefing",
  strategy: "Social Media Strategie",
  brand: "Brand Information",
  other: "Sonstiges",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
}

export default function CustomerDokumente() {
  const { data: documents = [], isLoading, isError } = useGetPortalDocuments();

  return (
    <CustomerPortalLayout>
      <div className="max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-bold font-display flex items-center gap-3">
          <FileStack className="w-7 h-7 text-accent" /> Dokumente
        </h1>
        <p className="text-muted-foreground mt-2">Ihre Briefings, Strategien und Markeninformationen.</p>

        <div className="mt-8 bg-card rounded-2xl border border-border overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
              <Loader2 className="w-5 h-5 animate-spin" /> Lade Dokumente...
            </div>
          ) : isError ? (
            <div className="text-center py-16">
              <p className="font-medium text-destructive">Dokumente konnten nicht geladen werden.</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-16">
              <FileStack className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="font-medium">Noch keine Dokumente vorhanden.</p>
              <p className="text-sm text-muted-foreground mt-1">Ihr Ansprechpartner lädt hier künftig Briefings, Strategien und Markeninformationen hoch.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {documents.map((doc: CustomerDocument) => (
                <a
                  key={doc.id}
                  href={doc.fileReference}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 hover:bg-muted/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{doc.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {CATEGORY_LABELS[doc.category] ?? doc.category} · {formatDate(doc.createdAt)}
                    </p>
                  </div>
                  <FileDown className="w-5 h-5 text-muted-foreground shrink-0" />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </CustomerPortalLayout>
  );
}
