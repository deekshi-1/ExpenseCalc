import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { firstValueFrom } from 'rxjs';
import { CategoryService } from '../../services/category/category-service';

@Component({
  selector: 'app-add-category',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './add-category.html',
  styleUrl: './add-category.css'
})



export class AddCategory {
  newCategory: string = '';

  categoryname = ['a', 'b', 'c']

  category = signal<Category[]>([])

  constructor(private catagoryService: CategoryService) {
    this.getCategory();
  }

  err = signal(false)
  checkCategory() {
    const inputValue = this.newCategory.trim().toLowerCase();
    const exists = this.category().some(
      (item) => item.name.toLowerCase() === inputValue
    );
    this.err.set(exists);
  }

  async getCategory() {
    let response = await firstValueFrom(this.catagoryService.getCategory())
    this.category.set(response.body ?? []);
  }
  
  async addCategory() {
    console.log(this.err());

    if (this.newCategory !== "" && !this.err()) {
      let response = await firstValueFrom(this.catagoryService.addCategory({ name: this.newCategory }))
      console.log(response);

    }
  }
}

interface Category {
  id: number;
  name: string;
}