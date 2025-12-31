import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';

@Component({
    selector: 'app-event-list',
    templateUrl: './event-list.component.html',
    styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
    events: Event[] = [];
    filteredEvents: Event[] = [];
    searchTerm: string = '';
    venueFilter: string = '';
    dateFilter: string = '';

    constructor(private eventService: EventService) { }

    ngOnInit(): void {
        this.retrieveEvents();
    }

    retrieveEvents(): void {
        this.eventService.getAll().subscribe({
            next: (data) => {
                this.events = data;
                this.filteredEvents = data;
            },
            error: (e) => console.error(e)
        });
    }

    filterEvents(): void {
        this.filteredEvents = this.events.filter(event => {
            const matchName = !this.searchTerm ||
                event.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                event.category.toLowerCase().includes(this.searchTerm.toLowerCase());

            const matchVenue = !this.venueFilter ||
                event.venue.toLowerCase().includes(this.venueFilter.toLowerCase());

            const matchDate = !this.dateFilter ||
                new Date(event.date_time).toDateString() === new Date(this.dateFilter).toDateString();

            return matchName && matchVenue && matchDate;
        });
    }
}
