import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private baseUrl = 'http://localhost:3000/api/events';

    constructor(private http: HttpClient) { }

    getAll(): Observable<Event[]> {
        return this.http.get<Event[]>(this.baseUrl);
    }

    get(id: any): Observable<Event> {
        return this.http.get<Event>(`${this.baseUrl}/${id}`);
    }

    create(data: any): Observable<any> {
        return this.http.post(this.baseUrl, data);
    }

    update(id: any, data: any): Observable<any> {
        return this.http.put(`${this.baseUrl}/${id}`, data);
    }

    delete(id: any): Observable<any> {
        return this.http.delete(`${this.baseUrl}/${id}`);
    }
}
