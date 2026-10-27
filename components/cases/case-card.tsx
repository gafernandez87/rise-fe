import Link from "next/link";
import Image from "next/image";
import { CountryLabel } from "@/components/countries/country-label";
import { getDictionary, localizedPath, type Locale } from "@/lib/i18n";
import type { AdaptationCase } from "@/types/cases";

type CaseCardActionVariant = "link" | "button";

type CaseCardProps = {
  item: AdaptationCase;
  locale: Locale;
  actionVariant?: CaseCardActionVariant;
};

const caseCardActionClassNames: Record<CaseCardActionVariant, string> = {
  link: "inline-flex text-sm font-semibold text-[color:var(--color-primary)]",
  button:
    "rise-action inline-flex w-full items-center justify-center rounded-md border border-[color:var(--color-border)] bg-white px-5 py-3 text-sm font-semibold text-[color:var(--color-primary)] transition hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-surface-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]",
};

export function CaseCard({ item, locale, actionVariant = "link" }: CaseCardProps) {
  const cover = item.images.find((image) => image.isCover) ?? item.images[0];
  const dict = getDictionary(locale);
  const isButtonAction = actionVariant === "button";

  return (
    <article className="rise-card flex h-full flex-col overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-white shadow-sm">
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
      <div className={isButtonAction ? "flex flex-1 flex-col p-5" : "space-y-3 p-5"}>
        <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
          <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
            <CountryLabel country={item.country} fallback={dict.common.latinAmerica} />
            <span aria-hidden="true">·</span>
            <span>
              {item.category.name}{item.severity ? ` · ${item.severity}` : ""}
            </span>
          </span>
        </p>
        <h3 className={isButtonAction ? "mt-3 text-xl font-semibold" : "text-xl font-semibold"}>
          {item.title}
        </h3>
        <p
          className={
            isButtonAction
              ? "mt-3 text-sm leading-6 text-[color:var(--color-muted)]"
              : "text-sm leading-6 text-[color:var(--color-muted)]"
          }
        >
          {item.shortDescription}
        </p>
        <div className={isButtonAction ? "mt-auto pt-5" : undefined}>
          <Link
            href={localizedPath(`/casos/${item.slug}`, locale)}
            className={caseCardActionClassNames[actionVariant]}
          >
            {dict.caseCard.viewCase}
          </Link>
        </div>
      </div>
    </article>
  );
}
