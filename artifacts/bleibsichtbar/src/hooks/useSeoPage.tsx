import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import React from "react";

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
  keywords?: string;
  googleVerification?: string;
}

export function SeoHead({ slug, defaults }: { slug: string; defaults?: Partial<SeoData> }) {
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

  const title = seo?.metaTitle || defaults?.metaTitle || "Bleibsichtbar – Social Media Agentur";
  const description = seo?.metaDescription || defaults?.metaDescription || "Digitale Sichtbarkeit, die Kunden überzeugt.";
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
