import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private api = `${environment.apiUrl}/categories`;
  constructor(private http: HttpClient) {}

  list() { return this.http.get(this.api); }
  get(id: string) { return this.http.get(`${this.api}/${id}`); }
  create(payload: any) { return this.http.post(this.api, payload); }
  update(id: string, payload: any) { return this.http.put(`${this.api}/${id}`, payload); }
  delete(id: string) { return this.http.delete(`${this.api}/${id}`); }
}
