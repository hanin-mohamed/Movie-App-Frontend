import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environment';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PageResponse, MovieSummary, MovieDetail, OmdbSearchResponse } from '../models/movie.models';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private base = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  list(page = 1, size = 20, search?: string): Observable<PageResponse<MovieSummary>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search && search.trim()) params = params.set('search', search.trim());
    return this.http.get<{ data: PageResponse<MovieSummary> }>(`${this.base}/movies`, { params })
      .pipe(map(r => r.data));
  }

  detail(imdbId: string): Observable<MovieDetail> {
    return this.http.get<{ data: MovieDetail }>(`${this.base}/movies/${imdbId}`)
      .pipe(map(r => r.data));
  }

  // Admin
  omdbSearch(query: string, page = 1): Observable<OmdbSearchResponse> {
    const params = new HttpParams().set('query', query).set('page', page);
    return this.http.get<{ data: OmdbSearchResponse }>(`${this.base}/movies/omdb/search`, { params })
      .pipe(map(r => r.data));
  }

  importFromOmdb(imdbIds: string[]) {
    return this.http.post<{ data: any }>(`${this.base}/movies/omdb/import`, { imdbIds })
      .pipe(map(r => r.data));
  }

  deleteOne(imdbId: string) {
    return this.http.delete<{ data: any }>(`${this.base}/movies/${imdbId}`).pipe(map(r => r.data));
  }

  deleteBatch(ids: string[]) {
    const params = new HttpParams().set('ids', ids.join(','));
    return this.http.delete<{ data: { deleted: number } }>(`${this.base}/movies/batch`, { params })
      .pipe(map(r => r.data));
  }
}
