import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventsService } from '../services/events.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  event: any;
  apiUrl = (window as any).__env?.apiUrl || 'http://localhost:3000';
  constructor(private route: ActivatedRoute, private events: EventsService, private loc: Location) { }
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
