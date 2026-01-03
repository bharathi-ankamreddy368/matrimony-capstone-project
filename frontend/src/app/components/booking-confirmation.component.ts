import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookingsService } from '../services/bookings.service';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.scss']
})
export class BookingConfirmationComponent implements OnInit {
  booking: any;
  constructor(private route: ActivatedRoute, private bookings: BookingsService) { }
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
