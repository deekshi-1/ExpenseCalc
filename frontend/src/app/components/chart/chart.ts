import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, signal } from '@angular/core';
import { ExpenseService } from '../../services/expense/expense-service';
import { firstValueFrom } from 'rxjs';
import { Chart as ChartJS, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MatDivider } from '@angular/material/divider';

ChartJS.register(...registerables);

@Component({
  selector: 'app-chart',
  imports: [BaseChartDirective, MatDivider],
  templateUrl: './chart.html',
  styleUrl: './chart.css'
})
export class Chart implements AfterViewInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  pieChartType: ChartType = 'pie';
  pieChartData = signal<ChartData<'pie', number[], string | string[]>>({
    labels: [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'],
    datasets: [
      {
        data: [300, 500, 100],
      },
    ],
  });
  pieChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  constructor(private expenseService: ExpenseService, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.getCategoryAnalytics();
  }

  async getCategoryAnalytics() {
    const resp = await firstValueFrom(this.expenseService.getCategoryAnalytics());
    console.log(resp);

    const labels = resp.body.map((item: any) => item.category);
    const data = resp.body.map((item: any) => item.total);

    const newChartData: ChartData<'pie', number[], string | string[]> = {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40'
          ],
        },
      ],
    };
    this.pieChartData.set(newChartData);

    this.cdr.detectChanges();
    this.chart?.update();
  }



}
