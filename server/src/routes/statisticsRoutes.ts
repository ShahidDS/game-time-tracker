import express from "express";
import {
  userStats,
  gameBasedStats,
} from "../controllers/statisticsController.ts";

const router = express.Router();

router.get("/:id", userStats);
router.get("/:id/:gameId", gameBasedStats);

export default router;
