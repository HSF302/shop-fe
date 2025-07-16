import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectIsAdmin, selectIsAuthenticated } from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private store: Store,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.select(selectIsAuthenticated).pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          // Check session first
          this.store.dispatch(AuthActions.checkSession());
          return this.store.select(selectIsAuthenticated).pipe(
            take(1),
            switchMap(authenticated => {
              if (!authenticated) {
                this.router.navigate(['/auth/login']);
                return of(false);
              }
              return this.checkAdminRole();
            })
          );
        } else {
          return this.checkAdminRole();
        }
      })
    );
  }

  private checkAdminRole(): Observable<boolean> {
    return this.store.select(selectIsAdmin).pipe(
      take(1),
      map(isAdmin => {
        if (!isAdmin) {
          this.router.navigate(['/home']);
          return false;
        }
        return true;
      })
    );
  }
}
