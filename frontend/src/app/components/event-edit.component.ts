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
    selectedFile?: File;
    previewUrl: string | null = null;
    uploadProgress: number | null = null;
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
            if (e.image_url) this.previewUrl = this.apiUrl + e.image_url;
        }, _ => this.snack.open('Failed to load event', 'OK', { duration: 3000 }));
    }

    onFile(e: Event) {
        const input = e.target as HTMLInputElement;
        if (input.files && input.files.length) {
            this.selectedFile = input.files[0];
            this.previewUrl = URL.createObjectURL(this.selectedFile);
        }
    }

    save() {
        if (this.form.invalid) return;
        const payload = this.form.value;
        this.eventService.update(this.eventId, payload).subscribe({
            next: () => {
                if (this.selectedFile) {
                    this.eventService.uploadImageWithProgress(this.eventId, this.selectedFile).subscribe({
                        next: (evt: any) => {
                            if (evt.type === HttpEventType.UploadProgress && evt.total) {
                                this.uploadProgress = Math.round(100 * (evt.loaded / evt.total));
                            } else if (evt.type === HttpEventType.Response) {
                                this.uploadProgress = null;
                                this.snack.open('Event updated successfully', 'OK', { duration: 3000 });
                                this.router.navigate(['/organizer/dashboard']);
                            }
                        },
                        error: () => {
                            this.uploadProgress = null;
                            this.snack.open('Event updated but image upload failed', 'OK', { duration: 3000 });
                            this.router.navigate(['/organizer/dashboard']);
                        }
                    });
                } else {
                    this.snack.open('Event updated successfully', 'OK', { duration: 3000 });
                    this.router.navigate(['/organizer/dashboard']);
                }
            },
            error: (err: any) => this.snack.open(err.error?.error || 'Update failed', 'OK', { duration: 3000 })
        });
    }

    cancel() {
        this.router.navigate(['/organizer/dashboard']);
    }
}
