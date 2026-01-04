import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EventService } from '../services/event.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-event-create',
    templateUrl: './event-create.component.html',
    styleUrls: ['./event-create.component.scss']
})
export class EventCreateComponent {
    form = this.fb.group({
        name: ['', Validators.required],
        description: [''],
        venue: ['', Validators.required],
        date_time: ['', Validators.required],
        category: [''],
        capacity: [1, [Validators.required, Validators.min(1)]],
        ticket_price: [0, [Validators.min(0)]]
    });
    selected?: File;
    preview: string | null = null;
    progress: number | null = null;
    submitting = false;

    constructor(private fb: FormBuilder, private eventService: EventService, private snack: MatSnackBar, private router: Router) { }

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
        this.eventService.create(payload).subscribe({
            next: (ev: any) => {
                if (this.selected) {
                    this.eventService.uploadImageWithProgress(ev.id, this.selected).subscribe({
                        next: (evt: any) => {
                            if (evt.type === HttpEventType.UploadProgress && evt.total) {
                                this.progress = Math.round(100 * (evt.loaded / evt.total));
                            } else if (evt.type === HttpEventType.Response) {
                                this.snack.open('Event created', 'OK', { duration: 3000 });
                                this.router.navigate(['/organizer/dashboard']);
                            }
                        },
                        error: () => {
                            this.snack.open('Event created but image upload failed', 'OK', { duration: 3000 });
                            this.router.navigate(['/organizer/dashboard']);
                        }
                    });
                } else {
                    this.snack.open('Event created', 'OK', { duration: 3000 });
                    this.router.navigate(['/organizer/dashboard']);
                }
            },
            error: (err: any) => {
                this.submitting = false;
                this.snack.open(err.error?.error || 'Create failed', 'OK', { duration: 3000 });
            }
        });
    }

    cancel() { this.router.navigate(['/organizer/dashboard']); }
}
