import type { ReactNode } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  BookOpenText,
  Droplets,
  Flame,
  Handshake,
  Leaf,
  Mountain,
  Sprout,
  UsersRound,
  Waves,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseCard } from "@/components/cases/case-card";
import { CountryLabel } from "@/components/countries/country-label";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { SiteHeader } from "@/components/layout/site-header";
import { MapPreviewLoader } from "@/components/map/map-loader";
import { MapExplorer } from "@/components/map/map-explorer";
import {
  getCategories,
  getCaseBySlug,
  getCountryProfileBySlug,
  getMapCases,
  getPublishedCountryProfiles,
  getPublishedCases,
  getPublishedStories,
  getStoryBySlug,
} from "@/lib/api";
import {
  getDictionary,
  getLocalizedContentLists,
  getLocalizedCountries,
  localizeCase,
  localizeCases,
  localizeCategories,
  localizeMapCases,
  localizedPath,
  type Locale,
} from "@/lib/i18n";
import { mapFilterPath, type MapInitialFilters } from "@/lib/map-filters";
import { getCountrySlugFromName, organizations, type OrganizationLogo } from "@/lib/rise-content";
import type { CountryProfile } from "@/types/country-profiles";
import type { ResilienceStory } from "@/types/stories";
import type { AdaptationCase } from "@/types/cases";

type PublicPageProps = {
  locale: Locale;
  currentPath: string;
};

type StorySection = ReturnType<typeof getDictionary>["stories"]["sections"][number];

function uniqueLabels(labels: Array<string | null | undefined>) {
  return labels.filter((label, index): label is string => Boolean(label) && labels.indexOf(label) === index);
}

function getCaseRiskLabel(item: AdaptationCase, locale: Locale) {
  const dict = getDictionary(locale);

  return item.threat ?? dict.mapExplorer.riskBySeverity[item.severity];
}

function getCaseMeasureLabels(item: AdaptationCase) {
  return uniqueLabels([item.measureType, item.category.name]);
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function normalizeLinkedLabel(value?: string | null) {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizeText(normalizedValue) : undefined;
}

function getCountryLinkKey(value?: string | null) {
  return getCountrySlugFromName(value) ?? normalizeLinkedLabel(value);
}

function getRelatedStoryForCase(item: AdaptationCase, stories: ResilienceStory[]) {
  const caseCountryKey = getCountryLinkKey(item.country);

  if (!caseCountryKey) {
    return undefined;
  }

  return stories.find((story) => getCountryLinkKey(story.country) === caseCountryKey);
}

function getRelatedCasesForStory(story: ResilienceStory, cases: AdaptationCase[]) {
  const storyCountryKey = getCountryLinkKey(story.country);

  if (!storyCountryKey) {
    return [];
  }

  return cases.filter((item) => getCountryLinkKey(item.country) === storyCountryKey);
}

function StoryThemeIcon({ story }: { story: ResilienceStory }) {
  const context = normalizeText([story.title, story.summary, story.mainRisk, story.territory].filter(Boolean).join(" "));
  const iconProps = { "aria-hidden": true, size: 30, strokeWidth: 1.7 } as const;

  if (/(agua|hidric|water|seca|sequia|drought)/.test(context)) {
    return <Droplets {...iconProps} />;
  }

  if (/(inund|flood|enchente)/.test(context)) {
    return <Waves {...iconProps} />;
  }

  if (/(calor|heat|incend|fire|queimad)/.test(context)) {
    return <Flame {...iconProps} />;
  }

  if (/(desliz|landslide|montan|mountain)/.test(context)) {
    return <Mountain {...iconProps} />;
  }

  if (/(biodivers|restaur|nature|naturaleza|natureza|verde)/.test(context)) {
    return <Leaf {...iconProps} />;
  }

  return <UsersRound {...iconProps} />;
}

const collaboratorOrganizations = [...organizations.support, ...organizations.participants];
const homeIntroCardIcons = [BookOpen, Leaf, AlertTriangle] as const;
const homeCardActionClassName =
  "rise-action inline-flex w-full items-center justify-center rounded-md border border-[color:var(--color-border)] bg-white px-5 py-3 text-sm font-semibold text-[color:var(--color-primary)] transition hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-surface-muted)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]";
const storySectionIcons: LucideIcon[] = [AlertTriangle, Handshake, BookOpenText, Sprout];

function PublicChrome({ locale, currentPath, children }: PublicPageProps & { children: ReactNode }) {
  return (
    <div className="rise-public">
      <SiteHeader locale={locale} currentPath={currentPath} />
      <LanguageSwitcher locale={locale} currentPath={currentPath} />
      {children}
      <SiteFooter locale={locale} />
    </div>
  );
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" stroke="currentColor" strokeWidth="2" rx="5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.25" cy="6.75" r="1.25" fill="currentColor" />
    </svg>
  );
}

