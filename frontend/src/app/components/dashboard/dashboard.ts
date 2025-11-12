import { Component, signal, ViewChild } from '@angular/core';
import { NavBar } from '../nav-bar/nav-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ExpenseList } from '../expense-list/expense-list';
import { Router } from '@angular/router';
import { ExpenseService } from '../../services/expense/expense-service';
import { firstValueFrom } from 'rxjs';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Charts } from '../chart/chart'; 
import { Chart as ChartJS, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule, MatCardModule, ExpenseList, DatePipe, CurrencyPipe,Charts,BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

  dashboardDetails = signal<any>({});

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    scales: {
      x: {},
      y: {
        min: 10,
      },
    },
    plugins: {
      legend: {
        display: true,
      }
    },
  };


  public barChartType = 'bar' as const;

  public barChartData: ChartData<'bar'> = {
    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
    ],
  };


  constructor(private router: Router, private expenseService: ExpenseService) {
    this.getDashboard();
  }

  async getDashboard() {
    const resp = await firstValueFrom(this.expenseService.getDashboard());
    this.dashboardDetails.set(resp.body);
    console.log(resp);
  }
}
