import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../../core/services/movie.service';
import { MovieSummary, OmdbItem, OmdbSearchResponse, PageResponse } from '../../../core/models/movie.models';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  mode: 'db'|'import' = 'db';
  page = 1; size = 15;
  dbLoading = false;
  dbData: PageResponse<MovieSummary> | null = null;

  q = '';
  omdbPage = 1;
  omdbLoading = false;
  omdbRes: OmdbSearchResponse | null = null;
  selected = new Set<string>();

  constructor(private movies: MovieService, private toast: ToastService) {}

  loadDb() {
    this.dbLoading = true;
    this.movies.list(this.page, this.size).subscribe({
      next: d => { this.dbData = d; this.dbLoading = false; },
      error: () => { this.dbLoading = false; }
    });
  }
  nextDb(){ if (this.dbData && this.page < this.dbData.totalPages){ this.page++; this.loadDb(); } }
  prevDb(){ if (this.page > 1){ this.page--; this.loadDb(); } }
  deleteOne(id:string){
    this.movies.deleteOne(id).subscribe({
      next: () => { this.toast.success('Movie deleted'); this.loadDb(); },
      error: () => this.toast.error('Delete failed')
    });
  }

  enterImport(){ this.mode = 'import'; this.omdbRes = null; this.selected.clear(); this.q=''; this.omdbPage=1; }
  backToDb(){ this.mode = 'db'; this.loadDb(); }

  searchOmdb(){
    const query = this.q.trim(); if (!query) return;
    this.omdbLoading = true;
    this.movies.omdbSearch(query, this.omdbPage).subscribe({
      next: r => { this.omdbRes = r; this.omdbLoading = false; },
      error: () => { this.omdbLoading = false; }
    });
  }
  omdbPrev(){ if (this.omdbPage>1){ this.omdbPage--; this.searchOmdb(); } }
  omdbNext(){ this.omdbPage++; this.searchOmdb(); }
  toggle(id:string){ this.selected.has(id)? this.selected.delete(id): this.selected.add(id); }
  importSelected(){
    if (!this.selected.size) return;
    this.omdbLoading = true;
    this.movies.importFromOmdb(Array.from(this.selected)).subscribe({
      next: () => { this.omdbLoading = false; this.toast.success('Imported'); this.backToDb(); },
      error: () => { this.omdbLoading = false; this.toast.error('Import failed'); }
    });
  }

  trackOmdb = (_:number, i:OmdbItem)=>i.imdbID;
  trackDb   = (_:number, m:MovieSummary)=>m.imdbId;

  ngOnInit(){ this.loadDb(); }
}
