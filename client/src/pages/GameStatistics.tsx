import BarChart from "../components/BarChart";
import TopPlayersTable from "../components/TopPlayersTable";

import "chart.js/auto";
import { defaults } from "chart.js";
import api from "../api/axios";
import { useState, useEffect } from "react";

defaults.maintainAspectRatio = false;
defaults.responsive = true;
interface GameId {
  id: number;
}
interface GameData {
  game: {
    name: string;
    totalMinutesPlayedbyAll: number;
  };
}
interface TopPlayers {
  gameName: string;
  topPlayerName: string;
  totalMinutesPlayed: number;
}

export default function GameStatistics() {
  const chartColors = ["#f15bb5", "#00A6F4", "#8457F6", "#00bb72"];
  const [gameIds, setGameIds] = useState<number[]>([]);
  const [games, setGames] = useState<{ game: string; totalMinutes: number }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topPlayers, setTopPlayers] = useState<TopPlayers[]>([]);

  const fetchGameIds = async () => {
    const response = await api.get<GameId[]>("/games");
    const ids = response.data.map((game) => game.id);
    setGameIds(ids);
    console.log("Fetched Game IDs:", ids);
    return ids;
  };
  const fetchGames = async () => {
    try {
      const dataForEachGame = gameIds.map(async (gameId) => {
        const gameResponse = await api.get<GameData>(
          `/statistics/games/${gameId}`
        );
        return {
          game: gameResponse.data.game.name,
          totalMinutes: gameResponse.data.game.totalMinutesPlayedbyAll,
        };
      });
      const resolvedData = await Promise.all(dataForEachGame);
      setGames(resolvedData);
      console.log("Game Data:", resolvedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch games");
    } finally {
      setLoading(false);
    }
  };

  const fetchTopPlayers = async () => {
    try {
      const dataForEachGame = gameIds.map(async (gameId) => {
        const topPlayerResponse = await api.get<TopPlayers>(
          `/statistics/topPlayer/${gameId}`
        );
        return topPlayerResponse.data;
      });
      const resolvedTopPlayers = await Promise.all(dataForEachGame);
      setTopPlayers(resolvedTopPlayers);
      console.log("Top Players Data:", resolvedTopPlayers);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch top players"
      );
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchGameIds();
    };
    loadData();
  }, []);

  useEffect(() => {
    if (gameIds.length > 0) {
      fetchGames();
      fetchTopPlayers();
    }
  }, [gameIds]);

  if (loading) {
    return <div className="p-6">Loading game statistics...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-pink-500">
        Game Statistics:
      </h1>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md h-[340px] mb-6">
        <BarChart sessions={games} colors={chartColors} />
      </div>

      <h2 className="text-2xl font-bold mb-4 text-pink-500">Leaderboard:</h2>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md">
        <TopPlayersTable topPlayers={topPlayers} />
      </div>
    </div>
  );
}
