import express from 'express';
import { 
  getGames, 
  getGameById, 
  createGame, 
  updateGame, 
  deleteGame, 
  getGameStats,
  getGameDetailedStats 
} from '../controllers/gameController.ts';

const router = express.Router();

router.get('/', getGames);
router.get('/stats', getGameStats);
router.get('/:id', getGameById);
router.get('/:id/stats', getGameDetailedStats);
router.post('/', createGame);
router.put('/:id', updateGame);
router.delete('/:id', deleteGame);

export default router;