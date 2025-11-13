  import { Component, signal, ViewChild } from '@angular/core';
  import { Chart as ChartJS, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';
  import { BaseChartDirective } from 'ng2-charts';
  import { ExpenseService } from '../../services/expense/expense-service';
  import { firstValueFrom } from 'rxjs';
  import { MatFormField } from "@angular/material/form-field";
  import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

  @Component({
    selector: 'app-graph',
    imports: [BaseChartDirective, MatFormField, MatSelectModule,FormsModule],
    templateUrl: './graph.html',
    styleUrl: './graph.css'
  })
  export class Graph {
    @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;

    years = signal<any>([])
    selectedYear = 2025


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
        { data: [] },
      ],
    };

    constructor(private expenseService: ExpenseService) {
      this.getData(2025)
    }

    async getData(year: number) {
      try {
        const graphResp = await firstValueFrom(this.expenseService.getMonthlyAnalytics(year))
        this.updateMonthlyChart(graphResp.body.monthlyTotals);
        this.years.set(graphResp.body.uniqueYears)

      } catch (error) {
        console.log(error);

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
  }
