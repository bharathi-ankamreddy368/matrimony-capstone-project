import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BookingService {
    private baseUrl = `${environment.apiUrl}/bookings`;

    constructor(private http: HttpClient) { }

    create(data: any): Observable<any> {
        return this.http.post(this.baseUrl, data);
    }

    getBookingsByEvent(eventId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/event/${eventId}`);
    }

    getById(id: any): Observable<Booking> {
        return this.http.get<Booking>(`${this.baseUrl}/${id}`);
    }

    // From duplicate BookingsService
    getMyBookings(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/me`);
    }
}
