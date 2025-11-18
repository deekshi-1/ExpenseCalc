import { Component, OnInit, ViewChild, signal, AfterViewInit } from '@angular/core';
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
import { ImportCsv } from '../import-csv/import-csv';
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
    ImportCsv
  ],
  templateUrl: './add-expense.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './add-expense.css',
})
export class AddExpense implements AfterViewInit {
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

  ngAfterViewInit() {
    // Scroll to top when component is loaded
    // Use setTimeout to ensure DOM is fully rendered
    setTimeout(() => {
      this.scrollToTop();
    }, 0);
  }

  private scrollToTop() {
    // Try scrolling the window first
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Also try scrolling any parent containers that might be scrollable
    const scrollContainers = [
      document.querySelector('.main'),
      document.querySelector('mat-sidenav-content'),
      document.documentElement,
      document.body
    ];
    
    scrollContainers.forEach(container => {
      if (container && container instanceof Element) {
        try {
          container.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (e) {
          // Fallback for browsers that don't support scrollTo on all elements
          if (container instanceof HTMLElement) {
            container.scrollTop = 0;
          }
        }
      }
    });
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
        // Scroll to top after loading expense data
        setTimeout(() => {
          this.scrollToTop();
        }, 100);
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
      expenseCategory: categoryName.toLowerCase(),
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

  openCsvImportDialog() {
    const dialogRef = this.dialog.open(ImportCsv, { autoFocus: false, width: '70vw', maxWidth: '900px' });
    dialogRef.afterClosed().subscribe((result) => {
      // Optionally refresh data or show success message
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
            expenseCategory: this.expenseForm.get('expenseCategory')?.value.toLowerCase(),
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
