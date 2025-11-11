import { Component, ViewChild, signal } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddCategory } from '../add-category/add-category';
import { CategoryService } from '../../services/category/category-service';
import { firstValueFrom } from 'rxjs';
import { ExpenseService } from '../../services/expense/expense-service';

@Component({
  selector: 'app-add-expense',
  imports: [
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './add-expense.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './add-expense.css',
})
export class AddExpense {
  err: boolean = false;
  category = signal<Category[]>([]);
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;

  private readonly _currentYear = new Date();
  readonly minDate = new Date(this._currentYear.getFullYear() - 2, 0, 1);
  readonly maxDate = new Date(
    this._currentYear.getFullYear(),
    this._currentYear.getMonth() + 3,
    this._currentYear.getDate()
  );

  expenseForm: FormGroup = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    amount: new FormControl('', [Validators.required, Validators.min(1)]),
    expenseCategory: new FormControl('', [Validators.required]),
    paymentType: new FormControl('cash', [Validators.required]),
    date: new FormControl('', [Validators.required]),
    comment: new FormControl('', [Validators.maxLength(200)]),
  });

  expenseId: string | null = null;
  private expenseData: any = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private catagoryService: CategoryService,
    private expenseService: ExpenseService
  ) {
    this.initializeComponent();
  }

  async initializeComponent() {
    // Load categories first, then check for expense ID
    await this.getCategory();
    this.route.queryParams.subscribe(async (params) => {
      const id = params['id'];
      if (id) {
        this.expenseId = id;
        await this.loadExpenseData(id);
      }
    });
  }

  async loadExpenseData(id: string) {
    try {
      const response = await firstValueFrom(this.expenseService.getExpenseById(id));
      if (response.status === 200 && response.body?.expense) {
        this.expenseData = response.body.expense;
        // Ensure categories are loaded before populating form
        if (this.category().length > 0) {
          this.populateForm(this.expenseData);
        } else {
          // Wait for categories if not loaded yet
          await this.getCategory();
          this.populateForm(this.expenseData);
        }
      }
    } catch (error) {
      console.error('Error loading expense:', error);
    }
  }

  populateForm(expense: any) {
    // Convert date string to Date object if needed
    let expenseDate: Date | string = '';
    if (expense.date) {
      expenseDate = new Date(expense.date);
      // Validate the date
      if (isNaN(expenseDate.getTime())) {
        expenseDate = '';
      }
    }

    // Get category name from populated category object or use the name directly
    const categoryName = expense.category?.name || expense.expenseCategory || '';

    this.expenseForm.patchValue({
      name: expense.name || '',
      amount: expense.amount || '',
      expenseCategory: categoryName,
      paymentType: expense.paymentType || 'cash',
      date: expenseDate,
      comment: expense.comment || '',
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddCategory, { autoFocus: false, width: '50vw' });
    dialogRef.afterClosed().subscribe((result) => {
      this.getCategory();
    });
  }

  async getCategory() {
    let response = await firstValueFrom(this.catagoryService.getCategory());
    this.category.set(response.body ?? []);
  }

  async submit() {
    if (this.expenseForm.invalid) {
      this.expenseForm.markAllAsTouched();
    } else {
      console.log(this.expenseForm.valid);

      if (this.expenseForm.valid) {
        try {
          const data = {
            name: this.expenseForm.get('name')?.value,
            amount: this.expenseForm.get('amount')?.value,
            expenseCategory: this.expenseForm.get('expenseCategory')?.value,
            paymentType: this.expenseForm.get('paymentType')?.value,
            date: this.expenseForm.get('date')?.value,
            comment: this.expenseForm.get('comment')?.value,
          };
          if (this.expenseId) {
            const response = await firstValueFrom(this.expenseService.updateExpense(this.expenseId, data));
            if (response.status === 200) {
              this.router.navigate(['/']); // navigate away on successful update
            }
          } else {
            const response = await firstValueFrom(this.expenseService.addExpense(data));
            if (response.status === 201) {
              const currentPaymentType = this.expenseForm.get('paymentType')?.value;
              this.formDirective?.resetForm({
                paymentType: currentPaymentType,
              });
            }
          }
        } catch (error) {
          console.error('Error during registration:', error);
          alert('Something went wrong during registration');
        }
      } else {
        this.err = true;
      }
    }
  }

  async deleteExpense() {
    if (!this.expenseId) return;
    try {
      const response = await firstValueFrom(this.expenseService.deleteExpense(this.expenseId));
      if (response.status === 200) {
        this.router.navigate(['/']);
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Something went wrong during delete');
    }
  }

  resetForm() {
    const currentPaymentType = this.expenseForm.get('paymentType')?.value;

    this.formDirective?.resetForm({
      paymentType: currentPaymentType,
    });
    if (this.expenseId) {
      this.expenseId = null;
      this.router.navigate(['ExpenseCalc/add-expense'])
    }
    this.expenseForm.markAsPristine();
    this.expenseForm.markAsUntouched();
    this.err = false;
  }
}

interface Category {
  _id: number;
  name: string;
}
