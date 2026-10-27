import type { EditorialMetadata } from "@/types/editorial";
import type { CaseStatus } from "@/types/cases";

export type StoryStatus = CaseStatus;

export type ResilienceStory = EditorialMetadata & {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  status: StoryStatus;
  country?: string | null;
  territory?: string | null;
  mainRisk?: string | null;
  caseId?: string | null;
  mediaUrl?: string | null;
  mediaAlt?: string | null;
  sourceUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
