import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventListComponent } from './components/event-list.component';
import { EventDetailsComponent } from './components/event-details.component';
import { TicketBookingComponent } from './components/ticket-booking.component';
import { BookingConfirmationComponent } from './components/booking-confirmation.component';
import { OrganizerDashboardComponent } from './components/organizer-dashboard.component';
import { LoginComponent } from './components/login.component';
import { RegisterComponent } from './components/register.component';
import { MyBookingsComponent } from './components/my-bookings.component';
import { AdminDashboardComponent } from './components/admin-dashboard.component';
import { NotAuthorizedComponent } from './components/not-authorized.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { EventEditComponent } from './components/event-edit.component';
import { EventCreateComponent } from './components/event-create.component';

const routes: Routes = [
  { path: 'events', component: EventListComponent },
  { path: 'events/:id', component: EventDetailsComponent },
  { path: 'events/:id/book', component: TicketBookingComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'attendee' } },
  { path: 'booking/:id', component: BookingConfirmationComponent, canActivate: [AuthGuard] },
  { path: 'organizer/dashboard', component: OrganizerDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'organizer' } },
  { path: 'my-bookings', component: MyBookingsComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'attendee' } },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'admin' } },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'not-authorized', component: NotAuthorizedComponent },
  { path: 'organizer/events/:id/edit', component: EventEditComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'organizer' } },
  { path: 'organizer/events/create', component: EventCreateComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'organizer' } },
  { path: '', redirectTo: '/events', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
