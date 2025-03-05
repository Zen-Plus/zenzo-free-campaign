import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from './login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly apiKey = 'n53g9GMcoWzmnKV3XCrRbmrXl6P6Ngag';

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken();

    let headers = req.headers.set('Ziqitza-api-key', this.apiKey);

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const clonedRequest = req.clone({ headers });

    return next.handle(clonedRequest);
  }
}
