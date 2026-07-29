import { getCountryFlag } from "@/lib/rise-content";

type CountryLabelProps = {
  country?: string | null;
  fallback?: string;
  className?: string;
  flagClassName?: string;
  textClassName?: string;
};

function classNames(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function CountryLabel({
  country,
  fallback,
  className,
  flagClassName,
  textClassName,
}: CountryLabelProps) {
  const label = country?.trim() || fallback;
  const flag = getCountryFlag(country);

  if (!label) {
    return null;
  }

  return (
    <span className={classNames("inline-flex min-w-0 items-center gap-2", className)}>
      {flag ? (
        <span aria-hidden="true" className={classNames("shrink-0 text-[1.15em] leading-none", flagClassName)}>
          {flag}
        </span>
      ) : null}
      <span className={classNames("min-w-0", textClassName)}>{label}</span>
    </span>
  );
}
