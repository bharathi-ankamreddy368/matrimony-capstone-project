import { body, param } from 'express-validator';

export const registerValidators = [
	body('username').isString().trim().notEmpty().withMessage('username is required'),
	body('password').isString().isLength({ min: 6 }).withMessage('password must be at least 6 characters'),
	body('role').optional().isIn(['attendee', 'organizer', 'admin']).withMessage('invalid role')
];

export const loginValidators = [
	body('username').isString().trim().notEmpty().withMessage('username is required'),
	body('password').isString().notEmpty().withMessage('password is required')
];

export const createEventValidators = [
	body('name').isString().trim().notEmpty().withMessage('name is required'),
	body('venue').isString().trim().notEmpty().withMessage('venue is required'),
	body('date_time').isString().trim().notEmpty().withMessage('date_time is required'),
	body('capacity').isInt({ gt: 0 }).withMessage('capacity must be an integer > 0'),
	body('ticket_price').optional().isFloat({ min: 0 }).withMessage('ticket_price must be >= 0')
];

export const updateEventValidators = [
	body('capacity').optional().isInt({ gt: 0 }).withMessage('capacity must be an integer > 0'),
	body('ticket_price').optional().isFloat({ min: 0 }).withMessage('ticket_price must be >= 0'),
	body('status').optional().isIn(['active', 'cancelled']).withMessage('invalid status')
];

export const createBookingValidators = [
	body('event_id').isInt({ gt: 0 }).withMessage('event_id is required'),
	body('tickets_booked').isInt({ gt: 0 }).withMessage('tickets_booked must be > 0')
];

export const idParam = [
	param('id').isInt({ gt: 0 }).withMessage('id must be a positive integer')
];
