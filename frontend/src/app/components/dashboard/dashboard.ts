import { AfterViewInit, Component, signal, ViewChild } from '@angular/core';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Graph } from '../graph/graph';

@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule, MatCardModule, MatDialogModule, ExpenseList, DatePipe, CurrencyPipe, Charts, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements AfterViewInit {
  dashboardDetails = signal<any>({});


  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;


  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    scales: {
      x: {},
      y: {
        beginAtZero: true
      },
    },
    plugins: {
      legend: {
        display: false,
      }
    },
  };


  public barChartType = 'bar' as const;

  public barChartData: ChartData<'bar'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    ],
  };


  constructor(private router: Router, private expenseService: ExpenseService, private dialog: MatDialog,) {
    this.getDashboard();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.scrollToTop();
    }, 0);
  }

  private scrollToTop() {
    // Try scrolling the window first
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Also try scrolling any parent containers that might be scrollable
    const scrollContainers = [
      document.querySelector('.main'),
      document.querySelector('mat-sidenav-content'),
      document.documentElement,
      document.body
    ];
    
    scrollContainers.forEach(container => {
      if (container && container instanceof Element) {
        try {
          container.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (e) {
          // Fallback for browsers that don't support scrollTo on all elements
          if (container instanceof HTMLElement) {
            container.scrollTop = 0;
          }
        }
      }
    });
  }

  async getDashboard() {
    try {
      const [dashboardResp, analyticsResp] = await Promise.all([
        firstValueFrom(this.expenseService.getDashboard()),
        firstValueFrom(this.expenseService.getMonthlyAnalytics(2025))
      ]);

      this.dashboardDetails.set(dashboardResp.body);
      this.updateMonthlyChart(analyticsResp.body.monthlyTotals);
    } catch (err) {
      console.error('Error fetching dashboard data', err);
    }
  }

  updateMonthlyChart(data: any) {
    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const totals = new Array(12).fill(0);
    data.forEach((m: any) => {
      // Chart.js months are 0-indexed (Jan = 0)
      totals[m.month - 1] = m.total;
    });

    this.barChartData = {
      labels: monthLabels,
      datasets: [
        { data: totals, label: 'Monthly Expenses' }
      ]
    };

    this.chart?.update();
  }

  openDialog() {
    const dialogRef = this.dialog.open(Graph, { autoFocus: false, width: '50vw' });
  }

}
