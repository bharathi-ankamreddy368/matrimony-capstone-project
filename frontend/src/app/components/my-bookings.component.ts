import { Component, OnInit } from '@angular/core';
import { BookingService } from '../services/booking.service';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss']
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];
  constructor(private bookingService: BookingService) { }
  ngOnInit() { this.bookingService.getMyBookings().subscribe(b => this.bookings = b); }
}
