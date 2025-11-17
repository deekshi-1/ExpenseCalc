import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from '../services/user/user-service';

export const authGuard: CanActivateFn = (route, state) => {

  // 1. Inject the services you need
  const userService = inject(UserService);
  const router = inject(Router);

  // 2. Call your service method
  return userService.checkLogin().pipe(

    // 3. Handle a successful HTTP response (e.g., 2xx)
    map(response => {
      if (response.status === 200) {
        return true;
      }
      router.navigate(['/login']);
      return false;
    }),

    // 4. Handle an HTTP error (e.g., 401, 403, 500)
    catchError((error) => {
      // The server most likely returned 401 Unauthorized
      console.error('Auth guard error:', error);

      // Redirect to the login page
      router.navigate(['/login']);

      // Return an observable of 'false' to prevent navigation
      return of(false);
    })
  );
};