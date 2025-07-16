import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map(user => {
        if (!user) {
          // User is not authenticated (guest), allow access
          return true;
        } else {
          // User is authenticated, redirect based on role
          if (user.role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/products']);
          }
          return false;
        }
      }),
      catchError(() => {
        // On error, assume guest access
        return of(true);
      })
    );
  }
}
