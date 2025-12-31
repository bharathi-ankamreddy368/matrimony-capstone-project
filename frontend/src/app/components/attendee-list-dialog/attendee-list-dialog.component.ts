import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BookingService } from '../../services/booking.service';

@Component({
    selector: 'app-attendee-list-dialog',
    templateUrl: './attendee-list-dialog.component.html',
    styleUrls: ['./attendee-list-dialog.component.scss']
})
export class AttendeeListDialogComponent implements OnInit {
    attendees: any[] = [];
    displayedColumns: string[] = ['id', 'tickets', 'time'];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { eventId: number, eventName: string },
        private bookingService: BookingService
    ) { }

    ngOnInit(): void {
        this.bookingService.getBookingsByEvent(this.data.eventId).subscribe({
            next: (res) => {
                this.attendees = res;
            },
            error: (e) => console.error(e)
        });
    }
}
