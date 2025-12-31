# Smart Event Planner & Ticketing Platform

This repository contains a full-stack app (Angular frontend + Node.js/TypeScript backend + MySQL).

Quick start (local):
1. Backend
   - cd backend
   - cp .env.example .env and fill DB credentials and JWT_SECRET
   - npm install
   - mkdir uploads
   - npm run migrate
   - npm run seed          # creates admin user
   - npm run dev

2. Frontend
   - cd frontend
   - npm install
   - npm run start

Or using Docker Compose:
- docker-compose up --build
- docker-compose exec backend npm run migrate
- docker-compose exec backend npm run seed

Testing:
- Backend: cd backend && npm test
- Frontend unit tests: cd frontend && npm test
- E2E (Cypress): ensure backend+frontend are running, then cd frontend && npm run e2e

Notes:
- API: http://localhost:3000
- UI: http://localhost:4200
- Use POST /auth/register and /auth/login to create users and obtain JWTs (stored by the frontend).
