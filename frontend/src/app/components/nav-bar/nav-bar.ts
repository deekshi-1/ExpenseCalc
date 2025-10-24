import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDialog } from '@angular/material/dialog';
import { Profile } from '../profile/profile';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-nav-bar',
  imports: [MatToolbarModule, MatSidenavModule, MatListModule, MatButtonModule, MatIconModule,RouterLink],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar {
  constructor(private dialog: MatDialog) { }

  isMenuOpen = false;

  // This function toggles the state
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  openDialog() {
    const dialogRef = this.dialog.open(Profile);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
