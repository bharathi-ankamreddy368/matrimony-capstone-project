import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { BookingService } from '../services/booking.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { createCsv } from '../utils/csv';

@Component({
  selector: 'app-organizer-dashboard',
  templateUrl: './organizer-dashboard.component.html',
  styleUrls: ['./organizer-dashboard.component.scss']
})
export class OrganizerDashboardComponent implements OnInit {
  events: any[] = []; attendees: any = {};

  constructor(private eventService: EventService, private bookingService: BookingService, private snack: MatSnackBar, private router: Router) { }
  ngOnInit() { this.load(); }
  create() { this.router.navigate(['/organizer/events/create']); }
  edit(id: number) { this.router.navigate([`/organizer/events/${id}/edit`]); }
  load() {
    this.eventService.getOrganizerEvents().subscribe((e: any[]) => {
      this.events = e;
      this.events.forEach((ev: any) => {
        this.bookingService.getBookingsByEvent(ev.id).subscribe((bk: any[]) => ev.tickets_sold = bk.reduce((s, b) => s + b.tickets_booked, 0), () => ev.tickets_sold = 0);
      });
    });
  }
  loadAttendees(eventId: number) { this.bookingService.getBookingsByEvent(eventId).subscribe(b => this.attendees[eventId] = b); }
  cancel(id: number) {
    if (!confirm('Cancel this event?')) return;
    this.eventService.cancelEvent(id).subscribe(() => { this.snack.open('Event cancelled', 'OK', { duration: 2000 }); this.load(); }, (err: any) => this.snack.open(err.error?.error || 'Cancel failed', 'OK', { duration: 3000 }));
  }
  exportCsv(eventId: number, eventName: string) {
    this.bookingService.getBookingsByEvent(eventId).subscribe(bk => {
      const csv = createCsv(bk, ['id', 'attendee_id', 'tickets_booked', 'total_price', 'booking_time']);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${eventName.replace(/\s+/g, '_')}_bookings.csv`);
    }, () => alert('Failed to download attendees'));
  }
}
