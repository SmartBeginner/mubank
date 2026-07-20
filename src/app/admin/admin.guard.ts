import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { catchError, map, of } from 'rxjs';
import { Data } from '../data';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const data = inject(Data);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId) || !localStorage.getItem('token')) {
    return router.createUrlTree(['/login']);
  }

  return data.getAllTransactions().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/profile']))),
  );
};
