import { Router } from 'express';
import * as ctrl from '../controllers/eventsController';
import { authMiddleware, requireRole } from '../middleware/auth';
import multer from 'multer';
import { createEventValidators, updateEventValidators } from '../middleware/validators';
import { validateRequest } from '../middleware/validate';
const router = Router();

import { FileFilterCallback } from 'multer';

// ...

const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req: any, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype && file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

router.get('/organizer', authMiddleware, requireRole('organizer'), ctrl.listOrganizerEvents);
router.get('/', ctrl.listEvents);
router.get('/:id', ctrl.getEvent);

// Organizer-only
router.post('/', authMiddleware, requireRole('organizer'), createEventValidators, validateRequest, ctrl.createEvent);
router.put('/:id', authMiddleware, requireRole('organizer'), updateEventValidators, validateRequest, ctrl.updateEvent);
router.delete('/:id', authMiddleware, requireRole('organizer'), ctrl.deleteEvent);

// cancel
router.patch('/:id/cancel', authMiddleware, requireRole('organizer'), ctrl.cancelEvent);

// image upload
router.post('/:id/image', authMiddleware, requireRole('organizer'), upload.single('image'), ctrl.uploadImage);

export default router;
