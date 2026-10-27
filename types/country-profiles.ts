import type { EditorialMetadata } from "@/types/editorial";
import type { CaseStatus } from "@/types/cases";

export type CountryProfileStatus = CaseStatus;

export type CountryProfile = EditorialMetadata & {
  id: string;
  name: string;
  slug: string;
  summary: string;
  status: CountryProfileStatus;
  mainRisk: string;
  territory: string;
  sector: string;
  measuresCount: number;
  storyTitle?: string | null;
  risks: string[];
  heroImageUrl?: string | null;
  profilePdfUrl?: string | null;
  riskAnalysis?: string | null;
  climateThreats?: string | null;
  exposureAndVulnerabilities?: string | null;
  exposure?: string | null;
  vulnerability?: string | null;
  institutionalFramework?: string | null;
  criticalSectors?: string | null;
  prioritizedZones?: string | null;
  adaptationMeasures?: string | null;
  featuredStory?: string | null;
  sources?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
