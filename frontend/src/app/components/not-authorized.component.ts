import { Component } from '@angular/core';
@Component({
    selector: 'app-not-authorized',
    template: `
    <div style="height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 1.5rem;">
      <mat-icon style="font-size: 80px; width: 80px; height: 80px; color: var(--warn-color); opacity: 0.5;">lock</mat-icon>
      <h1 style="font-size: 3rem; font-weight: 800; margin: 0;">Access Denied</h1>
      <p style="font-size: 1.2rem; color: var(--text-secondary); max-width: 400px; margin: 0;">You don't have the necessary permissions to access this page. Please contact your administrator if you think this is a mistake.</p>
      <button mat-raised-button color="primary" routerLink="/events" style="height: 52px; border-radius:30px; padding: 0 32px; font-weight:700;">Back to Home</button>
    </div>
  `
})
export class NotAuthorizedComponent { }
