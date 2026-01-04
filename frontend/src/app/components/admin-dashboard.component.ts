import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  stats: any;
  constructor(private admin: AdminService) { }
  ngOnInit() { this.admin.getAnalytics().subscribe(s => this.stats = s); }
}
