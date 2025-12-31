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
describe('Auth API', () => {
    it('registers and logs in a user', () => __awaiter(void 0, void 0, void 0, function* () {
        const username = `user${Date.now()}`;
        const password = 'password123';
        const reg = yield (0, supertest_1.default)(app_1.default).post('/auth/register').send({ username, password, role: 'attendee' });
        expect(reg.status).toBe(201);
        expect(reg.body.token).toBeDefined();
        const login = yield (0, supertest_1.default)(app_1.default).post('/auth/login').send({ username, password });
        expect(login.status).toBe(200);
        expect(login.body.token).toBeDefined();
        expect(login.body.user).toMatchObject({ username, role: 'attendee' });
    }));
    it('rejects duplicate username', () => __awaiter(void 0, void 0, void 0, function* () {
        const username = `dup${Date.now()}`;
        const password = 'password123';
        yield (0, supertest_1.default)(app_1.default).post('/auth/register').send({ username, password });
        const res = yield (0, supertest_1.default)(app_1.default).post('/auth/register').send({ username, password });
        expect(res.status).toBe(409);
    }));
});
