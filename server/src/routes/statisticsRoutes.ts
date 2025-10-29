import express from "express";
import {
  userStats,
  gameBasedStats,
  gameStatsAllUser,
  gameTopPlayerStats,
} from "../controllers/statisticsController.ts";

const router = express.Router();

router.get("/topPlayer/:gameId", gameTopPlayerStats);
router.get("/games/:gameId", gameStatsAllUser);
router.get("/:id", userStats);
router.get("/:id/:gameId", gameBasedStats);

export default router;
