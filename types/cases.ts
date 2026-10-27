import type { EditorialMetadata } from "@/types/editorial";
export type CaseSeverity = "low" | "medium" | "high" | "critical";

export type CaseStatus =
  | "draft"
  | "review"
  | "published"
  | "archived"
  | "hidden";

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

export type AdaptationCase = EditorialMetadata & {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  severity: CaseSeverity | null;
  status: CaseStatus;
  latitude: number | null;
  longitude: number | null;
  riskMethod?: string | null;
  riskSourceUrl?: string | null;
  coordinatePrecision?: string | null;
  locationMethod?: string | null;
  implementationStage?: string | null;
  sector?: string | null;
  threatTermId?: string | null;
  measureTermId?: string | null;
  environmentTermId?: string | null;
  sectorTermId?: string | null;
  country?: string | null;
  region?: string | null;
  locality?: string | null;
  subnationalJurisdiction?: string | null;
  ecoregion?: string | null;
  implementationDate?: string | null;
  photoUrl?: string | null;
  threat?: string | null;
  measureType?: string | null;
  scope?: string | null;
  adaptationFocus?: string | null;
  nationalVulnerabilityProfile?: string | null;
  objectives?: string | null;
  proposedSolutions?: string | null;
  beneficiaryCommunities?: string | null;
  youthRole?: string | null;
  results?: string | null;
  contact?: string | null;
  financingType?: string | null;
  localClimateProblem?: string | null;
  nationalSocioPoliticalContext?: string | null;
  strategicAlliances?: string | null;
  enablingFactors?: string | null;
  coBenefits?: string | null;
  scalability?: string | null;
  longTermSustainability?: string | null;
  downloadableDocuments?: string | null;
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
  | "country"
  | "region"
  | "locality"
  | "subnationalJurisdiction"
  | "ecoregion"
  | "threat"
  | "measureType"
  | "scope"
  | "adaptationFocus"
  | "youthRole"
> & {
  category: Category;
  latitude: number;
  longitude: number;
  threatAliases?: string[];
  measureAliases?: string[];
  coverImageUrl?: string | null;
  searchText?: string;
};
