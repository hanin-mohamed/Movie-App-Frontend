export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface MovieSummary {
  imdbId: string;
  title: string;
  year?: string;
  type?: string;
  poster?: string;
}

export interface MovieDetail extends MovieSummary {
  plot?: string;
  genre?: string;
  runtime?: string;
  director?: string;
  actors?: string;
  language?: string;
  country?: string;
  awards?: string;
  rated?: string;
  released?: string;
}

export interface OmdbItem {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}
export interface OmdbSearchResponse {
  Search: OmdbItem[];
  totalResults: string;
  Response: 'True' | 'False';
  Error?: string;
}
