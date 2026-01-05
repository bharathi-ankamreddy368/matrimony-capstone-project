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
  events: any[] = [];
  filteredEvents: any[] = [];
  attendees: any = {};
  stats = { totalEvents: 0, ticketsSold: 0, revenue: 0, upcomingEvents: 0 };
  activeTab = 'all';

  constructor(private eventService: EventService, private bookingService: BookingService, private snack: MatSnackBar, private router: Router) { }

  ngOnInit() { this.load(); }

  create() { this.router.navigate(['/organizer/events/create']); }
  edit(id: number) { this.router.navigate([`/organizer/events/${id}/edit`]); }

  load() {
    this.eventService.getOrganizerEvents().subscribe((e: any[]) => {
      this.events = e;
      this.calculateStats();
      this.filter('all');

      this.events.forEach((ev: any) => {
        this.bookingService.getBookingsByEvent(ev.id).subscribe((bk: any[]) => {
          ev.tickets_sold = bk.reduce((s, b) => s + b.tickets_booked, 0);
          this.calculateStats(); // Recalculate when bookings load
        }, () => ev.tickets_sold = 0);
      });
    });
  }

  calculateStats() {
    const now = new Date();
    this.stats = {
      totalEvents: this.events.length,
      ticketsSold: this.events.reduce((s, e) => s + (e.tickets_sold || 0), 0),
      revenue: this.events.reduce((s, e) => s + ((e.tickets_sold || 0) * e.ticket_price), 0),
      upcomingEvents: this.events.filter(e => new Date(e.date_time) > now && e.status !== 'cancelled').length
    };
  }

  filter(type: string) {
    this.activeTab = type;
    const now = new Date();
    if (type === 'all') this.filteredEvents = this.events;
    else if (type === 'upcoming') this.filteredEvents = this.events.filter(e => new Date(e.date_time) > now && e.status !== 'cancelled');
    else if (type === 'past') this.filteredEvents = this.events.filter(e => new Date(e.date_time) <= now && e.status !== 'cancelled');
    else if (type === 'cancelled') this.filteredEvents = this.events.filter(e => e.status === 'cancelled');
  }

  loadAttendees(eventId: number) {
    this.bookingService.getBookingsByEvent(eventId).subscribe(b => this.attendees[eventId] = b);
  }

  cancel(id: number) {
    if (!confirm('Cancel this event?')) return;
    this.eventService.cancelEvent(id).subscribe(() => {
      this.snack.open('Event cancelled', 'OK', { duration: 2000 });
      this.load();
    }, (err: any) => this.snack.open(err.error?.error || 'Cancel failed', 'OK', { duration: 3000 }));
  }

  exportCsv(eventId: number, eventName: string) {
    this.bookingService.getBookingsByEvent(eventId).subscribe(bk => {
      const csv = createCsv(bk, ['id', 'attendee_id', 'tickets_booked', 'total_price', 'booking_time']);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${eventName.replace(/\s+/g, '_')}_bookings.csv`);
    }, () => alert('Failed to download attendees'));
  }
}
