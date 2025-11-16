import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class RefreshInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private auth: AuthService, private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(err => {
        if (err instanceof HttpErrorResponse && err.status === 401) {
          // try refresh
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.auth.refresh().pipe(
              switchMap((res: any) => {
                const newToken = res.accessToken;
                this.tokenService.setAccess(newToken);
                this.refreshTokenSubject.next(newToken);
                this.isRefreshing = false;
                // retry original request
                const cloned = req.clone({ setHeaders: { Authorization: 'Bearer ' + newToken } });
                return next.handle(cloned);
              }),
              catchError(error => {
                this.isRefreshing = false;
                this.tokenService.clear();
                return throwError(() => error);
              })
            );
          } else {
            return this.refreshTokenSubject.pipe(
              filter(token => token != null),
              take(1),
              switchMap(token => {
                const cloned = req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
                return next.handle(cloned);
              })
            );
          }
        }
        return throwError(() => err);
      })
    );
  }
}
