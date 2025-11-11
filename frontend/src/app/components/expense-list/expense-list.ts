import { Component, Input, computed, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from "@angular/router";
import { ExpenseService } from '../../services/expense/expense-service';
import { firstValueFrom } from 'rxjs';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-expense-list',
  imports: [CommonModule, MatIconModule, MatCardModule, RouterLink, MatPaginatorModule, MatTooltipModule],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
})
export class ExpenseList {
  expenseListSignal = signal<any[]>([]);
  totalExpenses: number = 0;
  pagesize: number = 10;
  currentPage: number = 1;
  pageSizeOptions = [5, 10, 20];


  constructor(private router: Router, private expenseService: ExpenseService) {
    this.getExpenseList();
  }

  async getExpenseList() {
    const resp = await firstValueFrom(this.expenseService.getExpense(this.currentPage, this.pagesize))
    this.expenseListSignal.set(resp.body.expenses ?? []);
    this.totalExpenses = resp.body.totalExpenses ?? 0;
  }

  handlePageEvent(event: PageEvent): void {
    this.pagesize = event.pageSize;
    this.currentPage = event.pageIndex + 1; // Convert 0-index to 1-index!
    this.getExpenseList();
  }


  openExpense(expenseId: string) {
    this.router.navigate(['/ExpenseCalc/add-expense'], {
      queryParams: { id: expenseId }
    });
  }
}
