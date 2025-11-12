import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, signal } from '@angular/core';
import { ExpenseService } from '../../services/expense/expense-service';
import { firstValueFrom } from 'rxjs';
import { Chart as ChartJS, ChartConfiguration, ChartData, ChartType, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MatDivider } from '@angular/material/divider';

ChartJS.register(...registerables);

@Component({
  selector: 'app-chart',
  imports: [BaseChartDirective],
  templateUrl: './chart.html',
  styleUrl: './chart.css'
})
export class Charts implements AfterViewInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  pieChartType: ChartType = 'pie';
  pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Download Sales', 'In Store Sales', 'Mail Sales'],
    datasets: [
      {
        data: [300, 500, 100],
      },
    ],
  };

  pieChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display:true,
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

    const labels = resp.body.categoryTotals.map((item: any) => item.category);
    const data = resp.body.categoryTotals.map((item: any) => item.total);
    console.log(labels, data);
    this.pieChartData.labels = labels;
    this.pieChartData.datasets[0].data = data;
    this.chart?.update();
  }

}
