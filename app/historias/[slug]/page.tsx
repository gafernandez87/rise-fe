import type { Metadata } from "next";
import { StoryPageView } from "@/components/pages/public-pages";
import { getPublishedStories, getStoryBySlug } from "@/lib/api";
import { siteConfig } from "@/lib/site";

type StoryPageProps = {
  params: Promise<{ slug: string }>;
};

function isLikelyImageUrl(url: string) {
  return /\.(avif|gif|jpe?g|png|webp)(\?.*)?$/i.test(url);
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    return {};
  }

  const url = `${siteConfig.siteUrl}/historias/${story.slug}`;
  const imageUrl = story.mediaUrl && isLikelyImageUrl(story.mediaUrl) ? story.mediaUrl : undefined;

  return {
    title: story.title,
    description: story.summary,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: story.title,
      description: story.summary,
      url,
      type: "article",
      images: imageUrl ? [{ url: imageUrl, alt: story.mediaAlt ?? story.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: story.title,
      description: story.summary,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const stories = await getPublishedStories();
  return stories.map((story) => ({ slug: story.slug }));
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;

  return <StoryPageView locale="es" currentPath={`/historias/${slug}`} slug={slug} />;
}
