import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CasePageView,
  CountryProfilePageView,
  CountryProfilesPageView,
  HomePageView,
  MapPageView,
  MethodologyPageView,
  RegionalReportPageView,
  StoriesPageView,
  StoryPageView,
} from "@/components/pages/public-pages";
import {
  getCaseBySlug,
  getCountryProfileBySlug,
  getPublishedCases,
  getPublishedCountryProfiles,
  getPublishedStories,
  getStoryBySlug,
} from "@/lib/api";
import {
  getDictionary,
  isLocale,
  locales,
  localizeCase,
  localizedPath,
  type Locale,
} from "@/lib/i18n";
import { readMapInitialFilters, type SearchParamsRecord } from "@/lib/map-filters";
import { siteConfig } from "@/lib/site";

type LocalizedPageProps = {
  params: Promise<{ locale: string; segments?: string[] }>;
  searchParams: Promise<SearchParamsRecord>;
};

const staticSegments: string[][] = [
  [],
  ["mapa"],
  ["perfiles"],
  ["historias"],
  ["informe-regional"],
  ["metodologia"],
];

function currentPathFromSegments(segments: string[] = []) {
  return segments.length === 0 ? "/" : `/${segments.join("/")}`;
}

function metadataForStaticRoute(locale: Locale, segments: string[]): Metadata | null {
  const dict = getDictionary(locale);
  const path = currentPathFromSegments(segments);

  if (segments.length === 0) {
    return {
      title: "RISE",
      description: dict.metadata.description,
      alternates: { canonical: `${siteConfig.siteUrl}${localizedPath("/", locale)}` },
    };
  }

  if (segments.length === 1) {
    const [route] = segments;
    const titles: Record<string, string> = {
      mapa: dict.map.title,
      perfiles: dict.profiles.title,
      historias: dict.stories.title,
      "informe-regional": dict.report.title,
      metodologia: dict.methodology.title,
    };
    const title = titles[route];

    if (!title) {
      return null;
    }

    return {
      title,
      description: dict.metadata.description,
      alternates: { canonical: `${siteConfig.siteUrl}${localizedPath(path, locale)}` },
    };
  }

  return null;
}

export async function generateMetadata({ params }: LocalizedPageProps): Promise<Metadata> {
  const { locale: localeParam, segments = [] } = await params;

  if (!isLocale(localeParam)) {
    return {};
  }

  const locale = localeParam;
  const staticMetadata = metadataForStaticRoute(locale, segments);

  if (staticMetadata) {
    return staticMetadata;
  }

  if (segments.length === 2 && segments[0] === "casos") {
    const item = localizeCase(await getCaseBySlug(segments[1]), locale);
    const cover = item.images.find((image) => image.isCover) ?? item.images[0];
    const url = `${siteConfig.siteUrl}${localizedPath(`/casos/${item.slug}`, locale)}`;

    return {
      title: item.title,
      description: item.shortDescription,
      alternates: {
        canonical: url,
      },
      openGraph: {
        title: item.title,
        description: item.shortDescription,
        url,
        type: "article",
        images: cover ? [{ url: cover.url, alt: cover.altText }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: item.title,
        description: item.shortDescription,
        images: cover ? [cover.url] : undefined,
      },
    };
  }

  if (segments.length === 2 && segments[0] === "perfiles") {
    const country = await getCountryProfileBySlug(segments[1]);

    if (!country) {
      return {};
    }

    return {
      title: country.name,
      description: country.summary,
      alternates: {
        canonical: `${siteConfig.siteUrl}${localizedPath(currentPathFromSegments(segments), locale)}`,
      },
    };
  }

  if (segments.length === 2 && segments[0] === "historias") {
    const story = await getStoryBySlug(segments[1]);

    if (!story) {
      return {};
    }

    return {
      title: story.title,
      description: story.summary,
      alternates: {
        canonical: `${siteConfig.siteUrl}${localizedPath(currentPathFromSegments(segments), locale)}`,
      },
    };
  }

  return {};
}

export async function generateStaticParams() {
  const [cases, countries, stories] = await Promise.all([
    getPublishedCases(),
    getPublishedCountryProfiles(),
    getPublishedStories(),
  ]);
  const routeSegments = [
    ...staticSegments,
    ...countries.flatMap((country) => [
      ["perfiles", country.slug],
    ]),
    ...stories.map((story) => ["historias", story.slug]),
    ...cases.map((item) => ["casos", item.slug]),
  ];

  return locales.flatMap((locale) => routeSegments.map((segments) => ({ locale, segments })));
}

export default async function LocalizedPage({ params, searchParams }: LocalizedPageProps) {
  const { locale: localeParam, segments = [] } = await params;

  if (!isLocale(localeParam)) {
    notFound();
  }

  const locale = localeParam;
  const currentPath = currentPathFromSegments(segments);

  if (segments.length === 0) {
    return <HomePageView locale={locale} currentPath={currentPath} />;
  }

  if (segments.length === 1) {
    const [route] = segments;

    if (route === "mapa") {
      const initialFilters = readMapInitialFilters(await searchParams);

      return <MapPageView locale={locale} currentPath={currentPath} initialFilters={initialFilters} />;
    }

    if (route === "historias") {
      return <StoriesPageView locale={locale} currentPath={currentPath} />;
    }

    if (route === "perfiles") {
      return <CountryProfilesPageView locale={locale} currentPath={currentPath} />;
    }

    if (route === "informe-regional") {
      return <RegionalReportPageView locale={locale} currentPath={currentPath} />;
    }

    if (route === "metodologia") {
      return <MethodologyPageView locale={locale} currentPath={currentPath} />;
    }
  }

  if (segments.length === 2) {
    const [route, slug] = segments;

    if (route === "historias") {
      return <StoryPageView locale={locale} currentPath={currentPath} slug={slug} />;
    }

    if (route === "perfiles") {
      return <CountryProfilePageView locale={locale} currentPath={currentPath} slug={slug} />;
    }

    if (route === "casos") {
      return <CasePageView locale={locale} currentPath={currentPath} slug={slug} />;
    }
  }

  notFound();
}
