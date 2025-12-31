import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  template: `
    <h2>Register</h2>
    <form [formGroup]="form" (ngSubmit)="register()">
      <mat-form-field appearance="fill" style="display:block">
        <mat-label>Username</mat-label>
        <input matInput formControlName="username" />
      </mat-form-field>

      <mat-form-field appearance="fill" style="display:block">
        <mat-label>Password</mat-label>
        <input matInput type="password" formControlName="password" />
        <mat-error *ngIf="form.controls.password.touched && form.controls.password.invalid">Password min 6 chars</mat-error>
      </mat-form-field>

      <mat-form-field appearance="fill" style="display:block">
        <mat-label>Role</mat-label>
        <mat-select formControlName="role">
          <mat-option value="attendee">Attendee</mat-option>
          <mat-option value="organizer">Organizer</mat-option>
        </mat-select>
      </mat-form-field>

      <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Register</button>
    </form>
  `
})
export class RegisterComponent {
  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['attendee', Validators.required]
  });

  constructor(private auth: AuthService, private router: Router, private fb: FormBuilder, private snack: MatSnackBar) { }

  register() {
    if (this.form.invalid) return;
    const { username, password, role } = this.form.value;
    this.auth.register({ username, password, role }).subscribe({
      next: () => this.router.navigate(['/events']),
      error: err => this.snack.open(err.error?.error || 'Registration failed', 'OK', { duration: 3000 })
    });
  }
}
