import { Component, OnInit } from '@angular/core';
import { BookingService } from '../services/booking.service';

@Component({
  selector: 'app-my-bookings',
  template: `
    <h2>My Bookings</h2>
    <div *ngFor="let b of bookings" style="margin-top:12px">
      <mat-card>
        <div>Booking ID: {{b.id}}</div>
        <div>Event: {{b.event_name}}</div>
        <div>Tickets: {{b.tickets_booked}}</div>
        <div>Total: {{b.total_price | currency:'INR':'symbol-narrow'}}</div>
        <div><img *ngIf="b.qr" [src]="b.qr" alt="QR" style="max-width:150px"/></div>
      </mat-card>
    </div>
  `
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];
  constructor(private bookingService: BookingService) { }
  ngOnInit() { this.bookingService.getMyBookings().subscribe(b => this.bookings = b); }
}
