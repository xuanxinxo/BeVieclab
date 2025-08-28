import { Router } from 'express';
import {
  getHirings,
  getHiringById,
  createHiring,
  updateHiring,
  deleteHiring,
} from '../controllers/hiringController';
import { auth } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getHirings);
router.get('/:id', getHiringById);

// Protected routes (require authentication)
router.post('/', auth, createHiring);
router.put('/:id', auth, updateHiring);
router.delete('/:id', auth, deleteHiring);

export default router;
