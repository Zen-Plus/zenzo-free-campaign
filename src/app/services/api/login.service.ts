import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environment/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.baseUrl + environment.apiver + environment.loginEndpoint;
  private token: string | null = null;
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}`, { loginId: email, password: password }).pipe(
      tap(response => {
        this.setToken(response.token);
      })
    );
  }

  logout(): void {
    this.clearToken();
    this.router.navigate(['']);
  }

  private setToken(token: string) {
    this.token = token;
    this.tokenSubject.next(token);
  }

  private clearToken() {
    this.token = null;
    this.tokenSubject.next(null);
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): Observable<boolean> {
    return this.tokenSubject.asObservable().pipe(
      map((token: any) => !!token)
    );
  }
}
