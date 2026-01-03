import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';

import { AppComponent } from './app.component';
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
import { EventEditComponent } from './components/event-edit.component';
import { EventCreateComponent } from './components/event-create.component';
import { AttendeeListDialogComponent } from './components/attendee-list-dialog/attendee-list-dialog.component';

import { AuthInterceptor } from './services/auth.interceptor';
import { ErrorInterceptor } from './services/error.interceptor';
import { MaterialModule } from './shared/material.module';

@NgModule({
  declarations: [
    AppComponent,
    EventListComponent,
    EventDetailsComponent,
    TicketBookingComponent,
    BookingConfirmationComponent,
    OrganizerDashboardComponent,
    LoginComponent,
    RegisterComponent,
    MyBookingsComponent,
    AdminDashboardComponent,
    NotAuthorizedComponent,
    EventEditComponent,
    EventCreateComponent,
    AttendeeListDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatIconModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MaterialModule,
    MatMenuModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
