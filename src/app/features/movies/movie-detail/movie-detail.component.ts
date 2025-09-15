import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../../core/services/movie.service';
import { MovieDetail } from '../../../core/models/movie.models';
import { RatingService } from '../../../core/services/rating.service';
import { StarRatingComponent } from '../../star-rating/star-rating/star-rating.component';
import { ToastService } from '../../../shared/toast/toast.service';
import { RatingSummary } from '../../../core/models/rating,models';

@Component({
  standalone: true,
  selector: 'app-movie-detail',
  imports: [CommonModule, StarRatingComponent],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent {
  imdbId = signal<string>('');
  movie = signal<MovieDetail | null>(null);
  summary = signal<RatingSummary | null>(null);
  my = signal<number | null>(null);
  loading = signal(true);
  saving = signal(false);

  constructor(
    private route: ActivatedRoute,
    private movies: MovieService,
    private ratings: RatingService,
    private toast: ToastService
  ) {
    effect(() => {
      this.imdbId.set(this.route.snapshot.paramMap.get('imdbId') || '');
      this.fetch();
    });
  }

  fetch() {
    this.loading.set(true);
    const id = this.imdbId();
    this.movies.detail(id).subscribe({
      next: d => { this.movie.set(d); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
    this.ratings.my(id).subscribe({ next: r => { this.summary.set(r); this.my.set(r.myRating ?? null); }});
  }

  rate(v:number) {
    this.saving.set(true);
    this.ratings.rate(this.imdbId(), v).subscribe({
      next: r => { this.summary.set(r); this.my.set(r.myRating ?? v); this.saving.set(false); this.toast.success('Your rating saved'); },
      error: () => { this.saving.set(false); this.toast.error('Failed to save rating'); }
    });
  }

  clear() {
    this.saving.set(true);
    this.ratings.deleteMy(this.imdbId()).subscribe({
      next: r => { this.summary.set(r); this.my.set(null); this.saving.set(false); this.toast.success('Rating cleared'); },
      error: () => { this.saving.set(false); this.toast.error('Failed to clear rating'); }
    });
  }
}
