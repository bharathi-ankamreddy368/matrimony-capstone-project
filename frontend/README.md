# Frontend

This Angular frontend is implemented using Angular 16 and Angular Material.
It uses the backend at http://localhost:3000.

Inspired by Eventbrite (https://www.eventbrite.com/) — the UI/UX focuses on:
- Event discovery: search, filter by category/date/venue, pagination, event cards with images and prices.
- Event details: full description, venue info, ticket price, available seats and sharing options.
- Ticket booking: order summary, client-side validation, total price calculation.
- Booking confirmation: QR code, download and print options.
- Organizer dashboard: create/edit events, upload images, view attendee lists and export CSV of bookings.
- Admin: analytics endpoint is available in the backend.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Run with backend
1. cd frontend
2. npm install
3. npm run start

App runs at http://localhost:4200 and expects backend at http://localhost:3000 (adjust environment if needed).
