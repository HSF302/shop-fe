import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to add credentials for session-based auth
    const authReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json'
      },
      withCredentials: true // Important for session-based authentication
    });

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = error.error.message;
        } else {
          // Server-side error
          switch (error.status) {
            case 401:
              errorMessage = 'Authentication required. Please log in.';
              this.router.navigate(['/auth/login']);
              break;
            case 403:
              errorMessage = 'Access denied. You do not have permission to perform this action.';
              break;
            case 404:
              errorMessage = 'The requested resource was not found.';
              break;
            case 500:
              errorMessage = 'Internal server error. Please try again later.';
              break;
            default:
              if (error.error?.message) {
                errorMessage = error.error.message;
              } else if (error.error?.error) {
                errorMessage = error.error.error;
              } else {
                errorMessage = `Error ${error.status}: ${error.statusText}`;
              }
          }
        }

        // Show error message to user
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
