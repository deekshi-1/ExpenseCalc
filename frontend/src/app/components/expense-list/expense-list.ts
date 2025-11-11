import { Component, Input, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-expense-list',
  imports: [CommonModule, MatIconModule, MatCardModule, RouterLink],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
})
export class ExpenseList {
  private expenseListSignal = signal<any[]>([]);
  readonly expenseList = this.expenseListSignal.asReadonly();

  @Input({ required: false })
  set expenses(value: any[] | undefined | null) {
    this.expenseListSignal.set(Array.isArray(value) ? value : []);
  }
}
