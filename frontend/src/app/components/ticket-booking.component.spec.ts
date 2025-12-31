import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketBookingComponent } from './ticket-booking.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BookingsService } from '../services/bookings.service';
import { of } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

describe('TicketBookingComponent', () => {
  let component: TicketBookingComponent;
  let fixture: ComponentFixture<TicketBookingComponent>;
  let bookingsSpy: jasmine.SpyObj<BookingsService>;

  beforeEach(async () => {
    bookingsSpy = jasmine.createSpyObj('BookingsService', ['createBooking']);
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatSnackBarModule, RouterTestingModule],
      declarations: [TicketBookingComponent],
      providers: [{ provide: BookingsService, useValue: bookingsSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(TicketBookingComponent);
    component = fixture.componentInstance;
    component.event = { id: 1, ticket_price: 10, available_seats: 5 };
    fixture.detectChanges();
  });

  it('should prevent booking more than available seats', () => {
    component.form.controls.tickets.setValue(6);
    component.book();
    expect(bookingsSpy.createBooking).not.toHaveBeenCalled();
  });

  it('should call createBooking when valid', () => {
    component.form.controls.tickets.setValue(2);
    bookingsSpy.createBooking.and.returnValue(of({ id: 1 }));
    component.book();
    expect(bookingsSpy.createBooking).toHaveBeenCalled();
  });
});
