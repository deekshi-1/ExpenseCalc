import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card'
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class Signup {
  err: boolean = false;
  signUpForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)]),
    confirmPassword: new FormControl('', Validators.required),
  }, { validators: this.checkPassword(), });

  constructor(private router: Router) { }

  async submit() {
    // if (this.signUpForm.valid) {
    //   try {
    //     const email = this.signUpForm.get('email')?.value;

    //     const user = await firstValueFrom(this.userService.checkUser(email));

    //     if (true) {
    //       alert("Account already exists");
    //       return;
    //     }

    //     const accNo = await this.geneAccNo();

    //     const data = {
    //       firstName: this.signUpForm.get('firstName')?.value,
    //       lastName: this.signUpForm.get('lastName')?.value,
    //       email: this.signUpForm.get('email')?.value,
    //       phone: this.signUpForm.get('phone')?.value,
    //       password: this.signUpForm.get('password')?.value,
    //       accNo: accNo,
    //       balance: 0
    //     };

    //     await firstValueFrom(dd);
    //     alert('Registration successful');
    //     this.router.navigate(['login']);

    //   } catch (error) {
    //     console.error('Error during registration:', error);
    //     alert('Something went wrong during registration');
    //   }
    // } else {
    //   this.err = true;
    // }
  }
  checkPassword(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;

      if (!password || !confirmPassword) return null;

      return password === confirmPassword ? null : { passwordMissMatch: true };
    };
  }


}
