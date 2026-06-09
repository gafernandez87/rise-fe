import Link from "next/link";
import Image from "next/image";
import type { AdaptationCase } from "@/types/cases";

export function CaseCard({ item }: { item: AdaptationCase }) {
  const cover = item.images.find((image) => image.isCover) ?? item.images[0];

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
          href={`/casos/${item.slug}`}
          className="inline-flex text-sm font-semibold text-[color:var(--color-primary)]"
        >
          Ver caso
        </Link>
      </div>
    </article>
  );
}
