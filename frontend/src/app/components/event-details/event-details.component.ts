import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from '../../models/event.model';

@Component({
    selector: 'app-event-details',
    templateUrl: './event-details.component.html',
    styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
    currentEvent: Event = {
        name: '',
        description: '',
        venue: '',
        date_time: '',
        category: '',
        capacity: 0
    };
    message = '';

    constructor(
        private eventService: EventService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.message = '';
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

    bookTicket(): void {
        this.router.navigate(['/events', this.currentEvent.id, 'book']);
    }
}
