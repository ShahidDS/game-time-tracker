import express from 'express';
import { userStats } from '../controllers/statisticsController.ts';

const router = express.Router();

router.get('/:id', userStats);

export default router;