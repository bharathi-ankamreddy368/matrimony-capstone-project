import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingsService } from '../services/bookings.service';

@Component({
  selector: 'app-booking-confirmation',
  template: `
    <div *ngIf="booking">
      <h2>Booking Confirmed</h2>
      <div>Booking ID: {{booking.id}}</div>
      <div>Event ID: {{booking.event_id}}</div>
      <div>Tickets: {{booking.tickets_booked}}</div>
      <div>Total: {{booking.total_price | currency}}</div>
      <div *ngIf="booking.qr" style="margin-top:8px">
        <img [src]="booking.qr" alt="QR Code" style="max-width:200px;display:block" />
        <button mat-raised-button color="primary" (click)="downloadQr()">Download QR</button>
      </div>
      <button mat-raised-button color="accent" (click)="printConfirmation()" style="margin-top:8px">
        Print Confirmation
      </button>
    </div>
  `
})
export class BookingConfirmationComponent implements OnInit {
  booking: any;
  constructor(private route: ActivatedRoute, private bookings: BookingsService) {}
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.bookings.getBooking(id).subscribe(b => this.booking = b);
  }
  downloadQr() {
    if (!this.booking?.qr) return;
    const a = document.createElement('a');
    a.href = this.booking.qr;
    a.download = `booking-${this.booking.id}-qr.png`;
    a.click();
  }

  printConfirmation() {
    window.print();
  }
}
