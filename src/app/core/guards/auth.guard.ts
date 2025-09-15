import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenStorage } from '../services/token-storage.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const store = inject(TokenStorage);
  if (store.isLoggedIn()) return true;
  router.navigate(['/login']);
  return false;
};
