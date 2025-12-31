import { Component, OnInit } from '@angular/core';
import { EventsService } from '../services/events.service';
import { BookingsService } from '../services/bookings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { createCsv } from '../utils/csv';

@Component({
  selector: 'app-organizer-dashboard',
  template: `
    <h2>Organizer Dashboard</h2>
    <h3>Your Events</h3>
    <div *ngFor="let e of events" style="margin-top:10px">
      <mat-card>
        <div><strong>{{e.name}}</strong> — {{e.date_time}}</div>
        <div>Tickets sold: {{e.tickets_sold || 0}} — Revenue: {{ (e.tickets_sold * e.ticket_price) | currency }}</div>
        <button mat-button (click)="loadAttendees(e.id)">View Attendees</button>
        <button mat-button color="primary" (click)="edit(e.id)">Edit</button>
        <button mat-button color="warn" (click)="cancel(e.id)">Cancel</button>
        <button mat-button (click)="exportCsv(e.id, e.name)">Download CSV</button>
      </mat-card>
      <div *ngIf="attendees[e.id]">
        <h4>Attendees</h4>
        <div *ngFor="let a of attendees[e.id]">Booking #{{a.id}} — Tickets: {{a.tickets_booked}} — Attendee ID: {{a.attendee_id}}</div>
      </div>
    </div>
    <button mat-raised-button color="primary" (click)="create()">Create New Event</button>
  `
})
export class OrganizerDashboardComponent implements OnInit {
  events: any[] = []; attendees: any = {};

  constructor(private eventsService: EventsService, private bookings: BookingsService, private snack: MatSnackBar, private router: Router) {}
  ngOnInit() { this.load(); }
  create() { this.router.navigate(['/organizer/events/create']); }
  edit(id: number) { this.router.navigate([`/organizer/events/${id}/edit`]); }
  load() {
    this.eventsService.getOrganizerEvents().subscribe((e:any[]) => {
      this.events = e;
      this.events.forEach((ev:any) => {
        this.bookings.listBookingsForEvent(ev.id).subscribe((bk:any[]) => ev.tickets_sold = bk.reduce((s,b)=>s+b.tickets_booked,0), () => ev.tickets_sold = 0);
      });
    });
  }
  loadAttendees(eventId:number) { this.bookings.listBookingsForEvent(eventId).subscribe(b => this.attendees[eventId]=b); }
  cancel(id:number){
    if (!confirm('Cancel this event?')) return;
    this.eventsService.cancelEvent(id).subscribe(() => { this.snack.open('Event cancelled', 'OK', { duration: 2000 }); this.load(); }, err => this.snack.open(err.error?.error || 'Cancel failed', 'OK', { duration: 3000 }) );
  }
  exportCsv(eventId: number, eventName: string) {
    this.bookings.listBookingsForEvent(eventId).subscribe(bk => {
      const csv = createCsv(bk, ['id','attendee_id','tickets_booked','total_price','booking_time']);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${eventName.replace(/\s+/g,'_')}_bookings.csv`);
    }, () => alert('Failed to download attendees'));
  }
}
