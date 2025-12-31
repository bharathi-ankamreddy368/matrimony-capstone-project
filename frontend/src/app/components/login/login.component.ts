import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    isLoginMode = true;
    username = '';
    password = '';

    constructor(private authService: AuthService, private snackBar: MatSnackBar) { }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit() {
        if (!this.username || !this.password) return;

        const authObs = this.isLoginMode
            ? this.authService.login({ username: this.username, password: this.password })
            : this.authService.register({ username: this.username, password: this.password, role: 'attendee' }); // Default to attendee for register

        authObs.subscribe({
            next: (res) => {
                if (this.isLoginMode) {
                    this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
                } else {
                    this.snackBar.open('Registration successful! Please login.', 'Close', { duration: 3000 });
                    this.isLoginMode = true; // Switch to login after register
                }
            },
            error: (e) => {
                console.error(e);
                this.snackBar.open(e.error.message || 'An error occurred', 'Close', { duration: 3000 });
            }
        });
    }

    // Quick demo login helpers
    loginAsOrganizer() {
        // In real app, you shouldn't have this, but for demo continuity:
        this.authService.login({ username: 'admin', password: 'admin123' }).subscribe({
            error: () => {
                // If fail, try register then login
                this.authService.register({ username: 'admin', password: 'admin123', role: 'organizer' }).subscribe(() => {
                    this.authService.login({ username: 'admin', password: 'admin123' }).subscribe();
                });
            }
        });
    }
}
