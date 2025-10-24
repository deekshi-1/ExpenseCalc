import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-profile',
  imports: [MatIcon, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  name = signal('');
  userName = signal('');
  isEditing = false;
  toggleEdit() {
    this.isEditing = !this.isEditing;
  }
}
