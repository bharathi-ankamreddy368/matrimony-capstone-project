import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  constructor(private http: HttpClient) {}
  createBooking(payload: any) { return this.http.post<any>(`${environment.apiUrl}/bookings`, payload); }
  getBooking(id: number) { return this.http.get<any>(`${environment.apiUrl}/bookings/${id}`); }
  listBookingsForEvent(eventId: number) { return this.http.get<any[]>(`${environment.apiUrl}/bookings/event/${eventId}`); }
  getMyBookings() { return this.http.get<any[]>(`${environment.apiUrl}/bookings/me`); }
}
