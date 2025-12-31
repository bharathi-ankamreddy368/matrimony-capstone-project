import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  template: `
    <h2>Login</h2>
    <form [formGroup]="form" (ngSubmit)="login()">
      <mat-form-field appearance="fill" style="display:block">
        <mat-label>Username</mat-label>
        <input matInput formControlName="username" />
      </mat-form-field>

      <mat-form-field appearance="fill" style="display:block">
        <mat-label>Password</mat-label>
        <input matInput type="password" formControlName="password" />
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Login</button>
      <button mat-button type="button" (click)="goRegister()">Register</button>
    </form>
  `
})
export class LoginComponent {
  form = this.fb.group({ username: ['', Validators.required], password: ['', Validators.required] });

  constructor(private auth: AuthService, private router: Router, private fb: FormBuilder, private snack: MatSnackBar) { }

  login() {
    if (this.form.invalid) return;
    const { username, password } = this.form.value;
    this.auth.login({ username, password }).subscribe({
      next: () => this.router.navigate(['/events']),
      error: err => this.snack.open(err.error?.error || 'Login failed', 'OK', { duration: 3000 })
    });
  }

  goRegister() { this.router.navigate(['/register']); }
}
