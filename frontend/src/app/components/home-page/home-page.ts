import { Component } from '@angular/core';
import { Dashboard } from "../dashboard/dashboard";
import { NavBar } from "../nav-bar/nav-bar";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [Dashboard, NavBar, RouterOutlet],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage {

}
