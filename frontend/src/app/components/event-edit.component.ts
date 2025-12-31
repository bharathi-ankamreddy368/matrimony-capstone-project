import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventsService } from '../services/events.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpEventType } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-event-edit',
  template: `
    <h2>Edit Event</h2>
    <form [formGroup]="form" (ngSubmit)="save()">
      <div>
        <label>
          Name
          <input formControlName="name" />
        </label>
        <div *ngIf="form.controls.name.invalid && form.controls.name.touched" style="color:red">Name is required</div>

        <label>
          Venue
          <input formControlName="venue" />
        </label>
        <div *ngIf="form.controls.venue.invalid && form.controls.venue.touched" style="color:red">Venue is required</div>

        <label>
          Date & Time (YYYY-MM-DD HH:mm:ss)
          <input formControlName="date_time" />
        </label>
        <div *ngIf="form.controls.date_time.invalid && form.controls.date_time.touched" style="color:red">Date/time is required</div>

        <label>
          Category
          <input formControlName="category" />
        </label>

        <label>
          Capacity
          <input type="number" formControlName="capacity" />
        </label>
        <div *ngIf="form.controls.capacity.invalid && form.controls.capacity.touched" style="color:red">Capacity must be > 0</div>

        <label>
          Ticket Price
          <input type="number" step="0.01" formControlName="ticket_price" />
        </label>
      </div>

      <div style="margin-top:8px;">
        <label>Image</label>
        <input type="file" (change)="onFile($event)" accept="image/*" />
        <div *ngIf="previewUrl" style="margin-top:8px">
          <img [src]="previewUrl" style="max-width:200px; display:block; margin-bottom:8px"/>
        </div>
        <div *ngIf="uploadProgress !== null">
          <mat-progress-spinner mode="determinate" [value]="uploadProgress" diameter="40"></mat-progress-spinner>
          <span>{{uploadProgress}}%</span>
        </div>
      </div>

      <div style="margin-top:12px;">
        <button type="submit" [disabled]="form.invalid">Save</button>
        <button type="button" (click)="cancel()">Cancel</button>
      </div>
    </form>
  `
})
export class EventEditComponent implements OnInit {
  form: FormGroup;
  eventId = 0;
  selectedFile?: File;
  previewUrl: string | null = null;
  uploadProgress: number | null = null;
  apiUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private events: EventsService,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      venue: ['', Validators.required],
      date_time: ['', Validators.required],
      category: [''],
      capacity: [1, [Validators.required, Validators.min(1)]],
      ticket_price: [0, [Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.events.getEvent(this.eventId).subscribe(e => {
      this.form.patchValue({
        name: e.name,
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
    this.events.updateEvent(this.eventId, payload).subscribe({
      next: () => {
        if (this.selectedFile) {
          this.events.uploadImageWithProgress(this.eventId, this.selectedFile).subscribe({
            next: evt => {
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
      error: (err) => this.snack.open(err.error?.error || 'Update failed', 'OK', { duration: 3000 })
    });
  }

  cancel() {
    this.router.navigate(['/organizer/dashboard']);
  }
}
