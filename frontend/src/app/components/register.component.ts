import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
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
      next: () => this.router.navigate(['/login']),
      error: err => this.snack.open(err.error?.error || 'Registration failed', 'OK', { duration: 3000 })
    });
  }
}
