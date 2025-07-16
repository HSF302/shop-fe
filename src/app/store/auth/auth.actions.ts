import { createAction, props } from '@ngrx/store';
import { User, LoginRequest, RegisterRequest } from '../../shared/models/user.model';

// Login Actions
export const login = createAction(
  '[Auth] Login',
  props<{ credentials: LoginRequest }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

// Register Actions
export const register = createAction(
  '[Auth] Register',
  props<{ userData: RegisterRequest }>()
);

export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ message: string }>()
);

export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

// Logout Actions
export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ error: string }>()
);

// Session Actions
export const checkSession = createAction('[Auth] Check Session');

export const checkSessionSuccess = createAction(
  '[Auth] Check Session Success',
  props<{ user: User | null }>()
);

export const checkSessionFailure = createAction(
  '[Auth] Check Session Failure',
  props<{ error: string }>()
);

// Forgot Password Actions
export const forgotPassword = createAction(
  '[Auth] Forgot Password',
  props<{ email: string }>()
);

export const forgotPasswordSuccess = createAction(
  '[Auth] Forgot Password Success',
  props<{ message: string }>()
);

export const forgotPasswordFailure = createAction(
  '[Auth] Forgot Password Failure',
  props<{ error: string }>()
);

// Reset Password Actions
export const resetPassword = createAction(
  '[Auth] Reset Password',
  props<{ token: string; newPassword: string }>()
);

export const resetPasswordSuccess = createAction(
  '[Auth] Reset Password Success',
  props<{ message: string }>()
);

export const resetPasswordFailure = createAction(
  '[Auth] Reset Password Failure',
  props<{ error: string }>()
);

// Update Profile Actions
export const updateProfile = createAction(
  '[Auth] Update Profile',
  props<{ profileData: any }>()
);

export const updateProfileSuccess = createAction(
  '[Auth] Update Profile Success',
  props<{ user: User }>()
);

export const updateProfileFailure = createAction(
  '[Auth] Update Profile Failure',
  props<{ error: string }>()
);

// Change Password Actions
export const changePassword = createAction(
  '[Auth] Change Password',
  props<{ currentPassword: string; newPassword: string }>()
);

export const changePasswordSuccess = createAction(
  '[Auth] Change Password Success',
  props<{ message: string }>()
);

export const changePasswordFailure = createAction(
  '[Auth] Change Password Failure',
  props<{ error: string }>()
);

// Clear Auth State
export const clearAuthState = createAction('[Auth] Clear State');
