import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { EventService } from '../services/event.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpEventType } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
    selector: 'app-event-edit',
    templateUrl: './event-edit.component.html',
    styleUrls: ['./event-edit.component.scss']
})
export class EventEditComponent implements OnInit {
    eventId = 0;
    selected?: File;
    preview: string | null = null;
    progress: number | null = null;
    submitting = false;
    apiUrl = environment.apiUrl;

    form = this.fb.group({
        name: ['', Validators.required],
        description: [''],
        venue: ['', Validators.required],
        date_time: ['', Validators.required],
        category: [''],
        capacity: [1, [Validators.required, Validators.min(1)]],
        ticket_price: [0, [Validators.min(0)]]
    });

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private eventService: EventService,
        private snack: MatSnackBar
    ) { }

    ngOnInit() {
        this.eventId = Number(this.route.snapshot.paramMap.get('id'));
        this.eventService.get(this.eventId).subscribe(e => {
            this.form.patchValue({
                name: e.name,
                description: e.description,
                venue: e.venue,
                date_time: e.date_time,
                category: e.category,
                capacity: e.capacity,
                ticket_price: e.ticket_price
            });
            if (e.image_url) this.preview = this.apiUrl + e.image_url;
        }, _ => this.snack.open('Failed to load event', 'OK', { duration: 3000 }));
    }

    onFile(e: Event) {
        const input = e.target as HTMLInputElement;
        if (input.files && input.files.length) {
            this.selected = input.files[0];
            this.preview = URL.createObjectURL(this.selected);
        }
    }

    submit() {
        if (this.form.invalid) return;
        this.submitting = true;
        const payload = this.form.value;
        this.eventService.update(this.eventId, payload).subscribe({
            next: () => {
                if (this.selected) {
                    this.eventService.uploadImageWithProgress(this.eventId, this.selected).subscribe({
                        next: (evt: any) => {
                            if (evt.type === HttpEventType.UploadProgress && evt.total) {
                                this.progress = Math.round(100 * (evt.loaded / evt.total));
                            } else if (evt.type === HttpEventType.Response) {
                                this.progress = null;
                                this.snack.open('Event updated successfully', 'OK', { duration: 3000 });
                                this.router.navigate(['/organizer/dashboard']);
                            }
                        },
                        error: () => {
                            this.progress = null;
                            this.snack.open('Event updated but image upload failed', 'OK', { duration: 3000 });
                            this.router.navigate(['/organizer/dashboard']);
                        }
                    });
                } else {
                    this.snack.open('Event updated successfully', 'OK', { duration: 3000 });
                    this.router.navigate(['/organizer/dashboard']);
                }
            },
            error: (err: any) => {
                this.submitting = false;
                this.snack.open(err.error?.error || 'Update failed', 'OK', { duration: 3000 });
            }
        });
    }

    cancel() {
        this.router.navigate(['/organizer/dashboard']);
    }
}
