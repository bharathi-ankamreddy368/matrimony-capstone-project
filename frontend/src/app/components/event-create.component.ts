import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EventsService } from '../services/events.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-create',
  template: `
    <h2>Create Event</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-form-field appearance="fill" style="display:block">
        <mat-label>Name</mat-label>
        <input matInput formControlName="name" />
        <mat-error *ngIf="form.controls.name.invalid && form.controls.name.touched">Name is required</mat-error>
      </mat-form-field>

      <mat-form-field appearance="fill" style="display:block">
        <mat-label>Venue</mat-label>
        <input matInput formControlName="venue" />
        <mat-error *ngIf="form.controls.venue.invalid && form.controls.venue.touched">Venue is required</mat-error>
      </mat-form-field>

      <mat-form-field appearance="fill" style="display:block">
        <mat-label>Date & Time</mat-label>
        <input matInput formControlName="date_time" placeholder="YYYY-MM-DD HH:mm:ss" />
        <mat-error *ngIf="form.controls.date_time.invalid && form.controls.date_time.touched">Date/time is required</mat-error>
      </mat-form-field>

      <mat-form-field appearance="fill" style="display:block">
        <mat-label>Category</mat-label>
        <input matInput formControlName="category" />
      </mat-form-field>

      <mat-form-field appearance="fill" style="display:block">
        <mat-label>Capacity</mat-label>
        <input matInput type="number" formControlName="capacity" />
        <mat-error *ngIf="form.controls.capacity.invalid && form.controls.capacity.touched">Capacity must be > 0</mat-error>
      </mat-form-field>

      <mat-form-field appearance="fill" style="display:block">
        <mat-label>Ticket Price</mat-label>
        <input matInput type="number" step="0.01" formControlName="ticket_price" />
      </mat-form-field>

      <div style="margin:8px 0">
        <label>Image (optional)</label>
        <input type="file" (change)="onFile($event)" accept="image/*" />
        <div *ngIf="preview" style="margin-top:8px">
          <img [src]="preview" style="max-width:240px; display:block" />
        </div>
        <mat-progress-bar *ngIf="progress !== null" [value]="progress"></mat-progress-bar>
      </div>

      <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || submitting">Create</button>
      <button mat-button type="button" (click)="cancel()">Cancel</button>
    </form>
  `
})
export class EventCreateComponent {
  form = this.fb.group({
    name: ['', Validators.required],
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

  constructor(private fb: FormBuilder, private events: EventsService, private snack: MatSnackBar, private router: Router) {}

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
    this.events.createEvent(payload).subscribe({
      next: (ev: any) => {
        if (this.selected) {
          this.events.uploadImageWithProgress(ev.id, this.selected).subscribe({
            next: evt => {
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
      error: (err) => {
        this.submitting = false;
        this.snack.open(err.error?.error || 'Create failed', 'OK', { duration: 3000 });
      }
    });
  }

  cancel() { this.router.navigate(['/organizer/dashboard']); }
}
