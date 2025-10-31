import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }
  api = environment.apiUserUrl;

  login(data: any) {
    return this.http.post<any[]>(this.api + 'auth/login', data, { withCredentials: true, observe: 'response' })
  }

  signup(data: any) {
    return this.http.post<any>(this.api + 'auth/signup', data, { observe: 'response' })
  }

  getData() {
    return this.http.get<any>(this.api + 'user/getData', { withCredentials: true, observe: 'response' })
  }

  updateUser(data: any) {
    return this.http.patch<any>(this.api + 'user/upDate', DataTransfer, { withCredentials: true, observe: 'response' })
  }

}
