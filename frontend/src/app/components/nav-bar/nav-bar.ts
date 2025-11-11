import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { Profile } from '../profile/profile';
import { Router, RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-nav-bar',
  imports: [MatToolbarModule, MatSidenavModule, MatListModule, MatButtonModule, MatIconModule, RouterLink, RouterOutlet],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar {
  constructor(private dialog: MatDialog, private router: Router) { }

  isMenuOpen = signal(false);

  // This function toggles the state
  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
  }
  openDialog() {
    const dialogRef = this.dialog.open(Profile, { autoFocus: false });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  gotoAddExpense() {
    this.toggleMenu()
    this.router.navigate(['/ExpenseCalc/add-expense']);
  }
}
