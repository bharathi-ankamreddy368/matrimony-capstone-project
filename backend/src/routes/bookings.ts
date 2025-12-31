import { Router } from 'express';
import * as ctrl from '../controllers/bookingsController';
import { authMiddleware, requireRole } from '../middleware/auth';
import { createBookingValidators } from '../middleware/validators';
import { validateRequest } from '../middleware/validate';
const router = Router();

router.post('/', authMiddleware, requireRole('attendee'), createBookingValidators, validateRequest, ctrl.createBooking);
router.get('/:id', authMiddleware, ctrl.getBooking);
router.get('/event/:eventId', authMiddleware, requireRole('organizer'), ctrl.listBookingsForEvent);
router.get('/me', authMiddleware, requireRole('attendee'), ctrl.listMyBookings);

export default router;
