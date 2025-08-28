import { Router } from 'express';
import {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  getMyApplications,
} from '../controllers/applicationController';
import { auth } from '../middleware/auth';

const router = Router();

// Public route - Submit application (no auth required)
router.post('/', createApplication);

// Protected routes (require authentication)
router.get('/my-applications', auth, getMyApplications);

// Public list for homepage widgets (approved/limited via query params)
router.get('/', getApplications);
router.get('/:id', auth, getApplicationById);
router.put('/:id', auth, updateApplication);
router.delete('/:id', auth, deleteApplication);

export default router;
