import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) { }
  api = environment.apiUserUrl;

  getCategory() {
    return this.http.get<any[]>(this.api + 'category/getCategory', { withCredentials: true, observe: 'response' })
  }

  addCategory(data: any) {
    return this.http.post<any[]>(this.api + 'category/addCategory', data, { withCredentials: true, observe: 'response' })
  }
}
