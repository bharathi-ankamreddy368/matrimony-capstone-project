import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingsService } from '../services/bookings.service';
import { EventsService } from '../services/events.service';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ticket-booking',
  templateUrl: './ticket-booking.component.html',
  styleUrls: ['./ticket-booking.component.scss']
})
export class TicketBookingComponent implements OnInit {
  form = this.fb.group({ tickets: [1, [Validators.required, Validators.min(1)]] });
  event: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private bookings: BookingsService,
    private events: EventsService,
    private router: Router,
    private snack: MatSnackBar
  ) { }

  ngOnInit() {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.events.getEvent(eventId).subscribe(e => this.event = e);
  }

  total() {
    return (this.event?.ticket_price || 0) * (this.form.value.tickets || 0);
  }

  get t(): FormControl {
    return this.form.get('tickets') as FormControl;
  }

  book() {
    const tickets = this.form.value.tickets || 0;
    if (tickets <= 0) {
      this.snack.open('Tickets must be > 0', 'OK', { duration: 3000 });
      return;
    }
    if (tickets > this.event.available_seats) {
      this.snack.open('Not enough seats available', 'OK', { duration: 3000 });
      return;
    }
    if (!confirm(`Confirm booking ${tickets} ticket(s) for ${this.event.name} — Total ${this.total().toFixed(2)}?`)) return;

    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.bookings.createBooking({ event_id: eventId, tickets_booked: tickets, total_price: this.total() }).subscribe({
      next: (b: any) => {
        this.snack.open('Booking successful', 'OK', { duration: 2000 });
        this.router.navigate(['/booking', b.id]);
      },
      error: (err: any) => {
        this.snack.open(err.error?.error || 'Booking failed', 'OK', { duration: 3000 });
      }
    });
  }
  cancel() {
    this.router.navigate(['/events', this.event?.id]);
  }
}
