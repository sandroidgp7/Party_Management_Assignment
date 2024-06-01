import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from './../environment/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  add(params: any) {
    return this.http.post<any[]>(`${environment.apiUrl}/party/`, params);
  }

  getAll() {
    return this.http.get<any[]>(`${environment.apiUrl}/party/`);
  }

  getById(id: string) {
    return this.http.get<any>(`${environment.apiUrl}/party/`, {
      params: {
        id
      }
    });
  }

  update(id: string, params: any) {
    return this.http.put(`${environment.apiUrl}/party/`, params, {
      params: {
        id
      }
    })
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/party/`, {
      params: {
        id
      }
    })
  }
}
