import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService as SharedAuthService } from '../../shared/services/auth.service';
import { SessionResponse } from '../../shared/models/user.model';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(SharedAuthService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(action =>
        this.authService.login(action.credentials).pipe(
          map(response => {
            if (response.success && response.user) {
              return AuthActions.loginSuccess({ user: response.user });
            } else {
              return AuthActions.loginFailure({ error: response.message });
            }
          }),
          catchError(error => of(AuthActions.loginFailure({ error: error.message })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(({ user }) => {
        if (user.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/products']);
        }
      })
    ),
    { dispatch: false }
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(action =>
        this.authService.register(action.userData).pipe(
          map(response => {
            if (response.success) {
              return AuthActions.registerSuccess({ message: response.message });
            } else {
              return AuthActions.registerFailure({ error: response.message });
            }
          }),
          catchError(error => of(AuthActions.registerFailure({ error: error.message })))
        )
      )
    )
  );

  registerSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.registerSuccess),
      tap(() => {
        this.router.navigate(['/auth/login']);
      })
    ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      exhaustMap(() =>
        this.authService.logout().pipe(
          map(() => AuthActions.logoutSuccess()),
          catchError(error => of(AuthActions.logoutFailure({ error: error.message })))
        )
      )
    )
  );

  logoutSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutSuccess),
      tap(() => {
        this.router.navigate(['/home']);
      })
    ),
    { dispatch: false }
  );

  checkSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.checkSession),
      exhaustMap(() =>
        this.authService.checkSession().pipe(
          map((response: SessionResponse) => {
            return AuthActions.checkSessionSuccess({ user: response.user || null });
          }),
          catchError((error: any) => of(AuthActions.checkSessionFailure({ error: error.message })))
        )
      )
    )
  );


}
