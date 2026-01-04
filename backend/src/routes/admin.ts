import { Router } from 'express';
import { analytics } from '../controllers/adminController';
import { authMiddleware, requireRole } from '../middleware/auth';
const router = Router();

router.get('/analytics', authMiddleware, requireRole('admin'), analytics);

export default router;
