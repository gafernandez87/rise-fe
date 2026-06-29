import Link from "next/link";
import Image from "next/image";
import { getDictionary, localizedPath, type Locale } from "@/lib/i18n";
import type { AdaptationCase } from "@/types/cases";

export function CaseCard({ item, locale }: { item: AdaptationCase; locale: Locale }) {
  const cover = item.images.find((image) => image.isCover) ?? item.images[0];
  const dict = getDictionary(locale);

  return (
    <article className="overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-white shadow-sm">
      {cover ? (
        <Image
          className="h-44 w-full object-cover"
          src={cover.url}
          alt={cover.altText}
          width={640}
          height={360}
          unoptimized
        />
      ) : null}
      <div className="space-y-3 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
          {item.category.name} · {item.severity}
        </p>
        <h3 className="text-xl font-semibold">{item.title}</h3>
        <p className="text-sm leading-6 text-[color:var(--color-muted)]">
          {item.shortDescription}
        </p>
        <Link
          href={localizedPath(`/casos/${item.slug}`, locale)}
          className="inline-flex text-sm font-semibold text-[color:var(--color-primary)]"
        >
          {dict.caseCard.viewCase}
        </Link>
      </div>
    </article>
  );
}