function SiteFooter({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <footer className="bg-[color:var(--color-text)] py-8 text-[color:var(--color-brand-cream)]">
      <div className="page-shell flex flex-wrap items-center justify-between gap-5">
        <Link href="https://www.somosclaac.org/" aria-label="CLAAC">
          <Image
            src="/brand/organizations/claac.png"
            alt="CLAAC - Coalición para Latinoamérica de Acción Climática"
            width={1920}
            height={1080}
            className="h-auto w-40"
            style={{ filter: "brightness(0) invert(1)" }}
            loading="eager"
          />
        </Link>
        <div className="flex items-center gap-3 text-sm font-semibold">
          <span>{dict.footer.findUsOn}</span>
          <Link
            href="https://www.instagram.com/claac_latam/"
            target="_blank"
            rel="noreferrer"
            className="grid h-10 w-10 place-items-center rounded-full border border-current text-[color:var(--color-brand-cream)]"
            aria-label="Instagram CLAAC"
          >
            <InstagramIcon />
          </Link>
        </div>
      </div>
    </footer>
  );
}

function fallbackProfileContent(country: CountryProfile, dict: ReturnType<typeof getDictionary>) {
  return `${dict.profiles.placeholderPrefix} ${country.name}. ${dict.profiles.placeholderSuffix}`;
}

function profileSectionContent(country: CountryProfile, sectionIndex: number, dict: ReturnType<typeof getDictionary>) {
  const fallback = fallbackProfileContent(country, dict);
  const contents = [
    country.summary,
    country.climateThreats ?? country.risks.join(", "),
    country.exposureAndVulnerabilities,
    country.riskAnalysis,
    null,
    country.sector,
    country.territory,
    country.adaptationMeasures,
    country.featuredStory ?? country.storyTitle,
    country.sources,
  ];

  return contents[sectionIndex] || fallback;
}

