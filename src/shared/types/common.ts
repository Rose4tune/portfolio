import { ExtendedRecordMap } from "notion-types";

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export interface NotionContentProps {
  recordMap: ExtendedRecordMap;
}
