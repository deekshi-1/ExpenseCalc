import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user/user-service';
import { firstValueFrom } from 'rxjs';




@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  err: boolean = false;
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)]),
  });
  constructor(private router: Router, private userService: UserService) { }

  async submit() {
    const data = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    };

    try {
      let response = await firstValueFrom(this.userService.login(data))
      if (response.status == 200) {
        this.router.navigateByUrl('/')
      }
    } catch (error) {
      console.log((error as any).error);
      this.err = true;
    }

  }
}
