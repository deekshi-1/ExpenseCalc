import { Component, signal } from '@angular/core';
import { ExpenseService } from '../../services/expense/expense-service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-expense-list',
  imports: [MatIconModule, MatCardModule,DatePipe],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
})
export class ExpenseList {
  expenseList = signal<any>({});

  constructor(private router: Router, private expenseService: ExpenseService) {
    // this.getExpenseList();
  }

  async getExpenseList() {
    const resp = await firstValueFrom(this.expenseService.getExpense());
    
    this.expenseList.set(resp.body)
    console.log(this.expenseList().expenses);
  }
}
