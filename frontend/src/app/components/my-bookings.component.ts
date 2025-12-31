import { Component, OnInit } from '@angular/core';
import { BookingsService } from '../services/bookings.service';

@Component({
  selector: 'app-my-bookings',
  template: `
    <h2>My Bookings</h2>
    <div *ngFor="let b of bookings" style="margin-top:12px">
      <mat-card>
        <div>Booking ID: {{b.id}}</div>
        <div>Event ID: {{b.event_id}}</div>
        <div>Tickets: {{b.tickets_booked}}</div>
        <div>Total: {{b.total_price | currency}}</div>
        <div><img *ngIf="b.qr" [src]="b.qr" alt="QR" style="max-width:150px"/></div>
      </mat-card>
    </div>
  `
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];
  constructor(private bookingsService: BookingsService) {}
  ngOnInit() { this.bookingsService.getMyBookings().subscribe(b => this.bookings = b); }
}
