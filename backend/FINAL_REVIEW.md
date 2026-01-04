# Final Review & Handover — Backend

This document summarizes the final steps to run, verify, and troubleshoot the backend locally and in CI.

## Local run checklist
1. Ensure MySQL server is available (local installation or Docker). If local MySQL is installed:
   - Start the service (Windows Services or `Get-Service -Name MySQL*`).
   - Confirm `mysql` client is available or accessible.

2. Copy `.env.example` to `.env` and set values (at minimum set `JWT_SECRET` and DB credentials):
```text
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=<your_root_password_or_appuser_password>
DB_NAME=event_planner_db
DB_PORT=3306
JWT_SECRET=your_jwt_secret_here
```

3. Install dependencies and seed users:
```powershell
npm install
npx ts-node create_users_table.ts
```

4. Start the server:
```powershell
npm run start
```

5. Run E2E smoke test (backend running):
```powershell
npm run test:e2e
```

## CI
- A GitHub Actions workflow `.github/workflows/e2e.yml` will spin up a MySQL service and run the E2E smoke test automatically on push and PR to `main`.

## Troubleshooting
- `ECONNREFUSED`: Back-end cannot connect to MySQL. Ensure MySQL is running and `.env` values match the server.
- `mysql` CLI not found: Install MySQL client or add MySQL `bin` folder to PATH.
- Frontend QR not showing: ensure booking returned `qr_data` (data URL) or fallback uses external QR image API.

## Security notes
- Do NOT commit `.env` with secrets.
- For production, use managed DB and set `JWT_SECRET` via environment variables or secrets manager.

If you want, I can:
- Add automated unit tests and Cypress e2e tests, or
- Create a Dockerfile and full docker-compose to build backend image and run both services in a single command.
