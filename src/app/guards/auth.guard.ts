import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

// rxjs
import { Observable, of } from 'rxjs';
import { map, take, timeout, catchError } from 'rxjs/operators';

// auth service
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
  _route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // auth guard using RxJS operators and AuthService user observable.
  return authService.user$.pipe(
    timeout(5000),
    take(1),
    map((user) => {
      if (user) return true;
      return router.createUrlTree(['/signin'], {
        queryParams: { returnUrl: state.url },
      });
    }),
    catchError(() => {
      // if firebase fails or times out, redirect to signin
      return of(router.createUrlTree(['/signin']));
    }),
  );
};
