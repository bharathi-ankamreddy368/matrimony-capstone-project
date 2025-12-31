import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <h2>Admin Dashboard</h2>
    <div *ngIf="stats">
      <div>Total events: {{stats.total_events}}</div>
      <div>Total bookings: {{stats.total_bookings}}</div>
      <div>Total revenue: {{stats.total_revenue | currency}}</div>
      <h3>Top events</h3>
      <div *ngFor="let e of stats.top_events">{{e.name}} — Tickets sold: {{e.tickets_sold}}</div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  stats: any;
  constructor(private admin: AdminService) {}
  ngOnInit() { this.admin.getAnalytics().subscribe(s => this.stats = s); }
}
