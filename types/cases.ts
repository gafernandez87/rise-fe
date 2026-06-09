export type CaseSeverity = "low" | "medium" | "high" | "critical";

export type CaseStatus = "draft" | "published" | "hidden";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
};

export type CaseImage = {
  id: string;
  url: string;
  altText: string;
  sortOrder: number;
  isCover: boolean;
};

export type AdaptationCase = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  severity: CaseSeverity;
  status: CaseStatus;
  latitude: number;
  longitude: number;
  country?: string | null;
  region?: string | null;
  sourceUrl?: string | null;
  category: Category;
  images: CaseImage[];
};

export type MapCase = Pick<
  AdaptationCase,
  | "id"
  | "title"
  | "slug"
  | "shortDescription"
  | "severity"
  | "latitude"
  | "longitude"
  | "country"
  | "region"
> & {
  category: Category;
  coverImageUrl?: string | null;
};
