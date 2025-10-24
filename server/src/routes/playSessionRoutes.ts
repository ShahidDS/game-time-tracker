import express from 'express';
import {
  createPlaySession,
  getAllPlaySessions,
  getUserStats,
  deletePlaySession,
} from '../controllers/playSessionController.ts';

const router = express.Router();

router.post('/', createPlaySession);
router.get('/', getAllPlaySessions);
router.get('/:userId', getUserStats);
router.delete('/:id', deletePlaySession);

export default router;
