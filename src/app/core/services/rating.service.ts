import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RatingSummary, RatingRequest } from '../models/rating,models';

@Injectable({ providedIn: 'root' })
export class RatingService {
  private base = environment.apiBaseUrl + '/movies/rating';

  constructor(private http: HttpClient) {}

  my(imdbId: string): Observable<RatingSummary> {
    return this.http.get<{ data: RatingSummary }>(`${this.base}/${imdbId}`).pipe(map(r => r.data));
  }
  summary(imdbId: string): Observable<RatingSummary> {
    return this.http.get<{ data: RatingSummary }>(`${this.base}/${imdbId}/summary`).pipe(map(r => r.data));
  }
  rate(imdbId: string, score: number): Observable<RatingSummary> {
    return this.http.put<{ data: RatingSummary }>(`${this.base}/${imdbId}`, <RatingRequest>{ score })
      .pipe(map(r => r.data));
  }
  deleteMy(imdbId: string): Observable<RatingSummary> {
    return this.http.delete<{ data: RatingSummary }>(`${this.base}/${imdbId}`).pipe(map(r => r.data));
  }
}
