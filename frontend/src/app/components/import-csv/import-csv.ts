import { Component, signal, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';;
import { ExpenseService } from '../../services/expense/expense-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-import-csv',
  imports: [MatCardModule, MatIcon, MatButtonModule],
  templateUrl: './import-csv.html',
  styleUrl: './import-csv.css'
})
export class ImportCsv {
  currentStep = signal<1 | 2 | 3>(1);

  constructor(
    private expenseService: ExpenseService,
  ) {}

  async uploadCSV() {
    try {
      // Create file input element
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.csv';
      
      input.onchange = async (event: any) => {
        const file = event.target.files[0];
        if (!file) return;

        // Move to step 2 (Review)
        this.currentStep.set(2);

        try {
          // Read file content
          const text = await file.text();
          
          // Parse CSV
          const lines = text.split('\n').filter((line: string) => line.trim());
          if (lines.length < 2) {
            alert('CSV file must contain at least a header and one data row');
            this.currentStep.set(1);
            return;
          }

          // Skip header row and parse data rows
          const expenses = [];
          const errors: string[] = [];

          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Parse CSV line (handle quoted values)
            const values = this.parseCSVLine(line);
            
            if (values.length < 5) {
              errors.push(`Row ${i + 1}: Insufficient columns (expected at least 5)`);
              continue;
            }

            const [name, amount, expenseDate, expenseCategory, paymentType, comment] = values;

            // Validate required fields
            if (!name || !amount || !expenseDate || !expenseCategory || !paymentType) {
              errors.push(`Row ${i + 1}: Missing required fields`);
              continue;
            }

            // Validate payment type
            const validPaymentTypes = ['Card', 'UPI', 'Cash', 'card', 'upi', 'cash'];
            if (!validPaymentTypes.includes(paymentType.trim())) {
              errors.push(`Row ${i + 1}: Invalid payment type (must be Card, UPI, or Cash)`);
              continue;
            }

            // Parse date (dd/mm/yyyy format)
            const dateParts = expenseDate.trim().split('/');
            if (dateParts.length !== 3) {
              errors.push(`Row ${i + 1}: Invalid date format (expected dd/mm/yyyy)`);
              continue;
            }

            const day = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
            const year = parseInt(dateParts[2], 10);
            const date = new Date(year, month, day);

            if (isNaN(date.getTime())) {
              errors.push(`Row ${i + 1}: Invalid date`);
              continue;
            }

            // Parse amount
            const parsedAmount = parseFloat(amount.trim());
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
              errors.push(`Row ${i + 1}: Invalid amount`);
              continue;
            }

            expenses.push({
              name: name.trim(),
              amount: parsedAmount,
              expenseCategory: expenseCategory.trim().toLowerCase(),
              paymentType: paymentType.trim().toLowerCase(),
              date: date.toISOString(),
              comment: comment ? comment.trim() : ''
            });
          }

          // Show errors if any
          if (errors.length > 0) {
            alert(`Errors found:\n${errors.join('\n')}\n\nOnly valid rows will be uploaded.`);
          }

          if (expenses.length === 0) {
            alert('No valid expenses found in CSV file');
            this.currentStep.set(1);
            return;
          }

          // Move to step 3 (Done) - Upload expenses
          this.currentStep.set(3);

          // Upload each expense
          let successCount = 0;
          let failCount = 0;

          console.log("end",expenses);
          
          for (const expense of expenses) {
            try {
              const response = await firstValueFrom(this.expenseService.addExpense(expense));
              if (response.status === 201) {
                successCount++;
              } else {
                failCount++;
              }
            } catch (error) {
              console.error('Error uploading expense:', error);
              failCount++;
            }
          }

        } catch (error) {
          console.error('Error processing CSV:', error);
          alert('Error processing CSV file. Please check the format and try again.');
          this.currentStep.set(1);
        }
      };

      input.click();
    } catch (error) {
      console.error(error);
      alert('Error opening file dialog');
    }
  }

  private parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    values.push(current);
    return values;
  }

  downloadSampleFile() {
    const sampleData = [
      ['Name', 'Amount', 'Expense Date', 'Expense Category', 'Payment Type', 'Comment'],
      ['Lunch', '500', '15/01/2024', 'food', 'Card', 'Office lunch'],
      ['Taxi', '200', '16/01/2024', 'transport', 'Cash', 'Airport ride'],
      ['Groceries', '1500', '17/01/2024', 'food', 'UPI', 'Weekly shopping'],
    ];
    const csvContent = sampleData.map(e => e.join(',')).join('\n');

    // Create a blob
    const blob = new Blob([csvContent], { type: 'text/csv' });

    // Create temporary link element
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample-expense.csv';
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
  }
}