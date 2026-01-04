import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private baseUrl = `${environment.apiUrl}/events`;

    constructor(private http: HttpClient) { }

    getAll(filters?: any): Observable<Event[]> {
        return this.http.get<Event[]>(this.baseUrl, { params: filters });
    }

    get(id: any): Observable<Event> {
        return this.http.get<Event>(`${this.baseUrl}/${id}`);
    }

    create(data: any): Observable<any> {
        return this.http.post(this.baseUrl, data);
    }

    uploadFile(file: File): Observable<any> {
        const formData = new FormData();
        formData.append('image', file);
        return this.http.post('http://localhost:3000/api/upload', formData);
    }

    update(id: any, data: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/${id}`, data);
    }

    delete(id: any): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }

    // From duplicate EventsService
    uploadImage(eventId: number, file: File): Observable<any> {
        const fd = new FormData();
        fd.append('image', file);
        return this.http.post<any>(`${this.baseUrl}/${eventId}/image`, fd);
    }

    uploadImageWithProgress(eventId: number, file: File): Observable<HttpEvent<any>> {
        const fd = new FormData();
        fd.append('image', file);
        const req = new HttpRequest('POST', `${this.baseUrl}/${eventId}/image`, fd, {
            reportProgress: true
        });
        return this.http.request(req);
    }

    getOrganizerEvents(): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.baseUrl}/organizer`);
    }

    cancelEvent(id: number): Observable<any> {
        return this.http.patch<any>(`${this.baseUrl}/${id}/cancel`, {});
    }
}
