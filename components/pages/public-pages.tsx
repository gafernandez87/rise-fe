import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseCard } from "@/components/cases/case-card";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { SiteHeader } from "@/components/layout/site-header";
import { MapExplorer } from "@/components/map/map-explorer";
import { getCategories, getCaseBySlug, getMapCases, getPublishedCases } from "@/lib/api";
import {
  getDictionary,
  getLocalizedContentLists,
  getLocalizedCountries,
  getLocalizedCountryBySlug,
  localizeCase,
  localizeCases,
  localizeCategories,
  localizeMapCases,
  localizedPath,
  type Locale,
} from "@/lib/i18n";
import { organizations } from "@/lib/rise-content";

type PublicPageProps = {
  locale: Locale;
  currentPath: string;
};

function PublicChrome({ locale, currentPath, children }: PublicPageProps & { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <LanguageSwitcher locale={locale} currentPath={currentPath} />
      {children}
    </>
  );
}

function LogoGroup({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
        {title}
      </h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <div
            key={item}
            className="grid min-h-20 place-items-center rounded-lg border border-[color:var(--color-border)] bg-white px-4 py-3 text-center text-sm font-semibold"
            aria-label={`Logo de ${item}`}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export async function HomePageView({ locale, currentPath }: PublicPageProps) {
  const dict = getDictionary(locale);
  const content = getLocalizedContentLists(locale);
  const countries = getLocalizedCountries(locale);
  const cases = localizeCases(await getPublishedCases(), locale);

  return (
    <PublicChrome locale={locale} currentPath={currentPath}>
      <main>
        <section className="bg-white">
          <div className="page-shell grid gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-7">
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                {dict.home.eyebrow}
              </p>
              <div className="space-y-3">
                <h1>
                  <Image
                    src="/brand/rise-logo-primary-horizontal.png"
                    alt="RISE - Resilience through Innovation, Science and Empowerment"
                    width={554}
                    height={251}
                    priority
                    className="h-auto w-full max-w-[430px]"
                  />
                </h1>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-[color:var(--color-muted)]">
                {dict.home.intro}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={localizedPath("/mapa", locale)}
                  className="rounded-md bg-[color:var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
                >
                  {dict.home.ctaMap}
                </Link>
                <Link
                  href={localizedPath("/historias", locale)}
                  className="rounded-md border border-[color:var(--color-border)] bg-white px-5 py-3 text-sm font-semibold"
                >
                  {dict.home.ctaStories}
                </Link>
                <Link
                  href={localizedPath("/informe-regional", locale)}
                  className="rounded-md border border-[color:var(--color-border)] bg-white px-5 py-3 text-sm font-semibold"
                >
                  {dict.home.ctaReport}
                </Link>
              </div>
            </div>
            <div className="hidden overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-white shadow-sm md:block">
              <div className="grid aspect-[4/3] grid-cols-2 grid-rows-[1fr_1fr_auto]">
                <div className="bg-[color:var(--color-earth)]" aria-hidden="true" />
                <div className="bg-[color:var(--color-water)]" aria-hidden="true" />
                <div className="bg-[color:var(--color-fire-warm)]" aria-hidden="true" />
                <div className="bg-[color:var(--color-air)]" aria-hidden="true" />
                <div className="col-span-2 border-t border-[color:var(--color-border)] bg-[color:var(--color-brand-cream)] p-5">
                  <p className="text-sm font-semibold text-[color:var(--color-primary)]">
                    {dict.common.latinAmerica}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-[color:var(--color-text)]">
                    {dict.home.mapCardTitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="sobre-rise" className="page-shell grid gap-8 pb-14 pt-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
              {dict.home.aboutEyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-semibold">{dict.home.aboutTitle}</h2>
          </div>
          <div className="space-y-6">
            {dict.home.aboutText.map((text) => (
              <p key={text} className="text-lg leading-8 text-[color:var(--color-muted)]">
                {text}
              </p>
            ))}
          </div>
        </section>

        <section className="border-y border-[color:var(--color-border)] bg-white py-14">
          <div className="page-shell grid gap-5 md:grid-cols-3">
            {dict.home.introCards.map((card) => (
              <Link
                key={card.title}
                href={localizedPath(card.href, locale)}
                className="rounded-lg border border-[color:var(--color-border)] p-5 transition hover:border-[color:var(--color-primary)]"
              >
                <h3 className="text-xl font-semibold">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">{card.text}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="page-shell space-y-6 py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                {dict.home.profilesEyebrow}
              </p>
              <h2 className="mt-2 text-3xl font-semibold">{dict.home.profilesTitle}</h2>
            </div>
            <Link href={localizedPath("/perfiles", locale)} className="text-sm font-semibold text-[color:var(--color-primary)]">
              {dict.home.viewProfiles}
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {countries.map((country) => (
              <article key={country.slug} className="rounded-lg border border-[color:var(--color-border)] bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                  {country.mainRisk}
                </p>
                <h3 className="mt-2 text-xl font-semibold">{country.name}</h3>
                <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">{country.summary}</p>
                <Link
                  href={localizedPath(`/perfiles/${country.slug}`, locale)}
                  className="mt-4 inline-flex text-sm font-semibold text-[color:var(--color-primary)]"
                >
                  {dict.home.viewProfile}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[color:var(--color-primary-strong)] py-14 text-white">
          <div className="page-shell space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-white/70">
                  {dict.home.storiesEyebrow}
                </p>
                <h2 className="mt-2 text-3xl font-semibold">{dict.home.storiesTitle}</h2>
              </div>
              <Link href={localizedPath("/historias", locale)} className="text-sm font-semibold text-white">
                {dict.home.viewStories}
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {countries.map((country) => (
                <article key={country.slug} className="rounded-lg border border-white/15 p-4">
                  <div className="aspect-video rounded-md bg-white/10" />
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-white/70">
                    {country.name}
                  </p>
                  <h3 className="mt-2 font-semibold">{country.storyTitle}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/75">{country.mainRisk}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell space-y-6 py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                {dict.home.mapEyebrow}
              </p>
              <h2 className="mt-2 text-3xl font-semibold">{dict.home.casesTitle}</h2>
            </div>
            <Link href={localizedPath("/mapa", locale)} className="text-sm font-semibold text-[color:var(--color-primary)]">
              {dict.home.exploreMap}
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {cases.slice(0, 3).map((item) => (
              <CaseCard key={item.id} item={item} locale={locale} />
            ))}
          </div>
        </section>

        <section className="border-y border-[color:var(--color-border)] bg-white py-14">
          <div className="page-shell grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                {dict.home.reportEyebrow}
              </p>
              <h2 className="mt-2 text-3xl font-semibold">{dict.home.reportTitle}</h2>
              <p className="mt-4 text-sm leading-6 text-[color:var(--color-muted)]">
                {dict.home.reportText}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={localizedPath("/informe-regional", locale)}
                  className="rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
                >
                  {dict.home.readOnline}
                </Link>
                <Link
                  href={localizedPath("/metodologia", locale)}
                  className="rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold"
                >
                  {dict.home.learnMethodology}
                </Link>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {dict.home.findings.map((finding) => (
                <div key={finding} className="rounded-lg bg-[color:var(--color-surface-muted)] p-4 text-sm leading-6">
                  {finding}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell space-y-6 py-14">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
              {dict.home.methodologyEyebrow}
            </p>
            <h2 className="mt-2 text-3xl font-semibold">{dict.home.methodologyTitle}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {content.methodologySteps.map((step, index) => (
              <article key={step.title} className="rounded-lg border border-[color:var(--color-border)] bg-white p-5">
                <p className="text-sm font-semibold text-[color:var(--color-primary)]">
                  {dict.common.stage} {index + 1}
                </p>
                <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--color-muted)]">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-[color:var(--color-border)] bg-white py-14">
          <div className="page-shell space-y-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                {dict.home.organizationsEyebrow}
              </p>
              <h2 className="mt-2 text-3xl font-semibold">{dict.home.organizationsTitle}</h2>
            </div>
            <LogoGroup title={dict.home.leading} items={organizations.leading} />
            <LogoGroup title={dict.home.support} items={organizations.support} />
            <LogoGroup title={dict.home.participants} items={organizations.participants} />
          </div>
        </section>
      </main>
    </PublicChrome>
  );
}

export async function MapPageView({ locale, currentPath }: PublicPageProps) {
  const dict = getDictionary(locale);
  const [cases, categories] = await Promise.all([getMapCases(), getCategories()]);
  const localizedCases = localizeMapCases(cases, locale);
  const localizedCategories = localizeCategories(categories, locale);

  return (
    <PublicChrome locale={locale} currentPath={currentPath}>
      <main className="page-shell space-y-8 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
              {dict.map.eyebrow}
            </p>
            <h1 className="mt-2 text-4xl font-semibold">{dict.map.title}</h1>
            <p className="mt-3 text-base leading-7 text-[color:var(--color-muted)]">
              {dict.map.text}
            </p>
          </div>
          <p className="text-sm text-[color:var(--color-muted)]">
            {localizedCases.length} {dict.common.publishedCases}
          </p>
        </div>

        <MapExplorer cases={localizedCases} categories={localizedCategories} locale={locale} />
      </main>
    </PublicChrome>
  );
}

export function StoriesPageView({ locale, currentPath }: PublicPageProps) {
  const dict = getDictionary(locale);
  const countries = getLocalizedCountries(locale);

  return (
    <PublicChrome locale={locale} currentPath={currentPath}>
      <main className="page-shell space-y-8 py-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
            {dict.stories.eyebrow}
          </p>
          <h1 className="mt-2 text-4xl font-semibold">{dict.stories.title}</h1>
          <p className="mt-3 text-base leading-7 text-[color:var(--color-muted)]">
            {dict.stories.text}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {countries.map((country) => (
            <article key={country.slug} className="overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-white">
              <div className="grid aspect-video place-items-center bg-[color:var(--color-surface-muted)] text-sm font-semibold text-[color:var(--color-muted)]">
                {dict.stories.videoPlaceholder}
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                  {country.name}
                </p>
                <h2 className="mt-2 text-xl font-semibold">{country.storyTitle}</h2>
                <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">
                  {dict.stories.storyAboutPrefix} {country.mainRisk.toLowerCase()}{" "}
                  {dict.stories.storyAboutMiddle} {country.territory.toLowerCase()}.
                </p>
                <Link
                  href={localizedPath(`/historias/${country.slug}`, locale)}
                  className="mt-5 inline-flex rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
                >
                  {dict.stories.viewStory}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </PublicChrome>
  );
}

export function StoryPageView({ locale, currentPath, slug }: PublicPageProps & { slug: string }) {
  const dict = getDictionary(locale);
  const country = getLocalizedCountryBySlug(locale, slug);

  if (!country) {
    notFound();
  }

  return (
    <PublicChrome locale={locale} currentPath={currentPath}>
      <main>
        <section className="bg-white">
          <div className="page-shell grid gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                {country.name} · {country.territory}
              </p>
              <h1 className="mt-2 text-4xl font-semibold">{country.storyTitle}</h1>
              <p className="mt-4 text-lg leading-8 text-[color:var(--color-muted)]">
                {dict.stories.heroTextPrefix} {country.mainRisk.toLowerCase()}.
              </p>
            </div>
            <div className="grid aspect-video place-items-center rounded-lg bg-[color:var(--color-surface-muted)] text-sm font-semibold text-[color:var(--color-muted)]">
              {dict.stories.mediaPlaceholder}
            </div>
          </div>
        </section>

        <section className="page-shell grid gap-5 py-10 md:grid-cols-2">
          {dict.stories.sections.map((section) => (
            <article key={section.title} className="rounded-lg border border-[color:var(--color-border)] bg-white p-5">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">{section.text}</p>
            </article>
          ))}
        </section>

        <section className="page-shell pb-12">
          <div className="rounded-lg border border-[color:var(--color-border)] bg-white p-5">
            <h2 className="text-xl font-semibold">{dict.stories.technicalSheet}</h2>
            <dl className="mt-4 grid gap-4 text-sm md:grid-cols-3">
              <div>
                <dt className="font-semibold">{dict.common.country}</dt>
                <dd className="text-[color:var(--color-muted)]">{country.name}</dd>
              </div>
              <div>
                <dt className="font-semibold">{dict.common.mainRisk}</dt>
                <dd className="text-[color:var(--color-muted)]">{country.mainRisk}</dd>
              </div>
              <div>
                <dt className="font-semibold">{dict.common.involvedActors}</dt>
                <dd className="text-[color:var(--color-muted)]">{dict.common.youthCommunityAllies}</dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={localizedPath(`/perfiles/${country.slug}`, locale)} className="text-sm font-semibold text-[color:var(--color-primary)]">
                {dict.stories.viewCountryProfile}
              </Link>
              <Link href={localizedPath("/historias", locale)} className="text-sm font-semibold text-[color:var(--color-primary)]">
                {dict.stories.viewOtherStories}
              </Link>
              <Link href={localizedPath("/mapa", locale)} className="text-sm font-semibold text-[color:var(--color-primary)]">
                {dict.stories.exploreMap}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </PublicChrome>
  );
}

export function CountryProfilesPageView({ locale, currentPath }: PublicPageProps) {
  const dict = getDictionary(locale);
  const countries = getLocalizedCountries(locale);

  return (
    <PublicChrome locale={locale} currentPath={currentPath}>
      <main className="page-shell space-y-8 py-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
            {dict.profiles.eyebrow}
          </p>
          <h1 className="mt-2 text-4xl font-semibold">{dict.profiles.title}</h1>
          <p className="mt-3 text-base leading-7 text-[color:var(--color-muted)]">
            {dict.profiles.text}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {countries.map((country) => (
            <article key={country.slug} className="rounded-lg border border-[color:var(--color-border)] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                {country.territory}
              </p>
              <h2 className="mt-2 text-2xl font-semibold">{country.name}</h2>
              <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">{country.summary}</p>
              <dl className="mt-4 grid gap-3 text-sm">
                <div>
                  <dt className="font-semibold">{dict.common.mainRisk}</dt>
                  <dd className="text-[color:var(--color-muted)]">{country.mainRisk}</dd>
                </div>
                <div>
                  <dt className="font-semibold">{dict.common.mostAffectedSector}</dt>
                  <dd className="text-[color:var(--color-muted)]">{country.sector}</dd>
                </div>
              </dl>
              <Link
                href={localizedPath(`/perfiles/${country.slug}`, locale)}
                className="mt-5 inline-flex rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
              >
                {dict.home.viewProfile}
              </Link>
            </article>
          ))}
        </div>
      </main>
    </PublicChrome>
  );
}

export function CountryProfilePageView({ locale, currentPath, slug }: PublicPageProps & { slug: string }) {
  const dict = getDictionary(locale);
  const country = getLocalizedCountryBySlug(locale, slug);

  if (!country) {
    notFound();
  }

  return (
    <PublicChrome locale={locale} currentPath={currentPath}>
      <main>
        <section className="bg-white">
          <div className="page-shell grid gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                {dict.profiles.nationalProfile}
              </p>
              <h1 className="mt-2 text-4xl font-semibold">{country.name}</h1>
              <p className="mt-4 text-lg leading-8 text-[color:var(--color-muted)]">{country.summary}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={localizedPath("/mapa", locale)}
                  className="rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
                >
                  {dict.profiles.viewCasesMap}
                </Link>
                <a
                  href="#"
                  className="rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold"
                >
                  {dict.profiles.downloadPdf}
                </a>
              </div>
            </div>
            <dl className="grid gap-4 rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-5 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-semibold">{dict.common.mainRisk}</dt>
                <dd className="mt-1 text-sm text-[color:var(--color-muted)]">{country.mainRisk}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold">{dict.common.mostAffectedSector}</dt>
                <dd className="mt-1 text-sm text-[color:var(--color-muted)]">{country.sector}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold">{dict.common.prioritizedTerritory}</dt>
                <dd className="mt-1 text-sm text-[color:var(--color-muted)]">{country.territory}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold">{dict.common.identifiedMeasures}</dt>
                <dd className="mt-1 text-sm text-[color:var(--color-muted)]">{country.measuresCount}</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="page-shell grid gap-5 py-10 md:grid-cols-2">
          {dict.profiles.sections.map((section) => (
            <article key={section} className="rounded-lg border border-[color:var(--color-border)] bg-white p-5">
              <h2 className="text-xl font-semibold">{section}</h2>
              <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">
                {dict.profiles.placeholderPrefix} {country.name}. {dict.profiles.placeholderSuffix}
              </p>
            </article>
          ))}
        </section>
      </main>
    </PublicChrome>
  );
}

export function RegionalReportPageView({ locale, currentPath }: PublicPageProps) {
  const dict = getDictionary(locale);
  const countries = getLocalizedCountries(locale);

  return (
    <PublicChrome locale={locale} currentPath={currentPath}>
      <main>
        <section className="bg-white">
          <div className="page-shell grid gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                {dict.report.eyebrow}
              </p>
              <h1 className="mt-2 text-4xl font-semibold">{dict.report.title}</h1>
              <p className="mt-4 text-lg leading-8 text-[color:var(--color-muted)]">
                {dict.report.text}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#"
                  className="rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
                >
                  {dict.report.downloadPdf}
                </a>
                <a
                  href="#resumen"
                  className="rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold"
                >
                  {dict.report.readOnline}
                </a>
              </div>
            </div>
            <div className="grid aspect-[3/4] place-items-center rounded-lg bg-[color:var(--color-surface-muted)] p-8 text-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                  {dict.report.cover}
                </p>
                <p className="mt-3 text-3xl font-semibold">{dict.report.coverTitle}</p>
              </div>
            </div>
          </div>
        </section>

        <section id="resumen" className="page-shell grid gap-8 py-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="text-3xl font-semibold">{dict.report.summaryTitle}</h2>
            <p className="mt-4 text-sm leading-6 text-[color:var(--color-muted)]">
              {dict.report.summaryText}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {dict.report.findings.map((finding) => (
              <article key={finding} className="rounded-lg border border-[color:var(--color-border)] bg-white p-4">
                <p className="text-sm leading-6 text-[color:var(--color-muted)]">{finding}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-[color:var(--color-border)] bg-white py-10">
          <div className="page-shell space-y-5">
            <h2 className="text-2xl font-semibold">{dict.report.linkedProfiles}</h2>
            <div className="flex flex-wrap gap-3">
              {countries.map((country) => (
                <Link
                  key={country.slug}
                  href={localizedPath(`/perfiles/${country.slug}`, locale)}
                  className="rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold"
                >
                  {country.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </PublicChrome>
  );
}

export function MethodologyPageView({ locale, currentPath }: PublicPageProps) {
  const dict = getDictionary(locale);
  const countries = getLocalizedCountries(locale);
  const content = getLocalizedContentLists(locale);

  return (
    <PublicChrome locale={locale} currentPath={currentPath}>
      <main className="page-shell space-y-10 py-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
            {dict.methodology.eyebrow}
          </p>
          <h1 className="mt-2 text-4xl font-semibold">{dict.methodology.title}</h1>
          <p className="mt-3 text-base leading-7 text-[color:var(--color-muted)]">
            {dict.methodology.text}
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {content.methodologySteps.map((step, index) => (
            <article key={step.title} className="rounded-lg border border-[color:var(--color-border)] bg-white p-5">
              <p className="text-sm font-semibold text-[color:var(--color-primary)]">
                {dict.common.stage} {index + 1}
              </p>
              <h2 className="mt-2 text-xl font-semibold">{step.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">{step.description}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-8 rounded-lg border border-[color:var(--color-border)] bg-white p-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="text-2xl font-semibold">{dict.methodology.criteriaTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">
              {dict.methodology.criteriaText}
            </p>
          </div>
          <ul className="grid gap-3 text-sm leading-6 text-[color:var(--color-muted)]">
            {dict.methodology.criteria.map((item) => (
              <li key={item} className="rounded-md bg-[color:var(--color-surface-muted)] p-3">
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">{dict.methodology.includedCountries}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {countries.map((country) => (
              <div key={country.slug} className="rounded-lg border border-[color:var(--color-border)] bg-white p-4">
                <h3 className="font-semibold">{country.name}</h3>
                <p className="mt-2 text-sm text-[color:var(--color-muted)]">{country.mainRisk}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </PublicChrome>
  );
}

export async function CasePageView({ locale, currentPath, slug }: PublicPageProps & { slug: string }) {
  const dict = getDictionary(locale);
  const item = localizeCase(await getCaseBySlug(slug), locale);

  if (!item) {
    notFound();
  }

  const cover = item.images.find((image) => image.isCover) ?? item.images[0];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.title,
    description: item.shortDescription,
    image: cover?.url,
    spatialCoverage: [item.country, item.region].filter(Boolean).join(", "),
  };

  return (
    <PublicChrome locale={locale} currentPath={currentPath}>
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <section className="page-shell grid gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr]">
          {cover ? (
            <Image
              className="aspect-[4/3] w-full rounded-lg object-cover"
              src={cover.url}
              alt={cover.altText}
              width={960}
              height={720}
              priority
              unoptimized
            />
          ) : null}
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
              {item.category.name} · {dict.mapExplorer.severityLabels[item.severity]}
            </p>
            <h1 className="text-4xl font-semibold leading-tight">{item.title}</h1>
            <p className="text-lg leading-8 text-[color:var(--color-muted)]">
              {item.shortDescription}
            </p>
            <dl className="grid gap-3 rounded-lg border border-[color:var(--color-border)] bg-white p-5 text-sm md:grid-cols-2">
              <div>
                <dt className="font-semibold">{dict.common.country}</dt>
                <dd className="text-[color:var(--color-muted)]">{item.country ?? dict.common.tbd}</dd>
              </div>
              <div>
                <dt className="font-semibold">{dict.common.region}</dt>
                <dd className="text-[color:var(--color-muted)]">{item.region ?? dict.common.tbd}</dd>
              </div>
              <div>
                <dt className="font-semibold">{dict.common.latitude}</dt>
                <dd className="text-[color:var(--color-muted)]">{item.latitude}</dd>
              </div>
              <div>
                <dt className="font-semibold">{dict.common.longitude}</dt>
                <dd className="text-[color:var(--color-muted)]">{item.longitude}</dd>
              </div>
            </dl>
          </div>
        </section>
        <section className="page-shell pb-14">
          <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
            <aside className="h-fit rounded-lg border border-[color:var(--color-border)] bg-white p-5">
              <h2 className="text-xl font-semibold">{dict.case.classification}</h2>
              <dl className="mt-4 grid gap-3 text-sm">
                <div>
                  <dt className="font-semibold">{dict.case.locality}</dt>
                  <dd className="text-[color:var(--color-muted)]">{item.region ?? dict.common.toComplete}</dd>
                </div>
                <div>
                  <dt className="font-semibold">{dict.common.country}</dt>
                  <dd className="text-[color:var(--color-muted)]">{item.country ?? dict.common.toComplete}</dd>
                </div>
                <div>
                  <dt className="font-semibold">{dict.case.threat}</dt>
                  <dd className="text-[color:var(--color-muted)]">{dict.mapExplorer.severityLabels[item.severity]}</dd>
                </div>
                <div>
                  <dt className="font-semibold">{dict.case.measureSector}</dt>
                  <dd className="text-[color:var(--color-muted)]">{item.category.name}</dd>
                </div>
                <div>
                  <dt className="font-semibold">{dict.case.source}</dt>
                  <dd className="text-[color:var(--color-muted)]">
                    {item.sourceUrl ? (
                      <a href={item.sourceUrl} className="text-[color:var(--color-primary)]">
                        {dict.case.viewSource}
                      </a>
                    ) : (
                      dict.common.toComplete
                    )}
                  </dd>
                </div>
              </dl>
            </aside>

            <div className="space-y-6">
              <section className="rounded-lg border border-[color:var(--color-border)] bg-white p-6">
                <h2 className="text-2xl font-semibold">{dict.case.baseInfo}</h2>
                <div className="mt-5 grid gap-5">
                  <div>
                    <h3 className="font-semibold">{dict.case.measureSummary}</h3>
                    <p className="mt-2 leading-8 text-[color:var(--color-muted)]">{item.fullDescription}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">{dict.case.measureObjectives}</h3>
                    <p className="mt-2 leading-8 text-[color:var(--color-muted)]">
                      {dict.case.measureObjectivesText}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">{dict.case.beneficiaryCommunities}</h3>
                    <p className="mt-2 leading-8 text-[color:var(--color-muted)]">
                      {dict.case.beneficiaryCommunitiesText}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-[color:var(--color-border)] bg-white p-6">
                <h2 className="text-2xl font-semibold">{dict.case.complementaryInfo}</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {dict.case.complementarySections.map((title) => (
                    <article key={title} className="rounded-md bg-[color:var(--color-surface-muted)] p-4">
                      <h3 className="font-semibold">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[color:var(--color-muted)]">
                        {dict.case.complementaryPlaceholder}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>
    </PublicChrome>
  );
}
