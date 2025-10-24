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
    console.log(this.api);

    return this.http.post<any[]>(this.api + 'auth/login', data, { withCredentials: true })
  }

}
