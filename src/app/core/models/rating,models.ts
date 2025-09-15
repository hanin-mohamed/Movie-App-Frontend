export interface RatingRequest {
  score: number;
 }
 
export interface RatingSummary {
  average: number;
  count: number;
  myRating?: number | null;
}
