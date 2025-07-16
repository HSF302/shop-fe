import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private store: Store,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.select(selectIsAuthenticated).pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (isAuthenticated) {
          return of(true);
        } else {
          // Check session first
          this.store.dispatch(AuthActions.checkSession());
          return this.store.select(selectIsAuthenticated).pipe(
            take(1),
            map(authenticated => {
              if (!authenticated) {
                this.router.navigate(['/auth/login']);
                return false;
              }
              return true;
            })
          );
        }
      })
    );
  }
}
