import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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
