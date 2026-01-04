import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EventsService {
  constructor(private http: HttpClient) { }
  getEvents(filters: any) { return this.http.get<any[]>(`${environment.apiUrl}/events`, { params: filters }); }
  getEvent(id: number) { return this.http.get<any>(`${environment.apiUrl}/events/${id}`); }
  createEvent(payload: any) { return this.http.post<any>(`${environment.apiUrl}/events`, payload); }
  uploadImage(eventId: number, file: File) {
    const fd = new FormData(); fd.append('image', file);
    return this.http.post<any>(`${environment.apiUrl}/events/${eventId}/image`, fd);
  }
  getOrganizerEvents() { return this.http.get<any[]>(`${environment.apiUrl}/events/organizer`); }
  cancelEvent(id: number) { return this.http.patch<any>(`${environment.apiUrl}/events/${id}/cancel`, {}); }
  updateEvent(id: number, payload: any) { return this.http.put<any>(`${environment.apiUrl}/events/${id}`, payload); }

  uploadImageWithProgress(eventId: number, file: File) {
    const fd = new FormData();
    fd.append('image', file);
    const req = new HttpRequest('POST', `${environment.apiUrl}/events/${eventId}/image`, fd, {
      reportProgress: true
    });
    return this.http.request(req) as any as Observable<HttpEvent<any>>;
  }
}
