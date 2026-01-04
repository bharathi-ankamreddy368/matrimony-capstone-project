export interface Event {
    id?: number;
    organizer_id?: number;
    name: string;
    description: string;
    venue: string;
    date_time: string;
    category: string;
    capacity: number;
    ticket_price?: number;
    image_url?: string;
    tickets_sold?: number;
    status?: 'active' | 'cancelled';
    created_at?: string;
    available_seats?: number;
}
