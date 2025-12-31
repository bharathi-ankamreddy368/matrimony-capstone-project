import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary">
      <span>Smart Event Planner</span>
      <span style="flex:1 1 auto"></span>
      <a mat-button routerLink="/events">Events</a>
      <a mat-button routerLink="/organizer/dashboard">Organizer</a>
      <a mat-button routerLink="/my-bookings" *ngIf="auth.getRole()==='attendee'">My Bookings</a>
      <a mat-button routerLink="/admin" *ngIf="auth.getRole()==='admin'">Admin</a>
      <span *ngIf="auth.isAuthenticated()" style="margin-left:8px">Role: {{auth.getRole()}}</span>
      <button mat-button *ngIf="auth.isAuthenticated()" (click)="logout()">Logout</button>
      <a mat-button routerLink="/login" *ngIf="!auth.isAuthenticated()">Login</a>
    </mat-toolbar>
    <div class="container"><router-outlet></router-outlet></div>
  `
})
export class AppComponent {
  constructor(public auth: AuthService, private router: Router) { }
  logout() { this.auth.logout(); this.router.navigate(['/events']); }
}
