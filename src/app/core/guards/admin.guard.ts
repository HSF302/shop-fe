import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      map(user => {
        if (user && user.role === 'ADMIN') {
          return true;
        } else if (user) {
          // User is authenticated but not admin
          this.router.navigate(['/products']);
          return false;
        } else {
          // User is not authenticated
          this.router.navigate(['/auth/login']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/auth/login']);
        return of(false);
      })
    );
  }
}
