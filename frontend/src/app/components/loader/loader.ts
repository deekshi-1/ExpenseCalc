import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../services/loading/loading-service';

@Component({
  selector: 'app-loader',
  imports: [MatProgressSpinnerModule],
  templateUrl: './loader.html',
  styleUrl: './loader.css'
})
export class Loader {
  isLoading: any

  constructor(private loadingService: LoadingService) {
    this.isLoading = this.loadingService.loading$;
    console.log(this.isLoading);
  }
}
