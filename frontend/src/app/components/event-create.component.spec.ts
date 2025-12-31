import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventCreateComponent } from './event-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EventsService } from '../services/events.service';
import { of } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

describe('EventCreateComponent', () => {
  let component: EventCreateComponent;
  let fixture: ComponentFixture<EventCreateComponent>;
  let eventsSpy: jasmine.SpyObj<EventsService>;

  beforeEach(async () => {
    eventsSpy = jasmine.createSpyObj('EventsService', ['createEvent', 'uploadImageWithProgress']);
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatSnackBarModule, RouterTestingModule],
      declarations: [EventCreateComponent],
      providers: [{ provide: EventsService, useValue: eventsSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(EventCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component and have invalid form initially', () => {
    expect(component).toBeTruthy();
    expect(component.form.invalid).toBeTrue();
  });

  it('should call createEvent when form valid', () => {
    component.form.setValue({
      name: 'Test',
      venue: 'V',
      date_time: '2099-01-01 10:00:00',
      category: 'Music',
      capacity: 10,
      ticket_price: 5
    });
    eventsSpy.createEvent.and.returnValue(of({ id: 1 }));
    component.submit();
    expect(eventsSpy.createEvent).toHaveBeenCalled();
  });
});
