import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { firstValueFrom } from 'rxjs';
import { CategoryService } from '../../services/category/category-service';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { LoadingService } from '../../services/loading/loading-service';

@Component({
  selector: 'app-add-category',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIcon,
  ],
  templateUrl: './add-category.html',
  styleUrl: './add-category.css',
})
export class AddCategory {
  newCategory: string = '';

  categoryname = ['a', 'b', 'c'];

  category = signal<Category[]>([]);

  constructor(private catagoryService: CategoryService, private loadingService: LoadingService) {
    this.getCategory();
  }

  err = signal(false);
  checkCategory() {
    const inputValue = this.newCategory.trim().toLowerCase();
    const exists = this.category().some((item) => item.name.toLowerCase() === inputValue);
    this.err.set(exists);
  }

  async getCategory() {
    this.loadingService.show()
    let response = await firstValueFrom(this.catagoryService.getCategory());
    this.loadingService.hide()
    this.category.set(response.body ?? []);
  }

  async addCategory() {
    this.loadingService.show()
    try {
      if (this.newCategory !== '' && !this.err()) {
        let response = await firstValueFrom(
          this.catagoryService.addCategory({ name: this.newCategory.toLowerCase() })
        );
        if (response.status === 201) {
          this.category.set(response.body);
          this.newCategory = '';
        }
      }
    } catch (error) {
      console.log((error as any).error);
    } finally {
      this.loadingService.hide()
    }
  }

  async deleteItem(id: number) {
    this.loadingService.show()
    try {
      let response = await firstValueFrom(await this.catagoryService.removeId(id));
      if (response.status === 200) {
        this.category.set(response.body);
      }
    } catch (error) {
      console.log((error as any).error);
    } finally {
      this.loadingService.hide()
    }
  }
}

interface Category {
  _id: number;
  name: string;
}
