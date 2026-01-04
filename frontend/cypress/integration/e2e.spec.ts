/* Full end-to-end flow:
   - create organizer (API)
   - create event (API)
   - login as organizer (set token), upload image via edit page
   - create attendee (API), login (set token), book ticket via UI
   - verify booking confirmation and QR visible
*/
describe('Full E2E: organizer create+upload + attendee booking', () => {
  const api = Cypress.env('apiUrl') || 'http://localhost:3000';

  function unique(nameBase: string) {
    return `${nameBase}_${Date.now()}`;
  }

  it('organizer creates event and uploads image; attendee books and sees QR', () => {
    // 1) register organizer and obtain token
    const orgUser = unique('orgUser');
    const orgPass = 'pass123';
    cy.request('POST', `${api}/auth/register`, { username: orgUser, password: orgPass, role: 'organizer' })
      .its('body')
      .then(body => {
        expect(body.token).to.exist;
        const token = body.token;

        // 2) create event via API
        const eventPayload = {
          name: 'E2E Event ' + Date.now(),
          venue: 'Test Venue',
          date_time: '2099-01-01 12:00:00',
          capacity: 5,
          ticket_price: 10,
          category: 'Workshop',
          description: 'E2E test event'
        };
        cy.request({
          method: 'POST',
          url: `${api}/events`,
          body: eventPayload,
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
          expect(res.status).to.eq(201);
          const event = res.body;

          // 3) visit edit page as organizer and upload an image via file input
          // set token in localStorage to simulate logged-in user
          cy.visit('/');
          cy.window().then(win => win.localStorage.setItem('token', token));
          cy.visit(`/organizer/events/${event.id}/edit`);
          // attach file using fixture base64
          cy.fixture('test-image.png', 'base64').then((b64) => {
            const blob = Cypress.Blob.base64StringToBlob(b64, 'image/png');
            cy.get('input[type="file"]').attachFile({
              fileContent: blob,
              fileName: 'test-image.png',
              mimeType: 'image/png'
            });
            // submit the form (Save button)
            cy.contains('button', 'Save').click();

            // wait for snackbar or redirect back to dashboard
            cy.contains('Event updated successfully', { timeout: 10000 }).should('exist').then(() => {
              // 4) register an attendee and book ticket via UI
              const attUser = unique('attUser');
              const attPass = 'pass123';
              cy.request('POST', `${api}/auth/register`, { username: attUser, password: attPass, role: 'attendee' })
                .its('body')
                .then(attBody => {
                  expect(attBody.token).to.exist;
                  const attToken = attBody.token;

                  // visit events list as attendee
                  cy.visit('/');
                  cy.window().then(win => {
                    win.localStorage.removeItem('token'); // ensure logged out
                    win.localStorage.setItem('token', attToken);
                  });

                  cy.visit(`/events`);
                  // find our event and click Details
                  cy.contains(eventPayload.name).parent().within(() => {
                    cy.contains('Details').click();
                  });

                  // click Book Tickets
                  cy.contains('button', 'Book Tickets').click();

                  // select tickets and confirm booking
                  cy.get('input[formcontrolname="tickets"]').clear().type('1');
                  cy.contains('button', 'Confirm Booking').click();

                  // should redirect to booking confirmation page and show QR
                  cy.contains('Booking Confirmed', { timeout: 10000 }).should('exist');
                  cy.get('img[alt="QR Code"]').should('exist');
                });
            });
          });
        });
      });
  });
});
