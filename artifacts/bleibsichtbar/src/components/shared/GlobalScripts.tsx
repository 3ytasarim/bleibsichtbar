import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface GlobalSeo {
  headScript: string;
  bodyScript: string;
  googleVerification: string;
}

async function fetchGlobalSeo(): Promise<GlobalSeo | null> {
  const res = await fetch("/api/seo/global");
  if (!res.ok) return null;
  return res.json();
}

function injectHeadScript(raw: string) {
  if (!raw.trim()) return;
  const tmp = document.createElement("div");
  tmp.innerHTML = raw;
  const scriptEls = tmp.querySelectorAll("script");
  scriptEls.forEach(old => {
    const s = document.createElement("script");
    if (old.src) s.src = old.src;
    if (old.async) s.async = true;
    if (old.defer) s.defer = true;
    Array.from(old.attributes).forEach(a => {
      if (!["src", "async", "defer"].includes(a.name)) s.setAttribute(a.name, a.value);
    });
    if (!old.src) s.textContent = old.textContent;
    s.setAttribute("data-bs-injected", "head");
    document.head.appendChild(s);
  });
}

export function GlobalScripts() {
  const { data } = useQuery<GlobalSeo | null>({
    queryKey: ["/api/seo/global"],
    queryFn: fetchGlobalSeo,
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (!data) return;
    if (document.querySelector("[data-bs-injected='head']")) return;
    if (data.headScript) injectHeadScript(data.headScript);
  }, [data]);

  if (!data?.bodyScript?.trim()) return null;

  return (
    <div
      data-bs-injected="body"
      dangerouslySetInnerHTML={{ __html: data.bodyScript }}
      style={{ display: "contents" }}
    />
  );
}
