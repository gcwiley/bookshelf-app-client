import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

// auth service
import { AuthService } from '../services/auth.service';

// rxjs
import { switchMap, take } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // retrieve the ID token dynamically from the service where it was safely initialized
  return authService.idToken$.pipe(
    take(1),
    switchMap((token) => {
      if (token) {
        // clone the request and set the Authorization header
        const clonedRequest = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next(clonedRequest);
      }
      // if the user isn't logged in, send the request unmodified
      return next(req);
    }),
  );
};
