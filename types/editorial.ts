export type SourceRecord = {
  title?: string;
  organization?: string;
  year?: string;
  url?: string;
  claims?: string;
  reviewed?: boolean;
};
export type MediaMetadata = {
  alt?: string;
  credit?: string;
  permission?: string;
  format?: string;
  captionsUrl?: string;
  transcript?: string;
  language?: string;
};
export type ContentTranslation = {
  language: string;
  status: string;
  title?: string;
  summary?: string;
  content?: string;
};
export type EditorialMetadata = {
  referenceRecords?: SourceRecord[];
  mediaMetadata?: MediaMetadata;
  translations?: ContentTranslation[];
};
