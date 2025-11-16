import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private ACCESS = 'access_token';
  setAccess(token: string) { localStorage.setItem(this.ACCESS, token); }
  getAccess(): string | null { return localStorage.getItem(this.ACCESS); }
  clear() { localStorage.removeItem(this.ACCESS); }
}
