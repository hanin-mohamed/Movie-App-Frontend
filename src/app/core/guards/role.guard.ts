import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenStorage } from '../services/token-storage.service';

export function roleGuard(required: 'ADMIN'|'USER'): CanActivateFn {
  return () => {
    const router = inject(Router);
    const store = inject(TokenStorage);
    const role = store.role;
    if (role === required) return true;
    router.navigate(['/movies']);
    return false;
  };
}
