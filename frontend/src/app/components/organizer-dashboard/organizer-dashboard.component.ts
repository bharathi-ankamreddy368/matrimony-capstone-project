import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AttendeeListDialogComponent } from '../attendee-list-dialog/attendee-list-dialog.component';

@Component({
    selector: 'app-organizer-dashboard',
    templateUrl: './organizer-dashboard.component.html',
    styleUrls: ['./organizer-dashboard.component.scss']
})
export class OrganizerDashboardComponent implements OnInit {
    events: Event[] = [];
    newEvent: Event = {
        name: '',
        description: '',
        venue: '',
        date_time: '',
        category: '',
        capacity: 0
    };
    isEditMode = false;

    displayedColumns: string[] = ['name', 'date', 'venue', 'capacity', 'sold', 'actions'];

    viewAttendees(event: Event): void {
        this.dialog.open(AttendeeListDialogComponent, {
            width: '600px',
            data: { eventId: event.id, eventName: event.name }
        });
    }

    constructor(
        private eventService: EventService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.retrieveEvents();
    }

    retrieveEvents(): void {
        this.eventService.getAll().subscribe({
            next: (data) => {
                this.events = data;
            },
            error: (e) => console.error(e)
        });
    }

    saveEvent(): void {
        const data = { ...this.newEvent };

        if (this.isEditMode && this.newEvent.id) {
            this.eventService.update(this.newEvent.id, data).subscribe({
                next: (res) => {
                    this.snackBar.open('Event updated!', 'Close', { duration: 3000 });
                    this.resetForm();
                    this.retrieveEvents();
                },
                error: (e) => {
                    console.error(e);
                    this.snackBar.open(e.error.message || 'Error updating event', 'Close', { duration: 3000 });
                }
            });
        } else {
            this.eventService.create(data).subscribe({
                next: (res) => {
                    this.snackBar.open('Event created successfully!', 'Close', { duration: 3000 });
                    this.resetForm();
                    this.retrieveEvents();
                },
                error: (e) => {
                    console.error(e);
                    this.snackBar.open(e.error.message || 'Error creating event', 'Close', { duration: 3000 });
                }
            });
        }
    }

    editEvent(event: Event): void {
        this.newEvent = { ...event };
        this.isEditMode = true;
        // Scroll to top
        window.scrollTo(0, 0);
    }

    resetForm(): void {
        this.newEvent = { name: '', description: '', venue: '', date_time: '', category: '', capacity: 0 };
        this.isEditMode = false;
    }

    deleteEvent(id: any): void {
        if (confirm("Are you sure?")) {
            this.eventService.delete(id).subscribe({
                next: () => {
                    this.snackBar.open('Event deleted!', 'Close', { duration: 3000 });
                    this.retrieveEvents();
                },
                error: (e) => console.error(e)
            });
        }
    }
}
