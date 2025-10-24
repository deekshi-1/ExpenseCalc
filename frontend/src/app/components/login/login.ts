import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';




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

  submit() {
    const data = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    };
    console.log(data);
    

    this.userService.login(data).subscribe({
      next: (item) => {
        if (item) {
         console.log(item);
         
        }
      }, error: (error) => {
        console.log("erroe");
        
        this.err = true;
      }
    });
  }
}