function LogoGroup({ title, items }: { title: string; items: OrganizationLogo[] }) {
  return (
    <div className="rise-logo-group">
      <h3 className="rise-logo-group__heading text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
        <span>{title}</span>
      </h3>
      <div
        className="rise-logo-grid rise-card-rail"
        role="region"
        aria-label={title}
        tabIndex={0}
      >
        {items.map((item) => (
          <div
            key={item.name}
            className="rise-logo-tile"
          >
            <Image
              src={item.logo}
              alt={item.name}
              width={240}
              height={120}
              className="rise-logo-tile__image"
              unoptimized={item.logo.endsWith(".svg")}
            />
            <p className="rise-logo-tile__name">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function isLikelyImageUrl(url: string) {
  return /\.(avif|gif|jpe?g|png|webp)(\?.*)?$/i.test(url);
}

function StoryMedia({
  fallbackLabel,
  story,
}: {
  fallbackLabel: string;
  story: ResilienceStory;
}) {
  if (story.mediaUrl && isLikelyImageUrl(story.mediaUrl)) {
    return (
      <div
        aria-label={story.mediaAlt ?? story.title}
        className="rise-story-thumbnail aspect-video bg-[color:var(--color-surface-muted)] bg-cover bg-center"
        role="img"
        style={{ backgroundImage: `url("${story.mediaUrl.replace(/"/g, '\\"')}")` }}
      />
    );
  }

  if (story.mediaUrl) {
    return (
      <div className="rise-story-thumbnail grid aspect-video place-items-center bg-[color:var(--color-surface-muted)] text-sm font-semibold text-[color:var(--color-muted)]">
        <Link href={story.mediaUrl} target="_blank" rel="noreferrer" className="text-[color:var(--color-primary)]">
          {fallbackLabel}
        </Link>
      </div>
    );
  }

  return (
    <div className="rise-story-thumbnail grid aspect-video place-items-center bg-[color:var(--color-surface-muted)] text-sm font-semibold text-[color:var(--color-muted)]">
      {fallbackLabel}
    </div>
  );
}

function StoryBody({ story }: { story: ResilienceStory }) {
  const paragraphs = story.content
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <article className="rounded-lg border border-[color:var(--color-border)] bg-white p-5">
      <div className="space-y-4 text-base leading-8 text-[color:var(--color-muted)]">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}

function StorySectionHighlights({ sections }: { sections: readonly StorySection[] }) {
  return (
    <section className="page-shell grid gap-4 py-10 md:grid-cols-2 lg:grid-cols-4">
      {sections.map((section, index) => {
        const Icon = storySectionIcons[index] ?? BookOpenText;

        return (
          <article key={section.title} className="rounded-lg border border-[color:var(--color-border)] bg-white p-5 shadow-sm">
            <div className="grid h-12 w-12 place-items-center rounded-md bg-[color:var(--color-surface-muted)] text-[color:var(--color-primary)]">
              <Icon aria-hidden="true" size={24} strokeWidth={1.8} />
            </div>
            <h2 className="mt-4 text-lg font-semibold leading-snug">{section.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">{section.text}</p>
          </article>
        );
      })}
    </section>
  );
}

export async function HomePageView({ locale, currentPath }: PublicPageProps) {
  const dict = getDictionary(locale);
  const content = getLocalizedContentLists(locale);
  const countries = getLocalizedCountries(locale);
  const [publishedCases, stories, mapCases] = await Promise.all([
    getPublishedCases(),
    getPublishedStories(),
    getMapCases(),
  ]);
  const cases = localizeCases(publishedCases, locale);
  const localizedMapCases = localizeMapCases(mapCases, locale);

  return (
    <PublicChrome locale={locale} currentPath={currentPath}>
      <main className="rise-home">
        <section className="rise-hero bg-white">
          <div className="page-shell grid gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-7">
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                {dict.home.eyebrow}
              </p>
              <div className="space-y-3">
                <h1>
                  <Image
                    src="/brand/elements/rise-logo.svg"
                    alt="RISE - Resilience through Innovation, Science and Empowerment"
                    width={1164}
                    height={407}
                    priority
                    className="h-auto w-full max-w-[430px]"
                    unoptimized
                  />
                </h1>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-[color:var(--color-muted)]">
                {dict.home.intro}
              </p>
            </div>
            <article className="rise-map-card overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-white shadow-sm">
              <div
                className="rise-map-preview relative aspect-[4/3] bg-[#a9d7e6]"
                role="img"
                aria-label={dict.home.mapCardTitle}
              >
                <MapPreviewLoader cases={localizedMapCases} locale={locale} />
              </div>
              <div className="border-t border-[color:var(--color-border)] bg-[color:var(--color-brand-cream)] p-5">
                <p className="text-sm font-semibold text-[color:var(--color-primary)]">
                  {dict.common.latinAmerica}
                </p>
                <p className="mt-2 text-2xl font-semibold text-[color:var(--color-text)]">
                  {dict.home.mapCardTitle}
                </p>
                <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">
                  {dict.map.text}
                </p>
                <Link
                  href={localizedPath("/mapa", locale)}
                  className="rise-action mt-5 inline-flex rounded-md bg-[color:var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
                >
                  {dict.home.ctaMap}
                </Link>
              </div>
            </article>
          </div>
        </section>

        <section id="sobre-rise" className="rise-section rise-section--about page-shell grid gap-8 pb-14 pt-6 lg:grid-cols-[0.85fr_1.15fr]">
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
            {dict.home.introCards.map((card, index) => {
              const Icon = homeIntroCardIcons[index] ?? BookOpen;

              return (
                <Link
                  key={card.title}
                  href={localizedPath(card.href, locale)}
                  className="rise-card group rounded-lg border border-[color:var(--color-border)] p-5 transition hover:border-[color:var(--color-primary)] hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-primary)]"
                >
                  <span className="mb-4 grid h-12 w-12 place-items-center rounded-md bg-[color:var(--color-surface-muted)] text-[color:var(--color-primary)] transition group-hover:bg-[color:var(--color-primary)] group-hover:text-white">
                    <Icon aria-hidden="true" className="h-7 w-7" strokeWidth={1.8} />
                  </span>
                  <h3 className="text-xl font-semibold">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">{card.text}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="rise-section rise-section--profiles page-shell space-y-6 py-14">
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
          <div
            className="rise-card-rail grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            role="region"
            aria-label={dict.home.profilesTitle}
            tabIndex={0}
          >
            {countries.map((country) => (
              <article key={country.slug} className="rise-card flex h-full flex-col rounded-lg border border-[color:var(--color-border)] bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                  {country.mainRisk}
                </p>
                <h3 className="mt-2 text-xl font-semibold">
                  <CountryLabel country={country.name} />
                </h3>
                <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">{country.summary}</p>
                <div className="mt-auto pt-5">
                  <Link
                    href={localizedPath(`/perfiles/${country.slug}`, locale)}
                    className={homeCardActionClassName}
                  >
                    {dict.home.viewProfile}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rise-section rise-section--stories bg-[color:var(--color-primary-strong)] py-14 text-white">
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
            <div
              className="rise-card-rail grid gap-5 md:grid-cols-2 lg:grid-cols-3"
              role="region"
              aria-label={dict.home.storiesTitle}
              tabIndex={0}
            >
              {stories.slice(0, 3).map((story) => (
                <article key={story.id} className="rounded-lg border border-white/15 p-4">
                  <div className="rise-story-thumbnail aspect-video rounded-md bg-white/10" />
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-white/70">
                    <CountryLabel country={story.country} fallback={dict.common.latinAmerica} />
                  </p>
                  <h3 className="mt-2 font-semibold">{story.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/75">{story.mainRisk ?? story.summary}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="rise-section rise-section--cases page-shell space-y-6 py-14">
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
          <div
            className="rise-card-rail grid gap-5 md:grid-cols-3"
            role="region"
            aria-label={dict.home.casesTitle}
            tabIndex={0}
          >
            {cases.slice(0, 3).map((item) => (
              <CaseCard key={item.id} item={item} locale={locale} actionVariant="button" />
            ))}
          </div>
        </section>

        <section className="rise-report-band border-y border-[color:var(--color-border)] py-14">
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
                  className="rise-action rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
                >
                  {dict.home.readOnline}
                </Link>
                <Link
                  href={localizedPath("/metodologia", locale)}
                  className="rise-action rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold"
                >
                  {dict.home.learnMethodology}
                </Link>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {dict.home.findings.map((finding) => (
                <div key={finding} className="rounded-lg border border-[color:var(--color-border)] bg-white p-4 text-sm leading-6 shadow-sm">
                  {finding}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rise-section rise-section--methodology page-shell space-y-6 py-14">
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

        <section className="rise-organizations border-t border-[color:var(--color-border)] py-16">
          <div className="page-shell space-y-8">
            <div className="rise-organizations__intro">
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                {dict.home.organizationsEyebrow}
              </p>
              <h2 className="mt-2 text-3xl font-semibold">{dict.home.organizationsTitle}</h2>
            </div>
            <div className="rise-organizations__layout">
              <article className="rise-organizations__lead">
                <h3 className="rise-logo-group__heading text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                  <span>{dict.home.projectBy.replace(/:$/, "")}</span>
                </h3>
                <Link
                  href="https://www.somosclaac.org/"
                  className="rise-organizations__lead-logo"
                  aria-label="CLAAC"
                >
                  <Image
                    src="/brand/organizations/claac.png"
                    alt="CLAAC - Coalición para Latinoamérica de Acción Climática"
                    width={1920}
                    height={1080}
                    className="rise-organizations__lead-image"
                    loading="eager"
                  />
                </Link>
              </article>
              <LogoGroup title={dict.home.collaborators} items={collaboratorOrganizations} />
            </div>
          </div>
        </section>
      </main>
    </PublicChrome>
  );
}

export async function MapPageView({
  locale,
  currentPath,
  initialFilters,
}: PublicPageProps & { initialFilters?: MapInitialFilters }) {
  const dict = getDictionary(locale);
  const [cases, categories] = await Promise.all([getMapCases(), getCategories()]);
  const localizedCases = localizeMapCases(cases, locale);
  const localizedCategories = localizeCategories(categories, locale);

  return (
    <PublicChrome locale={locale} currentPath={currentPath}>
      <main className="mx-auto w-full max-w-[1440px] space-y-8 px-[var(--space-page-x)] py-10">
        <div className="rise-page-hero flex flex-wrap items-end justify-between gap-4">
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

        <MapExplorer
          key={`${initialFilters?.country ?? ""}:${initialFilters?.risk ?? ""}:${initialFilters?.measure ?? ""}`}
          cases={localizedCases}
          categories={localizedCategories}
          initialFilters={initialFilters}
          locale={locale}
        />
      </main>
    </PublicChrome>
  );
}

export async function StoriesPageView({ locale, currentPath }: PublicPageProps) {
  const dict = getDictionary(locale);
  const stories = await getPublishedStories();

  return (
    <PublicChrome locale={locale} currentPath={currentPath}>
      <main className="page-shell space-y-8 py-10">
        <div className="rise-page-hero max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
            {dict.stories.eyebrow}
          </p>
          <h1 className="mt-2 text-4xl font-semibold">{dict.stories.title}</h1>
          <p className="mt-3 text-base leading-7 text-[color:var(--color-muted)]">
            {dict.stories.text}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <article key={story.id} className="rise-card overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-white">
              <StoryMedia fallbackLabel={dict.stories.videoPlaceholder} story={story} />
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                  <CountryLabel country={story.country} fallback={dict.common.latinAmerica} />
                </p>
                <h2 className="mt-2 text-xl font-semibold">{story.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">
                  {story.summary}
                </p>
                <Link
                  href={localizedPath(`/historias/${story.slug}`, locale)}
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

export async function StoryPageView({ locale, currentPath, slug }: PublicPageProps & { slug: string }) {
  const dict = getDictionary(locale);
  const [story, publishedCases] = await Promise.all([getStoryBySlug(slug), getPublishedCases()]);

  if (!story) {
    notFound();
  }

  const profileCountrySlug = getCountrySlugFromName(story.country);
  const profileCountry = profileCountrySlug
    ? getLocalizedCountries(locale).find((country) => country.slug === profileCountrySlug)
    : undefined;
  const relatedCases = getRelatedCasesForStory(story, localizeCases(publishedCases, locale));
  const countryMeasuresHref = story.country ? mapFilterPath(locale, "country", story.country) : localizedPath("/mapa", locale);

  return (
    <PublicChrome locale={locale} currentPath={currentPath}>
      <main>
        <section className="rise-detail-hero bg-white">
          <div className="page-shell grid gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                {story.country || story.territory ? (
                  <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
                    {story.country ? <CountryLabel country={story.country} /> : null}
                    {story.country && story.territory ? <span aria-hidden="true">·</span> : null}
                    {story.territory ? <span>{story.territory}</span> : null}
                  </span>
                ) : (
                  dict.stories.eyebrow
                )}
              </p>
              <div className="mt-5 grid h-14 w-14 place-items-center rounded-md bg-[color:var(--color-surface-muted)] text-[color:var(--color-primary)]">
                <StoryThemeIcon story={story} />
              </div>
              <h1 className="mt-2 text-4xl font-semibold">{story.title}</h1>
              <p className="mt-4 text-lg leading-8 text-[color:var(--color-muted)]">
                {story.summary}
              </p>
            </div>
            <div className="overflow-hidden rounded-lg">
              <StoryMedia fallbackLabel={dict.stories.mediaPlaceholder} story={story} />
            </div>
          </div>
        </section>

        <StorySectionHighlights sections={dict.stories.sections} />

        <section className="page-shell py-10">
          <StoryBody story={story} />
        </section>

        <section className="border-y border-[color:var(--color-border)] bg-white py-10">
          <div className="page-shell grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                {dict.stories.relatedMeasuresEyebrow}
              </p>
              <h2 className="text-2xl font-semibold">{dict.stories.relatedMeasuresTitle}</h2>
              <p className="text-sm leading-6 text-[color:var(--color-muted)]">
                {relatedCases.length > 0 ? dict.stories.relatedMeasuresText : dict.stories.relatedMeasuresFallback}
              </p>
              <Link
                href={countryMeasuresHref}
                className="inline-flex items-center gap-2 rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
              >
                {dict.stories.viewCountryMeasures}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
            {relatedCases.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {relatedCases.slice(0, 4).map((relatedCase) => (
                  <article key={relatedCase.id} className="rounded-lg border border-[color:var(--color-border)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                      <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
                        <CountryLabel country={relatedCase.country} fallback={dict.common.latinAmerica} />
                        <span aria-hidden="true">·</span>
                        <span>{getCaseRiskLabel(relatedCase, locale)}</span>
                      </span>
                    </p>
                    <h3 className="mt-2 text-lg font-semibold">{relatedCase.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--color-muted)]">
                      {relatedCase.shortDescription}
                    </p>
                    <Link
                      href={localizedPath(`/casos/${relatedCase.slug}`, locale)}
                      className="mt-4 inline-flex items-center gap-2 rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold text-[color:var(--color-primary)]"
                    >
                      {dict.stories.viewRelatedMeasure}
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              null
            )}
          </div>
        </section>

        <section className="page-shell pb-12">
          <div className="rounded-lg border border-[color:var(--color-border)] bg-white p-5">
            <h2 className="text-xl font-semibold">{dict.stories.technicalSheet}</h2>
            <dl className="mt-4 grid gap-4 text-sm md:grid-cols-3">
              <div>
                <dt className="font-semibold">{dict.common.country}</dt>
                <dd className="text-[color:var(--color-muted)]">
                  <CountryLabel country={story.country} fallback={dict.common.latinAmerica} />
                </dd>
              </div>
              <div>
                <dt className="font-semibold">{dict.common.mainRisk}</dt>
                <dd className="text-[color:var(--color-muted)]">{story.mainRisk ?? dict.stories.eyebrow}</dd>
              </div>
              <div>
                <dt className="font-semibold">{dict.common.involvedActors}</dt>
                <dd className="text-[color:var(--color-muted)]">{dict.common.youthCommunityAllies}</dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-3">
              {profileCountry ? (
                <Link href={localizedPath(`/perfiles/${profileCountry.slug}`, locale)} className="text-sm font-semibold text-[color:var(--color-primary)]">
                  {dict.stories.viewCountryProfile}
                </Link>
              ) : null}
              {story.sourceUrl ? (
                <Link href={story.sourceUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[color:var(--color-primary)]">
                  {dict.case.viewSource}
                </Link>
              ) : null}
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

export async function CountryProfilesPageView({ locale, currentPath }: PublicPageProps) {
  const dict = getDictionary(locale);
  const countries = await getPublishedCountryProfiles();

  return (
    <PublicChrome locale={locale} currentPath={currentPath}>
      <main className="page-shell space-y-8 py-10">
        <div className="rise-page-hero max-w-3xl">
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
            <article key={country.slug} className="rise-card rounded-lg border border-[color:var(--color-border)] bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                {country.territory}
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                <CountryLabel country={country.name} />
              </h2>
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

export async function CountryProfilePageView({ locale, currentPath, slug }: PublicPageProps & { slug: string }) {
  const dict = getDictionary(locale);
  const country = await getCountryProfileBySlug(slug);

  if (!country) {
    notFound();
  }

  return (
    <PublicChrome locale={locale} currentPath={currentPath}>
      <main>
        <section className="rise-detail-hero bg-white">
          <div className="page-shell grid gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                {dict.profiles.nationalProfile}
              </p>
              <h1 className="mt-2 text-4xl font-semibold">
                <CountryLabel country={country.name} />
              </h1>
              <p className="mt-4 text-lg leading-8 text-[color:var(--color-muted)]">{country.summary}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={localizedPath("/mapa", locale)}
                  className="rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
                >
                  {dict.profiles.viewCasesMap}
                </Link>
                {country.profilePdfUrl ? (
                  <a
                    href={country.profilePdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm font-semibold"
                  >
                    {dict.profiles.downloadPdf}
                  </a>
                ) : null}
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
          {dict.profiles.sections.map((section, index) => (
            <article key={section} className="rounded-lg border border-[color:var(--color-border)] bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">{section}</h2>
                <CountryLabel
                  country={country.name}
                  className="text-sm font-semibold text-[color:var(--color-primary)]"
                />
              </div>
              <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">
                {profileSectionContent(country, index, dict)}
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
        <section className="rise-detail-hero bg-white">
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
            <div className="rise-report-cover grid aspect-[3/4] place-items-center rounded-lg bg-[color:var(--color-surface-muted)] p-8 text-center">
              <Image
                src="/brand/elements/rise-logo.svg"
                alt=""
                width={1164}
                height={407}
                className="rise-report-cover__logo h-auto w-full max-w-[320px]"
                aria-hidden="true"
                unoptimized
              />
              <div className="rise-report-cover__content">
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
                  <CountryLabel country={country.name} />
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
        <div className="rise-page-hero max-w-3xl">
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
                <h3 className="font-semibold">
                  <CountryLabel country={country.name} />
                </h3>
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
  const [caseItem, stories] = await Promise.all([getCaseBySlug(slug), getPublishedStories()]);
  const item = localizeCase(caseItem, locale);

  if (!item) {
    notFound();
  }

  const cover = item.images.find((image) => image.isCover) ?? item.images[0];
  const caseRisk = getCaseRiskLabel(item, locale);
  const measureLabels = getCaseMeasureLabels(item);
  const relatedStory = getRelatedStoryForCase(item, stories);
  const classificationChips = [
    { href: mapFilterPath(locale, "risk", caseRisk), label: caseRisk },
    ...measureLabels.map((label) => ({ href: mapFilterPath(locale, "measure", label), label })),
  ];
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
        <section className="rise-detail-hero page-shell grid gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr]">
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
              <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
                {item.country ? <CountryLabel country={item.country} /> : null}
                {item.country ? <span aria-hidden="true">·</span> : null}
                <span>
                  {item.category.name} · {caseRisk}
                </span>
              </span>
            </p>
            <h1 className="text-4xl font-semibold leading-tight">{item.title}</h1>
            <p className="text-lg leading-8 text-[color:var(--color-muted)]">
              {item.shortDescription}
            </p>
            <div className="flex flex-wrap gap-2">
              {classificationChips.map((chip) => (
                <Link
                  key={`${chip.href}-${chip.label}`}
                  href={chip.href}
                  className="inline-flex min-h-9 items-center rounded-full border border-[color:var(--color-primary)] bg-white px-3 py-1 text-sm font-semibold text-[color:var(--color-primary)] transition hover:bg-[color:var(--color-surface-muted)]"
                >
                  {chip.label}
                </Link>
              ))}
            </div>
            <dl className="grid gap-3 rounded-lg border border-[color:var(--color-border)] bg-white p-5 text-sm md:grid-cols-2">
              <div>
                <dt className="font-semibold">{dict.common.country}</dt>
                <dd className="text-[color:var(--color-muted)]">
                  <CountryLabel country={item.country} fallback={dict.common.tbd} />
                </dd>
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
                  <dd className="text-[color:var(--color-muted)]">
                    <CountryLabel country={item.country} fallback={dict.common.toComplete} />
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">{dict.case.threat}</dt>
                  <dd className="mt-1">
                    <Link
                      href={mapFilterPath(locale, "risk", caseRisk)}
                      className="inline-flex min-h-8 items-center rounded-full border border-[color:var(--color-primary)] px-3 py-1 text-xs font-semibold text-[color:var(--color-primary)] transition hover:bg-[color:var(--color-surface-muted)]"
                    >
                      {caseRisk}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">{dict.case.measureSector}</dt>
                  <dd className="mt-1 flex flex-wrap gap-2">
                    {measureLabels.map((label) => (
                      <Link
                        key={label}
                        href={mapFilterPath(locale, "measure", label)}
                        className="inline-flex min-h-8 items-center rounded-full border border-[color:var(--color-primary)] px-3 py-1 text-xs font-semibold text-[color:var(--color-primary)] transition hover:bg-[color:var(--color-surface-muted)]"
                      >
                        {label}
                      </Link>
                    ))}
                  </dd>
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

              <section className="rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)] p-6">
                <p className="text-sm font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                  {dict.case.relatedStoryEyebrow}
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  {relatedStory ? dict.case.relatedStoryTitle : dict.case.relatedStoryFallbackTitle}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[color:var(--color-muted)]">
                  {relatedStory ? dict.case.relatedStoryText : dict.case.relatedStoryFallbackText}
                </p>
                {relatedStory ? (
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--color-primary)]">
                      <CountryLabel country={relatedStory.country} fallback={dict.common.latinAmerica} />
                    </p>
                    <h3 className="mt-2 text-lg font-semibold">{relatedStory.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--color-muted)]">
                      {relatedStory.summary}
                    </p>
                    <Link
                      href={localizedPath(`/historias/${relatedStory.slug}`, locale)}
                      className="mt-4 inline-flex items-center gap-2 rounded-md bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
                    >
                      <BookOpen size={16} aria-hidden="true" />
                      {dict.case.viewRelatedStory}
                    </Link>
                  </div>
                ) : (
                  <Link
                    href={localizedPath("/historias", locale)}
                    className="mt-5 inline-flex items-center gap-2 rounded-md border border-[color:var(--color-border)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--color-primary)]"
                  >
                    {dict.case.viewStories}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                )}
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
