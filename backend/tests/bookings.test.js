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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
function registerAndLogin(username_1, password_1) {
    return __awaiter(this, arguments, void 0, function* (username, password, role = 'attendee') {
        yield (0, supertest_1.default)(app_1.default).post('/auth/register').send({ username, password, role });
        const res = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send({ username, password });
        return res.body.token;
    });
}
function createEventAsOrganizer() {
    return __awaiter(this, void 0, void 0, function* () {
        const org = `org${Date.now()}`;
        yield (0, supertest_1.default)(app_1.default).post('/auth/register').send({ username: org, password: 'pass123', role: 'organizer' });
        const login = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send({ username: org, password: 'pass123' });
        const token = login.body.token;
        const ev = {
            name: 'Capacity Event',
            venue: 'Venue',
            date_time: '2099-01-01 12:00:00',
            capacity: 2,
            ticket_price: 5
        };
        const create = yield (0, supertest_1.default)(app_1.default).post('/events').set('Authorization', `Bearer ${token}`).send(ev);
        return create.body;
    });
}
describe('Bookings API', () => {
    it('allows attendee to book tickets and enforces capacity', () => __awaiter(void 0, void 0, void 0, function* () {
        const event = yield createEventAsOrganizer();
        const attendeeToken = yield registerAndLogin(`att${Date.now()}`, 'pass123', 'attendee');
        // book 2 tickets (full)
        const b1 = yield (0, supertest_1.default)(app_1.default).post('/bookings').set('Authorization', `Bearer ${attendeeToken}`).send({ event_id: event.id, tickets_booked: 2 });
        expect(b1.status).toBe(201);
        expect(b1.body.tickets_booked).toBe(2);
        // another attendee tries to book 1 ticket -> should fail due to capacity
        const attendeeToken2 = yield registerAndLogin(`att2${Date.now()}`, 'pass123', 'attendee');
        const b2 = yield (0, supertest_1.default)(app_1.default).post('/bookings').set('Authorization', `Bearer ${attendeeToken2}`).send({ event_id: event.id, tickets_booked: 1 });
        expect(b2.status).toBe(400);
        expect(b2.body.error).toMatch(/Not enough seats/);
    }));
});
