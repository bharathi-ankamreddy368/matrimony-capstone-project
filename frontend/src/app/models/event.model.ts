export interface Event {
    id?: number;
    organizer_id?: number;
    name: string;
    description: string;
    venue: string;
    date_time: string;
    category: string;
    capacity: number;
    image_url?: string;
    tickets_sold?: number;
    created_at?: string;
}
