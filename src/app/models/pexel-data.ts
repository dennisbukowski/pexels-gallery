import { PexelPhoto } from "./pexel-photo";

export interface PexelData {
  page: number;
  per_page: number;
  total_results: number;
  photos: PexelPhoto[];
  next_page: string;
  prev_page: string;
}
