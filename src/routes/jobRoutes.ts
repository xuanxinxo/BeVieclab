import { Router } from 'express';
import { 
  getJobs, 
  getJobById, 
  createJob, 
  updateJob, 
  deleteJob 
} from '../controllers/jobController';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getJobs);
router.get('/:id', getJobById);

// Protected routes (require authentication)
router.post('/', auth, createJob);
router.put('/:id', auth, updateJob);
router.delete('/:id', auth, deleteJob);

export default router;