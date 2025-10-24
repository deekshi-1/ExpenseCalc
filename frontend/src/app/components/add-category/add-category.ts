import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-category',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './add-category.html',
  styleUrl: './add-category.css'
})
export class AddCategory {
  newCategory: string = '';

  categoryname = ['a', 'b', 'c']



  err = signal(false)
  checkCategory(event: KeyboardEvent) {
    setTimeout(() => {
      const inputValue = this.newCategory.trim().toLowerCase();
      const exists = this.categoryname.some(
        name => name.toLowerCase() === inputValue
      );
      this.err.set(exists);
    }, 0);
  }
}
