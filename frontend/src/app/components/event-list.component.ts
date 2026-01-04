import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
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
  apiUrl = environment.apiUrl.replace('/api', '');

  constructor(private eventService: EventService) { }
  ngOnInit() { this.load(); }

  async load() {
    this.eventService.getAll({ category: this.category, date: this.date, venue: this.venue }).subscribe(e => {
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
      const matchesDate = !this.date || (new Date(ev.date_time).toISOString().slice(0, 10) === this.date);
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

  prevPage() { if (this.page > 1) { this.page--; this.updatePaged(); } }
  nextPage() { if (this.page < this.totalPages) { this.page++; this.updatePaged(); } }

  search() { this.applyFilters(); }
  clear() { this.searchTerm = ''; this.category = ''; this.venue = ''; this.date = ''; this.applyFilters(); }
}
