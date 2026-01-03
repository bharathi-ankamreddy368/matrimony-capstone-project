import { Component, OnInit } from '@angular/core';
import { EventsService } from '../services/events.service';
import { BookingsService } from '../services/bookings.service';
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

  constructor(private eventsService: EventsService, private bookings: BookingsService, private snack: MatSnackBar, private router: Router) { }
  ngOnInit() { this.load(); }
  create() { this.router.navigate(['/organizer/events/create']); }
  edit(id: number) { this.router.navigate([`/organizer/events/${id}/edit`]); }
  load() {
    this.eventsService.getOrganizerEvents().subscribe((e: any[]) => {
      this.events = e;
      this.events.forEach((ev: any) => {
        this.bookings.listBookingsForEvent(ev.id).subscribe((bk: any[]) => ev.tickets_sold = bk.reduce((s, b) => s + b.tickets_booked, 0), () => ev.tickets_sold = 0);
      });
    });
  }
  loadAttendees(eventId: number) { this.bookings.listBookingsForEvent(eventId).subscribe(b => this.attendees[eventId] = b); }
  cancel(id: number) {
    if (!confirm('Cancel this event?')) return;
    this.eventsService.cancelEvent(id).subscribe(() => { this.snack.open('Event cancelled', 'OK', { duration: 2000 }); this.load(); }, err => this.snack.open(err.error?.error || 'Cancel failed', 'OK', { duration: 3000 }));
  }
  exportCsv(eventId: number, eventName: string) {
    this.bookings.listBookingsForEvent(eventId).subscribe(bk => {
      const csv = createCsv(bk, ['id', 'attendee_id', 'tickets_booked', 'total_price', 'booking_time']);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${eventName.replace(/\s+/g, '_')}_bookings.csv`);
    }, () => alert('Failed to download attendees'));
  }
}
