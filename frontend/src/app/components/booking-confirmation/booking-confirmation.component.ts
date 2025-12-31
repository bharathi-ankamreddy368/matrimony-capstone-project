import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { ActivatedRoute } from '@angular/router';
import { Booking } from '../../models/booking.model';

@Component({
    selector: 'app-booking-confirmation',
    templateUrl: './booking-confirmation.component.html',
    styleUrls: ['./booking-confirmation.component.scss']
})
export class BookingConfirmationComponent implements OnInit {
    booking: any; // Using any to handle joined data casually
    qrData: string = '';

    constructor(
        private bookingService: BookingService,
        private route: ActivatedRoute
    ) { }

    isDataUrl(): boolean {
        return this.qrData && this.qrData.startsWith && this.qrData.startsWith('data:image');
    }

    ngOnInit(): void {
        const id = this.route.snapshot.params['id'];
        this.bookingService.getById(id).subscribe({
            next: (data) => {
                this.booking = data;
                // Prefer backend-provided QR if available
                this.qrData = this.booking.qr_data || JSON.stringify({
                    bookingId: this.booking.id,
                    event: this.booking.name,
                    tickets: this.booking.tickets_booked
                });
            },
            error: (e) => console.error(e)
        });
    }
}
