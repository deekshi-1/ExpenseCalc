import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../services/user/user-service';
import { firstValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
import { LoadingService } from '../../services/loading/loading-service';

@Component({
  selector: 'app-profile',
  imports: [MatIcon, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  name = signal('');
  created = signal(new Date());
  userName = signal('');
  user = signal<any>({});
  isEditing = false;
  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  constructor(private userService: UserService, private loadingService: LoadingService) {
    this.getData();
  }

  getData = async () => {
    this.loadingService.show()
    let response = await firstValueFrom(this.userService.getData());
    this.loadingService.hide()
    this.userName.set(response.body.name);
    this.user.set(response.body);
    if (response.status == 200 && response.body) {
      this.userName.set(response.body.name);
      this.name.set(response.body.name);
      this.created.set(new Date(response.body.createdAt));
    }
  };

  async update() {
    if (this.userName().trim() === this.name().trim()) {
      alert('No change');
    } else {
      this.loadingService.show()
      try {
        let response = await firstValueFrom(
          this.userService.updateUser({
            name: this.name(),
          })
        );
        if (response.status === 200) {
          alert('User name updated');
          this.getData();
          this.isEditing = false;
        }
      } catch (error) {
        alert('failed');
      } finally {
        this.loadingService.hide()
      }
    }
  }

  get createdDate() {
    const dateStr = this.user()?.createdAt;
    if (!dateStr) return null;

    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }
}
