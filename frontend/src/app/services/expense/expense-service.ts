import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  constructor(private http: HttpClient) { }
  api = environment.apiUserUrl;

  getExpense(page: number, pageSize: number) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<any>(this.api + 'expense/getExpense', {
      params,
      withCredentials: true,
      observe: 'response',
    });
  }

  addExpense(data: any) {
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

  getCategoryAnalytics() {
    return this.http.get<any>(this.api + 'expense/analytics/categories', {
      withCredentials: true,
      observe: 'response',
    });
  }

  getMonthlyAnalytics(year?: number) {
    let params = new HttpParams();
    if (year) {
      params = params.set('year', year.toString());
    }
    return this.http.get<any>(this.api + 'expense/analytics/yearly', {
      params,
      withCredentials: true,
      observe: 'response',
    });
  }

  getExpenseById(id: string) {
    return this.http.get<any>(this.api + 'expense/getExpense/' + id, {
      withCredentials: true,
      observe: 'response',
    });
  }

  updateExpense(id: string, data: any) {
    return this.http.put<any>(this.api + 'expense/updateExpense/' + id, data, {
      withCredentials: true,
      observe: 'response',
    });
  }

  deleteExpense(id: string) {
    return this.http.delete<any>(this.api + 'expense/deleteExpense/' + id, {
      withCredentials: true,
      observe: 'response',
    });
  }

}
