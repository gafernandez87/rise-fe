import type { CaseStatus } from "@/types/cases";

export type CountryProfileStatus = CaseStatus;

export type CountryProfile = {
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
  adaptationMeasures?: string | null;
  featuredStory?: string | null;
  sources?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
