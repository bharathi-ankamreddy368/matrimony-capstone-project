import { Component, OnInit } from '@angular/core';
import { EventsService } from '../services/events.service';

@Component({
  selector: 'app-event-list',
  template: `
    <h2>Events</h2>
    <mat-card>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <mat-form-field appearance="outline" style="flex:1;min-width:200px">
          <mat-label>Search</mat-label>
          <input matInput placeholder="Search name, venue or category" [(ngModel)]="searchTerm" (input)="applyFilters()" />
        </mat-form-field>

        <mat-form-field appearance="outline" style="min-width:180px">
          <mat-label>Category</mat-label>
          <input matInput placeholder="Category" [(ngModel)]="category" (input)="applyFilters()" />
        </mat-form-field>

        <mat-form-field appearance="outline" style="min-width:180px">
          <mat-label>Venue</mat-label>
          <input matInput placeholder="Venue" [(ngModel)]="venue" (input)="applyFilters()" />
        </mat-form-field>

        <mat-form-field appearance="outline" style="min-width:180px">
          <mat-label>Date</mat-label>
          <input matInput type="date" [(ngModel)]="date" (change)="applyFilters()" />
        </mat-form-field>

        <div style="margin-left:auto;display:flex;gap:8px">
          <button mat-stroked-button (click)="clear()">Clear</button>
        </div>
      </div>
    </mat-card>

    <div *ngIf="pagedEvents.length === 0" style="margin-top:12px">
      <mat-card>No events found.</mat-card>
    </div>

    <div *ngFor="let e of pagedEvents" style="margin-top:12px">
      <mat-card>
        <div style="display:flex;gap:12px;align-items:center">
          <img *ngIf="e.image_url" [src]="apiUrl + e.image_url" alt="image" style="width:160px;height:96px;object-fit:cover;border-radius:4px" />
          <div style="flex:1">
            <h3 style="margin:0">{{e.name}}</h3>
            <div style="color:rgba(0,0,0,0.7)">{{e.venue}} — {{e.date_time | date:'short'}}</div>
            <div style="margin-top:6px;color:rgba(0,0,0,0.8)">{{ (e.description || '') | slice:0:140 }}{{e.description?.length > 140 ? '...' : ''}}</div>
            <div style="margin-top:8px">
              <strong>Category:</strong> {{e.category || '—'}} • <strong>Price:</strong> {{e.ticket_price | currency}} • <strong>Available:</strong> {{e.available_seats}}
            </div>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <button mat-raised-button color="primary" [routerLink]="['/events', e.id]">Details</button>
            <button mat-stroked-button color="accent" [routerLink]="['/events', e.id, 'book']" [disabled]="e.available_seats <= 0">Book</button>
          </div>
        </div>
      </mat-card>
    </div>

    <div style="display:flex;gap:8px;align-items:center; justify-content:center; margin-top:12px;">
      <button mat-button (click)="prevPage()" [disabled]="page<=1">Previous</button>
      <span>Page {{page}} / {{totalPages}}</span>
      <button mat-button (click)="nextPage()" [disabled]="page>=totalPages">Next</button>
    </div>
  `
})
export class EventListComponent implements OnInit {
  events: any[] = [];
  filtered: any[] = [];
  pagedEvents: any[] = [];
  category = '';
  venue = '';
  date = '';
  searchTerm = '';
  page = 1;
  pageSize = 6;
  apiUrl = (window as any).__env?.apiUrl || 'http://localhost:3000';

  constructor(private eventsService: EventsService) {}
  ngOnInit() { this.load(); }

  async load() {
    this.eventsService.getEvents({ category: this.category, date: this.date, venue: this.venue }).subscribe(e => {
      this.events = e;
      this.applyFilters();
    });
  }

  applyFilters() {
    const term = (this.searchTerm || '').toLowerCase().trim();
    this.filtered = this.events.filter(ev => {
      const matchesTerm = !term || (ev.name && ev.name.toLowerCase().includes(term)) || (ev.venue && ev.venue.toLowerCase().includes(term)) || (ev.category && ev.category.toLowerCase().includes(term));
      const matchesCategory = !this.category || (ev.category && ev.category.toLowerCase().includes(this.category.toLowerCase()));
      const matchesVenue = !this.venue || (ev.venue && ev.venue.toLowerCase().includes(this.venue.toLowerCase()));
      const matchesDate = !this.date || (new Date(ev.date_time).toISOString().slice(0,10) === this.date);
      return matchesTerm && matchesCategory && matchesVenue && matchesDate;
    });
    this.page = 1;
    this.updatePaged();
  }

  updatePaged() {
    const start = (this.page - 1) * this.pageSize;
    this.pagedEvents = this.filtered.slice(start, start + this.pageSize);
  }

  get totalPages() { return Math.max(1, Math.ceil(this.filtered.length / this.pageSize)); }

  prevPage() { if (this.page>1) { this.page--; this.updatePaged(); } }
  nextPage() { if (this.page < this.totalPages) { this.page++; this.updatePaged(); } }

  search() { this.applyFilters(); }
  clear() { this.searchTerm=''; this.category=''; this.venue=''; this.date=''; this.applyFilters(); }
}
