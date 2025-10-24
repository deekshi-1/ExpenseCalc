import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddCategory } from '../add-category/add-category';


@Component({
  selector: 'app-add-expense',
  imports: [MatIconModule, MatCardModule, MatButtonModule, MatSelectModule, MatDatepickerModule, MatDialogModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, RouterLink],
  templateUrl: './add-expense.html', providers: [provideNativeDateAdapter()],
  styleUrl: './add-expense.css'
})
export class AddExpense {
  err: boolean = false;

  private readonly _currentYear = new Date();
  readonly minDate = new Date(this._currentYear.getFullYear() - 2, 0, 1);
  readonly maxDate = new Date(this._currentYear.getFullYear(),
    this._currentYear.getMonth() + 3,
    this._currentYear.getDate());


  signUpForm: FormGroup = new FormGroup({
    expenseName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
    ]),
    expenseAmount: new FormControl('', [
      Validators.required,
      Validators.min(1)
    ]),
    expenseCategory: new FormControl('', [
      Validators.required
    ]),
    paymentType: new FormControl('', [
      Validators.required
    ]),
    date: new FormControl('', [
      Validators.required
    ]),
    comment: new FormControl('', [
      Validators.maxLength(200)
    ])
  });

  constructor(private router: Router, private dialog: MatDialog) { }

  openDialog() {
    const dialogRef = this.dialog.open(AddCategory);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }



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
}