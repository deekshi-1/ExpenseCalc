import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  constructor(private http: HttpClient) {}
  api = environment.apiUserUrl;

  getExpense() {
    return this.http.get<any>(this.api + 'expense/getExpense', {
      withCredentials: true,
      observe: 'response',
    });
  }

  addExpense(data: any) {
    console.log(data);
    return this.http.post<any>(this.api + 'expense/addExpense', data, {
      withCredentials: true,
      observe: 'response',
    });
  }
  getDashboard() {
    return this.http.get<any>(this.api + 'expense/dashboard', {
      withCredentials: true,
      observe: 'response',
    });
  }
}
