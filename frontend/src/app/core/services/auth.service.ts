import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = `${environment.apiUrl}/auth`;
  constructor(private http: HttpClient) {}
  login(payload: any) { return this.http.post(`${this.api}/login`, payload); }
  refresh() { return this.http.post(`${this.api}/refresh`, {}); }
  logout() { return this.http.post(`${this.api}/logout`, {}); }
}
