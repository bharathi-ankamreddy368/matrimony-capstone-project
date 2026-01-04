"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const api = axios.create({ baseURL: `http://localhost:${process.env.PORT || 3000}/api` });
const random = (p) => `${p}_${Math.floor(Math.random() * 10000)}`;
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Starting E2E smoke test (ensure backend is running and DB is ready)...');
        // Register organizer
        const organizer = { username: random('org'), password: 'pass1234', role: 'organizer' };
        yield api.post('/users/register', organizer);
        const loginOrg = yield api.post('/users/login', { username: organizer.username, password: organizer.password });
        const orgToken = loginOrg.data.token;
        console.log('Organizer registered and logged in.');
        // Create event
        const eventData = {
            name: 'E2E Test Event',
            description: 'A test event',
            venue: 'Test Venue',
            date_time: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
            category: 'Test',
            capacity: 10,
            image_url: ''
        };
        const created = yield api.post('/events', eventData, { headers: { Authorization: `Bearer ${orgToken}` } });
        const eventId = created.data.id;
        console.log('Event created with id', eventId);
        // Register attendee
        const attendee = { username: random('att'), password: 'pass1234', role: 'attendee' };
        yield api.post('/users/register', attendee);
        const loginAtt = yield api.post('/users/login', { username: attendee.username, password: attendee.password });
        const attToken = loginAtt.data.token;
        console.log('Attendee registered and logged in.');
        // Create booking
        const bookingRes = yield api.post('/bookings', { event_id: eventId, tickets_booked: 2 }, { headers: { Authorization: `Bearer ${attToken}` } });
        const bookingId = bookingRes.data.id;
        console.log('Booking created with id', bookingId);
        // Get booking and validate qr
        const bookingGet = yield api.get(`/bookings/${bookingId}`, { headers: { Authorization: `Bearer ${attToken}` } });
        if (!bookingGet.data.qr_data && !bookingGet.data.qr) {
            throw new Error('No QR data present on booking');
        }
        console.log('Booking retrieved and QR is present.');
        // Organizer fetch attendees for event
        const attendees = yield api.get(`/bookings/event/${eventId}`, { headers: { Authorization: `Bearer ${orgToken}` } });
        if (!Array.isArray(attendees.data) || attendees.data.length === 0) {
            throw new Error('Organizer could not retrieve attendees');
        }
        console.log('Organizer retrieved attendees.');
        console.log('E2E smoke test passed.');
    });
}
run().catch(err => {
    var _a;
    const msg = ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message || err;
    if (msg && msg.code === 'ECONNREFUSED') {
        console.error('E2E smoke test failed: Could not connect to backend. Make sure the backend is running and the DB is available.');
    }
    else {
        console.error('E2E smoke test failed:', msg);
    }
    process.exit(1);
});
