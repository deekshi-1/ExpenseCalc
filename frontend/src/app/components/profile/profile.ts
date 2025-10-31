import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user-service';
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
  email = signal('');
  created = signal(new Date())
  user: any = null;
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
    this.user = response.body

    if (response.status == 200 && response.body) {
      this.name.set(response.body.name)
      this.email.set(response.body.email)
      this.created.set(new Date(response.body.createdAt));


    }
  }


  async update() {
    if (this.user?.name === this.name() && this.user.email === this.email()) {
      alert("No change")
    }
    else {
      let data = {
        name: this.name(),
        email: this.email(),
      }
      try {
        let response = await firstValueFrom(this.userService.updateUser(data))
      } catch (error) {

      }
    }

  }

}
