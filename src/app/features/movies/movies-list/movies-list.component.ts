import { Component, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MovieSummary, PageResponse } from '../../../core/models/movie.models';
import { MovieService } from '../../../core/services/movie.service';
import { TokenStorage } from '../../../core/services/token-storage.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-movies-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss']
})
export class MoviesListComponent {
  q = signal('');
  page = signal(1);
  size = 15;
  loading = signal(false);
  data = signal<PageResponse<MovieSummary> | null>(null);
  totalPages = computed(() => this.data()?.totalPages ?? 1);
  isAdmin = false;

  constructor(
    private movies: MovieService,
    private store: TokenStorage,
    private toast: ToastService,
    private auth: AuthService,
    private router: Router
  ) {
    this.isAdmin = this.store.role === 'ADMIN';
    effect(() => { const p=this.page(); const s=this.q(); this.fetch(p, s); });
  }

  private fetch(p:number, s:string) {
    this.loading.set(true);
    this.movies.list(p, this.size, s).subscribe({
      next: d => { this.data.set(d); this.loading.set(false); },
      error: () => { this.loading.set(false); }
    });
  }

  search(){ this.page.set(1); }
  next(){ if (this.page()<this.totalPages()) this.page.set(this.page()+1); }
  prev(){ if (this.page()>1) this.page.set(this.page()-1); }

  onDelete(ev: Event, id: string){
    ev.preventDefault(); ev.stopPropagation();
    this.movies.deleteOne(id).subscribe({
      next: ()=>{ this.toast.success('Movie deleted'); this.fetch(this.page(), this.q()); },
      error: ()=> this.toast.error('Delete failed')
    });
  }

  trackById=(_:number,m:MovieSummary)=>m.imdbId;

  logout(){
    this.auth.logout().subscribe({
      next: ()=>{ this.toast.success('Logged out'); this.router.navigate(['/login']); },
      error: ()=>{ this.store.clear(); this.router.navigate(['/login']); }
    });
  }
}
