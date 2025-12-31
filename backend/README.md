# Backend — Local MySQL Setup (Windows)

Quick, clear steps to get the backend running with a local MySQL server on Windows.

## 1) Install MySQL Server (Windows)
- Download from: https://dev.mysql.com/downloads/mysql/
- Use installer and note the root password you set during installation.
- Ensure the MySQL service is running (Services app) or start via:
  ```powershell
  # start MySQL service (example service name may vary)
  Start-Service -Name MySQL
  ```

## 2) Create database and user (one-time)
Option A — Manual (recommended if you prefer):
1. Open MySQL Shell or `mysql` CLI:
   ```powershell
   mysql -u root -p
   # enter root password when prompted
   ```
2. Run these SQL commands (replace `strongpassword`):
   ```sql
   CREATE DATABASE event_planner_db;
   CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'strongpassword';
   GRANT ALL PRIVILEGES ON event_planner_db.* TO 'appuser'@'localhost';
   FLUSH PRIVILEGES;
   ```

Option B — Use helper script (PowerShell + mysql CLI)
- Make sure `mysql.exe` is in your PATH (comes with MySQL client installation).
- Run (from `backend/`):
  ```powershell
  .\scripts\setup-db.ps1 -RootPassword "<your-root-password>" -AppUser "appuser" -AppPassword "strongpassword"
  ```

## 3) Configure the project
- Copy `.env.example` to `.env` and update values:
  ```text
  DB_HOST=localhost
  DB_USER=appuser
  DB_PASSWORD=strongpassword
  DB_NAME=event_planner_db
  DB_PORT=3306
  JWT_SECRET=your_jwt_secret_here
  PORT=3000
  ```

### Seed users (one-time)
- Run the seeder to create admin and demo user (passwords `admin123` and `user123` — they will be hashed):
  ```powershell
  npx ts-node create_users_table.ts
  ```

### Start the backend
- Install dependencies and start:
  ```powershell
  npm install
  npm run start
  ```

- Or use Docker Compose (if you prefer):
  ```powershell
  npm run compose:up
  ```

### Run with Docker (recommended if you don't have MySQL locally)
- From `backend/` copy `.env.example` to `.env` and update values (set `DB_ROOT_PASSWORD`).
- Then:
  ```powershell
  npm run compose:up
  ```
- The backend will be available at http://localhost:3000/ and DB will be started as a container.

### Run the E2E smoke test
- Ensure the backend is running and the DB is set up and seeded. Then run:
  ```powershell
  npm run test:e2e
  ```
- The script performs: register organizer + attendee, create event, book tickets, verify QR and attendee listing. It will print success or the failing step.



## 4) Install and run backend
From the `backend/` folder:
```powershell
npm install
npm run start
```
- The server should log: `Users table ensured.` and `Server is running on port 3000.`

## 5) Verify
- Visit: http://localhost:3000/ → should return a JSON welcome message.
- Or run table check:
  ```powershell
  npx ts-node check_db.ts
  ```

## Troubleshooting
- "DB Init Error": check `.env` values and that MySQL service is running.
- If `mysql` CLI not found and you used the helper script: add MySQL `bin/` folder to PATH or run from MySQL Shell.

## Notes
- Do not commit `.env` to git.
- Use a non-root DB user for the app (`appuser` above).
- `backend/database.sql` contains the schema if you prefer to import it manually.

# Backend

Setup:
1. Copy `.env.example` to `.env` and set DB credentials and JWT_SECRET.
2. npm install
3. mkdir uploads
4. npm run migrate
5. npm run dev

Quick checks:
- GET /health → { status: "ok" }
- Register: POST /auth/register { username, password, role? }
- Login: POST /auth/login { username, password } -> { token }
- Use Authorization: Bearer <token> to call protected endpoints (organizer/admin/attendee flows).

Notes:
- POST /events (organizer) to create events (name, venue, date_time, capacity, ticket_price)
- POST /events/:id/image (organizer, form-data 'image') to upload an image; served at /uploads/<filename>
- POST /bookings (attendee) to book tickets; returns QR in booking response
- GET /admin/analytics (admin) for simple stats

Docker (quick start)
1. Ensure Docker and docker-compose are installed.
2. From project root run:
   docker-compose up --build
3. After DB is ready, run migrations in the backend container:
   docker-compose exec backend npm run migrate
4. Seed an admin user:
   docker-compose exec backend npm run seed

Notes:
- Backend will be available at http://localhost:3000
- Frontend (nginx) will be available at http://localhost:4200
