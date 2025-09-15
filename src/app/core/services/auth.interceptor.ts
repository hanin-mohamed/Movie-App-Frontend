import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TokenStorage } from '../services/token-storage.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const store = inject(TokenStorage);
  const auth = inject(AuthService);

  const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/refresh') || req.url.includes('/auth/logout');
  const withAuth = store.access ? req.clone({ setHeaders: { Authorization: `Bearer ${store.access}` } }) : req;

  return next(isAuthEndpoint ? req : withAuth).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== 401 || isAuthEndpoint) return throwError(() => err);

      return auth.refreshToken().pipe(
        switchMap((newAccess) => {
          const retry = req.clone({ setHeaders: { Authorization: `Bearer ${newAccess}` } });
          return next(retry);
        }),
        catchError(refreshErr => {
          store.clear();
          return throwError(() => refreshErr);
        })
      );
    })
  );
};
