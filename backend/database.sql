CREATE DATABASE IF NOT EXISTS event_planner_db;
USE event_planner_db;

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organizer_id INT NOT NULL DEFAULT 1,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    venue VARCHAR(255) NOT NULL,
    date_time DATETIME NOT NULL,
    category VARCHAR(100),
    capacity INT NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    attendee_id INT NOT NULL DEFAULT 1,
    tickets_booked INT NOT NULL,
    total_price DECIMAL(10, 2) DEFAULT 0.00,
    qr_data LONGTEXT,
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- In real app, hash this!
    role VARCHAR(50) NOT NULL DEFAULT 'attendee', -- 'organizer' or 'attendee'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
