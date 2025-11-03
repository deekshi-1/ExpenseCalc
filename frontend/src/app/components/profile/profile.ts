import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user/user-service';
import { firstValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [MatIcon, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  name = signal('');
  created = signal(new Date())
  userName = signal('');
  isEditing = false;
  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  constructor(private userService: UserService) {
    this.getData();
  }


  getData = async () => {
    let response = await firstValueFrom(this.userService.getData())
    console.log(response);
    this.userName.set(response.body.name)

    if (response.status == 200 && response.body) {
      this.userName.set(response.body.name)
      this.name.set(response.body.name)
      this.created.set(new Date(response.body.createdAt));
    }
  }


  async update() {
    if (this.userName().trim() === this.name().trim()) {
      alert("No change")
    }
    else {
      try {
        let response = await firstValueFrom(this.userService.updateUser({
          name: this.name().trim()
        }))
        if (response.status === 200) {
          alert("Success")
          this.getData();
          this.isEditing = false
        }
      } catch (error) {
        alert("failed")
      }
    }

  }

}
