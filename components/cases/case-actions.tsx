"use client";

import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { Copy, Printer } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getUiCopy } from "@/lib/ui-copy";

export function CaseActions({ title, locale, sourceUrl }: { title: string; locale: Locale; sourceUrl?: string | null }) {
  const ui = getUiCopy(locale);
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const [reference, setReference] = useState("");
  const [url, setUrl] = useState("");

  const prepareReference = useCallback(() => {
    const link = new URL(window.location.pathname, window.location.origin).href;
    const date = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date());
    setUrl(link);
    setReference(`RISE. ${title}. ${link}. ${ui.consulted}: ${date}.`);
    return link;
  }, [title, locale, ui.consulted]);

  useEffect(() => {
    const beforePrint = () => flushSync(() => { prepareReference(); });
    window.addEventListener("beforeprint", beforePrint);
    return () => window.removeEventListener("beforeprint", beforePrint);
  }, [prepareReference]);

  async function copyLink() {
    const link = prepareReference();
    try {
      await navigator.clipboard.writeText(link);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  function print() {
    flushSync(() => { prepareReference(); });
    window.print();
  }

  return (
    <section className="rise-case-actions page-shell mb-8 rounded-lg border border-[color:var(--color-border)] bg-white p-5" aria-label={ui.citation}>
      <div className="rise-print-hide flex flex-wrap gap-3">
        <button type="button" onClick={copyLink} className="rise-action gap-2 rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold"><Copy size={16} aria-hidden="true" />{ui.copyLink}</button>
        <button type="button" onClick={print} className="rise-action gap-2 rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold"><Printer size={16} aria-hidden="true" />{ui.print}</button>
      </div>
      <p role="status" className="rise-print-hide mt-2 text-sm">{status === "copied" ? ui.copied : status === "error" ? ui.copyFailed : ""}</p>
      {status === "error" ? <input aria-label={ui.copyLink} readOnly value={url} onFocus={(event) => event.currentTarget.select()} className="rise-print-hide mt-2 w-full rounded border p-2 text-sm" /> : null}
      {reference ? <p className="mt-3 break-words text-sm leading-6"><strong>{ui.citation}: </strong>{reference}</p> : null}
      {sourceUrl ? <p className="mt-2 break-words text-sm"><strong>{ui.source}: </strong><a href={sourceUrl} target="_blank" rel="noreferrer" className="underline">{sourceUrl}</a></p> : null}
    </section>
  );
}
