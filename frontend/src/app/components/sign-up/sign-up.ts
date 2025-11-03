import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card'
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../services/user/user-service';
@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class Signup {
  err: boolean = false;
  signUpForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)]),
    confirmPassword: new FormControl('', Validators.required),
  }, { validators: this.checkPassword() });

  constructor(private router: Router, private userService: UserService) { }

  async submit() {
    this.err = false;
    if (this.signUpForm.valid) {
      try {
        const data = {
          name: this.signUpForm.get('name')?.value,
          email: this.signUpForm.get('email')?.value,
          password: this.signUpForm.get('password')?.value,
        };

        let response = await firstValueFrom(this.userService.signup(data));
        console.log(response.status);
        if (response.status == 201) {
          alert('User created ');
          this.router.navigateByUrl('/login');
        }

      } catch (error: unknown) {
        console.log((error as any).error);
        alert((error as any).error.message || 'Unknown error');
        if ((error as any).status == 409) {
          this.router.navigateByUrl('/login');
        }
      }
    } else {
      this.err = true;
    }
  }
  checkPassword(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;
      if (!password || !confirmPassword) return null;
      const mismatch = password !== confirmPassword ? { passwordMissMatch: true } : null;
      group.get('confirmPassword')?.setErrors(mismatch);

      return mismatch;
    };
  }


}
