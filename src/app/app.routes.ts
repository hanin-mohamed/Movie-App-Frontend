import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'movies', canActivate: [authGuard], loadComponent: () => import('./features/movies/movies-list/movies-list.component').then(m => m.MoviesListComponent) },
  { path: 'movies/:imdbId', canActivate: [authGuard], loadComponent: () => import('./features/movies/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent) },
  { path: 'admin', canActivate: [authGuard, roleGuard('ADMIN')], loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  { path: '', pathMatch: 'full', redirectTo: 'movies' },
  { path: '**', redirectTo: 'movies' }
];
