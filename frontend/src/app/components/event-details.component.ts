import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../services/events.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-event-details',
  template: `
    <div *ngIf="event">
      <mat-card>
        <div style="display:flex;gap:12px;align-items:flex-start">
          <img *ngIf="event.image_url" [src]="apiUrl + event.image_url" alt="event image" style="width:320px;height:200px;object-fit:cover;border-radius:6px" />
          <div style="flex:1">
            <h2>{{event.name}}</h2>
            <div style="color:rgba(0,0,0,0.7)">{{event.venue}} — {{event.date_time | date:'fullDate'}} {{event.date_time | date:'shortTime'}}</div>
            <div style="margin-top:8px"><strong>Category:</strong> {{event.category || '—'}}</div>
            <div style="margin-top:8px"><strong>Price:</strong> {{event.ticket_price | currency}} • <strong>Capacity:</strong> {{event.capacity}} • <strong>Available:</strong> {{event.available_seats}}</div>
            <p style="margin-top:12px">{{event.description}}</p>
            <div style="display:flex;gap:8px;margin-top:12px">
              <button mat-raised-button color="primary" [routerLink]="['/events', event.id, 'book']" [disabled]="event.available_seats <= 0">Book Tickets</button>
              <button mat-stroked-button (click)="shareEmail()">Share via Email</button>
              <button mat-stroked-button (click)="goBack()">Back</button>
            </div>
          </div>
        </div>
      </mat-card>
    </div>
  `
})
export class EventDetailsComponent implements OnInit {
  event: any;
  apiUrl = (window as any).__env?.apiUrl || 'http://localhost:3000';
  constructor(private route: ActivatedRoute, private events: EventsService, private loc: Location) {}
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.events.getEvent(id).subscribe(e => this.event = e);
  }
  shareEmail() {
    const subject = encodeURIComponent(`Check out this event: ${this.event.name}`);
    const body = encodeURIComponent(`${this.event.name}\n\n${this.event.description}\n\n${window.location.origin}/events/${this.event.id}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }
  goBack() { this.loc.back(); }
}
