import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useT } from "@/i18n";

async function fetchSeoSlug(slug: string) {
  const res = await fetch(`/api/seo/${slug}`);
  if (!res.ok) return null;
  return res.json();
}

async function fetchSeoGlobal() {
  const res = await fetch("/api/seo/global");
  if (!res.ok) return null;
  return res.json();
}

interface SeoData {
  metaTitle?: string;
  metaDescription?: string;
  metaTitleEn?: string;
  metaDescriptionEn?: string;
  metaTitleNl?: string;
  metaDescriptionNl?: string;
  metaTitleFr?: string;
  metaDescriptionFr?: string;
  keywords?: string;
  googleVerification?: string;
}

function getLangFields(seo: SeoData | null | undefined, lang: string): { title: string; description: string } {
  if (!seo) return { title: "", description: "" };

  const langMap: Record<string, { t: keyof SeoData; d: keyof SeoData }> = {
    en:    { t: "metaTitleEn",  d: "metaDescriptionEn" },
    "nl-be": { t: "metaTitleNl",  d: "metaDescriptionNl" },
    "nl-nl": { t: "metaTitleNl",  d: "metaDescriptionNl" },
    fr:    { t: "metaTitleFr",  d: "metaDescriptionFr" },
  };

  const mapping = langMap[lang];
  if (mapping) {
    const t = (seo[mapping.t] as string) || (seo.metaTitle as string) || "";
    const d = (seo[mapping.d] as string) || (seo.metaDescription as string) || "";
    return { title: t, description: d };
  }

  return { title: seo.metaTitle || "", description: seo.metaDescription || "" };
}

export function SeoHead({ slug, defaults }: { slug: string; defaults?: Partial<SeoData> }) {
  const { lang } = useT();

  const { data: seo } = useQuery<SeoData | null>({
    queryKey: ["/api/seo", slug],
    queryFn: () => fetchSeoSlug(slug),
    staleTime: 5 * 60 * 1000,
  });

  const { data: global } = useQuery<SeoData | null>({
    queryKey: ["/api/seo", "global"],
    queryFn: () => fetchSeoGlobal(),
    staleTime: 10 * 60 * 1000,
  });

  const { title: langTitle, description: langDesc } = getLangFields(seo, lang);

  const title = langTitle || defaults?.metaTitle || "Bleibsichtbar – Social Media Agentur";
  const description = langDesc || defaults?.metaDescription || "Digitale Sichtbarkeit, die Kunden überzeugt.";
  const keywords = seo?.keywords || defaults?.keywords || "";
  const googleVerification = global?.googleVerification || "";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {googleVerification && <meta name="google-site-verification" content={googleVerification} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
    </Helmet>
  );
}
