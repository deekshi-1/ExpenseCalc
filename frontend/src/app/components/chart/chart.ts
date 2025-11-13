import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, signal, input, Input } from '@angular/core';
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
  @Input() chartData: any; 

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
    const labels = this.chartData.map((item: any) => item.category);
    const data = this.chartData.map((item: any) => item.total);
    this.pieChartData.labels = labels;
    this.pieChartData.datasets[0].data = data;
    this.chart?.update();
  }

}
