import express from 'express';
import {
  createPlaySession,
  getAllPlaySessions,
  getPlaySessionByUserId,
  deletePlaySession,
} from '../controllers/playSessionController.ts';

const router = express.Router();

router.post('/', createPlaySession);
router.get('/', getAllPlaySessions);
router.get('/:userId', getPlaySessionByUserId);
router.delete('/:id', deletePlaySession);

export default router;
