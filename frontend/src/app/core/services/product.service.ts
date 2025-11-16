@Injectable({ providedIn: 'root' })
export class ProductService {

  private api = environment.apiUrl + "/products";

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get(this.api);
  }

  getAdvanced(params: any) {
    return this.http.get(`${this.api}/advanced/list`, { params });
  }

  create(data: any) {
    return this.http.post(this.api, data);
  }

  update(id: string, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete(`${this.api}/${id}`);
  }

  bulkUpload(file: any) {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post(`${this.api}/bulk/upload`, formData);
  }

  export(format: "csv" | "xlsx", filters: any = {}) {
    const params = new HttpParams({ fromObject: { format, ...filters } });
    return this.http.get(`${this.api}/export/bulk`, {
      params,
      responseType: 'blob'
    });
  }
}
