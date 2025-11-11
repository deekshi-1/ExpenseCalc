import { Component, signal } from '@angular/core';
import { NavBar } from '../nav-bar/nav-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ExpenseList } from '../expense-list/expense-list';
import { Router } from '@angular/router';
import { ExpenseService } from '../../services/expense/expense-service';
import { firstValueFrom } from 'rxjs';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule, MatCardModule, ExpenseList, DatePipe,CurrencyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  dashboardDetails = signal<any>({});

  constructor(private router: Router, private expenseService: ExpenseService) {
    this.getExpenseList();
  }

  async getExpenseList() {
    const resp = await firstValueFrom(this.expenseService.getDashboard());
    this.dashboardDetails.set(resp.body);
    console.log(resp);
  }
}
