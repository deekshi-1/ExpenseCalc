import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user/user-service';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';

export const loggedGaurdGuard: CanActivateFn = (route, state) => {

  const userService = inject(UserService);
  const router = inject(Router);

  return userService.checkLogin().pipe(
    map(response => {
      // If user is logged in, DO NOT allow login/signup
      if (response.status === 200) {
        router.navigate(['/ExpenseCalc']);   // redirect to dashboard/home
        return false; // prevent navigation
      }

      // If not logged in, allow navigation to login/signup
      return true;
    }),

    catchError((error) => {
      console.error('Logged guard error:', error);

      // If error (usually 401), allow login/signup
      return of(true);
    })
  );
};
