import { Injectable } from '@angular/core';
import {
  HttpRequest, HttpHandler, HttpEvent,
  HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Prefix relative URLs with the API base URL
    let apiReq = req;
    if (!req.url.startsWith('http')) {
      apiReq = req.clone({ url: `${environment.apiUrl}${req.url}` });
    }

    // Attach Bearer token if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      apiReq = apiReq.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(apiReq).pipe(
      catchError((err: HttpErrorResponse) => {
        // Auto-logout on 401
        if (err.status === 401 && !apiReq.url.includes('/auth/login')) {
          localStorage.clear();
          window.location.href = '/auth/login';
        }
        return throwError(() => err.error || err);
      })
    );
  }
}
