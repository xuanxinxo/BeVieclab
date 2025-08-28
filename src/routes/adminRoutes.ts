import { Router } from 'express';
import { 
  adminLogin, 
  getAdminProfile 
} from '../controllers/adminController';
import { authLimiter } from '../middleware/rateLimit';
import { adminAuth } from '../middleware/adminAuth';

const router = Router();

// Apply rate limiting to all admin auth endpoints
router.use(authLimiter);

// Admin login
router.post('/login', adminLogin);

// Get current admin profile
router.get('/profile', adminAuth, getAdminProfile);

// User management routes (not implemented yet)

export default router;
