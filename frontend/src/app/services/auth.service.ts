import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private loggedIn = new BehaviorSubject<boolean>(false);
    private role = new BehaviorSubject<string>('guest'); // guest, attendee, organizer
    private apiUrl = 'http://localhost:3000/api/users';
    private currentUserId: number | null = null;
    private token: string | null = null;

    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }

    get currentRole() {
        return this.role.asObservable();
    }

    constructor(private router: Router, private http: HttpClient) {
        // Recover session from localStorage
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const id = localStorage.getItem('userId');
        if (token) {
            this.token = token;
            this.loggedIn.next(true);
        }
        if (role) {
            this.role.next(role);
        }
        if (id) {
            this.currentUserId = Number(id);
        }
    }

    login(credentials: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
            tap((res: any) => {
                this.token = res.token;
                localStorage.setItem('token', res.token);
                localStorage.setItem('role', res.role);
                localStorage.setItem('userId', String(res.id));

                this.loggedIn.next(true);
                this.role.next(res.role);
                this.currentUserId = res.id;

                if (res.role === 'organizer') {
                    this.router.navigate(['/organizer/dashboard']);
                } else {
                    this.router.navigate(['/events']);
                }
            })
        );
    }

    register(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, data);
    }

    logout() {
        this.token = null;
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
        this.loggedIn.next(false);
        this.role.next('guest');
        this.currentUserId = null;
        this.router.navigate(['/login']);
    }

    isAuthenticated(): boolean {
        return this.loggedIn.value || localStorage.getItem('token') !== null;
    }

    isOrganizer(): boolean {
        return (this.role.value === 'organizer') || (localStorage.getItem('role') === 'organizer');
    }

    getUserId(): number | null {
        return this.currentUserId;
    }

    getToken(): string | null {
        return this.token || localStorage.getItem('token');
    }

    getRole(): string {
        return this.role.value;
    }
}
