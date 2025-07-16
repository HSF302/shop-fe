import { createReducer, on } from '@ngrx/store';
import { User } from '../../shared/models/user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

export const authReducer = createReducer(
  initialState,

  // Login
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true,
    loading: false,
    error: null
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
    error
  })),

  // Register
  on(AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(AuthActions.registerSuccess, (state) => ({
    ...state,
    loading: false,
    error: null
  })),

  on(AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    loading: true
  })),

  on(AuthActions.logoutSuccess, (state) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  })),

  on(AuthActions.logoutFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // Session Check
  on(AuthActions.checkSession, (state) => ({
    ...state,
    loading: true
  })),

  on(AuthActions.checkSessionSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: !!user,
    loading: false,
    error: null
  })),

  on(AuthActions.checkSessionFailure, (state, { error }) => ({
    ...state,
    user: null,
    isAuthenticated: false,
    loading: false,
    error
  })),

  // Clear State
  on(AuthActions.clearAuthState, () => initialState)
);
