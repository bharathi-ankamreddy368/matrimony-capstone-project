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
    return __awaiter(this, arguments, void 0, function* (username, password, role = 'organizer') {
        yield (0, supertest_1.default)(app_1.default).post('/auth/register').send({ username, password, role });
        const res = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send({ username, password });
        return res.body.token;
    });
}
describe('Events API', () => {
    it('allows organizer to create and list events', () => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield registerAndLogin(`org${Date.now()}`, 'pass123', 'organizer');
        const ev = {
            name: 'Test Event',
            venue: 'Test Venue',
            date_time: '2099-01-01 10:00:00',
            capacity: 100,
            ticket_price: 10.5,
            category: 'Music'
        };
        const create = yield (0, supertest_1.default)(app_1.default).post('/events').set('Authorization', `Bearer ${token}`).send(ev);
        expect(create.status).toBe(201);
        expect(create.body.name).toBe(ev.name);
        const list = yield (0, supertest_1.default)(app_1.default).get('/events');
        expect(list.status).toBe(200);
        expect(Array.isArray(list.body)).toBe(true);
        expect(list.body.find((e) => e.name === ev.name)).toBeTruthy();
    }));
    it('validates required fields', () => __awaiter(void 0, void 0, void 0, function* () {
        const token = yield registerAndLogin(`org2${Date.now()}`, 'pass123', 'organizer');
        const res = yield (0, supertest_1.default)(app_1.default).post('/events').set('Authorization', `Bearer ${token}`).send({ venue: 'V', capacity: 10 });
        expect(res.status).toBe(400);
    }));
});
