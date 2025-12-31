import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { BookingService } from '../../services/booking.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from '../../models/event.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-ticket-booking',
    templateUrl: './ticket-booking.component.html',
    styleUrls: ['./ticket-booking.component.scss']
})
export class TicketBookingComponent implements OnInit {
    currentEvent: Event = { name: '', description: '', venue: '', date_time: '', category: '', capacity: 0 };
    ticketsToBook: number = 1;

    constructor(
        private eventService: EventService,
        private bookingService: BookingService,
        private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.getEvent(this.route.snapshot.params['id']);
    }

    getEvent(id: string): void {
        this.eventService.get(id)
            .subscribe({
                next: (data) => {
                    this.currentEvent = data;
                },
                error: (e) => console.error(e)
            });
    }

    confirmBooking(): void {
        const data = {
            event_id: this.currentEvent.id,
            tickets_booked: this.ticketsToBook
        };

        this.bookingService.create(data).subscribe({
            next: (res) => {
                this.snackBar.open('Booking confirmed!', 'Close', { duration: 3000 });
                this.router.navigate(['/booking', res.id]);
            },
            error: (e) => {
                console.error(e);
                this.snackBar.open(e.error.message || 'Error booking tickets', 'Close', { duration: 3000 });
            }
        });
    }
}
