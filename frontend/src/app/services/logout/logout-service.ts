import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user/user-service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  private timeoutId: any;
  private readonly INACTIVITY_LIMIT = 60 * 60 * 1000; // 1 hour

  constructor(
    private router: Router,
    private userService: UserService,
    private ngZone: NgZone
  ) {
    this.init();
  }

  init() {
    // Listen to events
    window.addEventListener('mousemove', () => this.resetTimer());
    window.addEventListener('keypress', () => this.resetTimer());
    window.addEventListener('click', () => this.resetTimer());
    window.addEventListener('touchstart', () => this.resetTimer());

    this.startTimer();
  }

  startTimer() {
    this.clearTimer();

    this.timeoutId = setTimeout(() => {
      this.logout();
    }, this.INACTIVITY_LIMIT);
  }

  resetTimer() {
    this.startTimer();
  }

  clearTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  logout() {
    this.userService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
