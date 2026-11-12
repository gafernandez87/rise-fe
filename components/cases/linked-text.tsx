import { Fragment } from "react";

// Render editorial text as text; only recognized web and email URLs become links.
export function LinkedText({ text }: { text: string }) {
  const pattern = /\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^\s)]+)\)|(?:https?:\/\/|www\.)[^\s<>]+|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?:[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?\.)+(?:org|com|net|edu|gov|io|ar|cl|co|br|mx|pe|uy)(?:\/[^\s<>]*)?\b/gi;
  const parts = [];
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index!;
    parts.push(<Fragment key={`text-${index}`}>{text.slice(cursor, index)}</Fragment>);
    const raw = match[2] ?? match[0].replace(/[.,;:!?]+$/, "").replace(/\)+$/, (closing) => {
      const opens = (match[0].match(/\(/g) ?? []).length;
      return closing.slice(0, opens);
    });
    const href = /^(https?:|mailto:)/i.test(raw) ? raw : raw.includes("@") ? `mailto:${raw}` : `https://${raw}`;
    parts.push(<a key={`link-${index}`} href={href} target={href.startsWith("mailto:") ? undefined : "_blank"} rel="noopener noreferrer" className="rise-content-link break-words underline decoration-current underline-offset-4 text-[color:var(--color-primary)] hover:decoration-2">{match[1] ?? raw}</a>);
    if (!match[2]) parts.push(<Fragment key={`suffix-${index}`}>{match[0].slice(raw.length)}</Fragment>);
    cursor = index + match[0].length;
  }
  parts.push(<Fragment key="remaining">{text.slice(cursor)}</Fragment>);
  return <>{parts}</>;
}
