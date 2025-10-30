/* eslint-disable react-hooks/exhaustive-deps */
import BarChart from "../components/BarChartAll";
import TopPlayersTable from "../components/TopPlayersTable";
import LineChart from "../components/LineChart";
import ScatterChart from "../components/ScatterChart";
import "chart.js/auto";
import { defaults } from "chart.js";
import api from "../api/axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

interface Game {
  id: number;
  name: string;
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
interface DailyPlayTime {
  date: string;
  minutes: number;
}
interface WeeklyStatsResponse {
  weeklyStats: {
    numOfSessionsPerWeek: number;
    averageSessionLengthPerWeek: number;
    totalMinutesPerWeek: number;
    minutesPlayedPerDayInAWeek: DailyPlayTime[];
  };
}

interface UserInfo {
  id: number;
  firstName?: string;
  lastName?: string;
}

interface AllUserWeeklyStat {
  userId: number;
  username: string;
  numOfSessionsPerWeek: number;
  averageSessionLengthPerWeek: number;
  isCurrentUser: boolean;
}

interface AllUserDailyPlayTime {
  userId: number;
  username: string;
  dailyPlayTime: DailyPlayTime[];
}

export default function GameStatistics() {
  const { userId } = useParams<{ userId: string }>();
  const numericUserId = userId ? Number(userId) : 0;

  const chartColors = ["#f15bb5", "#00A6F4", "#8457F6", "#00bb72"];
  const [gameIds, setGameIds] = useState<number[]>([]);
  const [games, setGames] = useState<{ game: string; totalMinutes: number }[]>(
    []
  );
  const [usersInfo, setUsersInfo] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topPlayers, setTopPlayers] = useState<TopPlayers[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [gameOptions, setGameOptions] = useState<Game[]>([]);
  const [dailyPlayTime, setDailyPlayTime] = useState<DailyPlayTime[]>([]);

  const [selectedScatterGameId, setSelectedScatterGameId] = useState<
    number | null
  >(null);

  const [scatterWeeklyStats, setScatterWeeklyStats] = useState<
    AllUserWeeklyStat[]
  >([]);

  const [allUsersDailyPlayTime, setAllUsersDailyPlayTime] = useState<
    AllUserDailyPlayTime[]
  >([]);

  const fetchGameIds = async () => {
    const response = await api.get<Game[]>("/games");
    const ids = response.data.map((game) => game.id);
    setGameIds(ids);
    setGameOptions(response.data);

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

  const fetchDailyPlayTime = async (gameId: number) => {
    if (!numericUserId) return;
    try {
      const response = await api.get<WeeklyStatsResponse>(
        `/statistics/${numericUserId}/${gameId}`
      );
      const dailyData = response.data.weeklyStats.minutesPlayedPerDayInAWeek;
      console.log("Daily Play Time Data (current user):", dailyData);
      setDailyPlayTime(dailyData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch daily play time"
      );
    }
  };

  const fetchAllUsers = async () => {
    try {
      const response = await api.get<UserInfo[]>("/users");
      const usersInfo = response.data.map((user) => ({
        id: user.id,
        firstName: user.firstName ?? `User ${user.id}`,
        lastName: user.lastName ?? `User ${user.id}`,
      }));
      setUsersInfo(usersInfo);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch users information"
      );
    }
  };

  const fetchScatterWeeklyStats = async (gameId: number) => {
    try {
      const users = usersInfo;
      const statsResults = await Promise.allSettled(
        users.map(async (user) => {
          const resp = await api.get<WeeklyStatsResponse>(
            `/statistics/${user.id}/${gameId}`
          );
          const ws = resp.data.weeklyStats;
          return {
            userId: user.id,
            username: user.firstName ?? user.lastName ?? `User ${user.id}`,
            numOfSessionsPerWeek: ws.numOfSessionsPerWeek,
            averageSessionLengthPerWeek: ws.averageSessionLengthPerWeek,
            isCurrentUser: user.id === numericUserId,
          } as AllUserWeeklyStat;
        })
      );

      const weeklyStats: AllUserWeeklyStat[] = statsResults
        .filter(
          (r): r is PromiseFulfilledResult<AllUserWeeklyStat> =>
            r.status === "fulfilled"
        )
        .map((r) => r.value);

      console.log("Weekly Stats:", weeklyStats);

      setScatterWeeklyStats(weeklyStats);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch scatter chart data"
      );
    }
  };

  const fetchAllUsersDailyPlayTime = async (gameId: number) => {
    try {
      const users = usersInfo;
      const results = await Promise.allSettled(
        users.map(async (user) => {
          const resp = await api.get<WeeklyStatsResponse>(
            `/statistics/${user.id}/${gameId}`
          );
          const daily = resp.data.weeklyStats.minutesPlayedPerDayInAWeek;
          return {
            userId: user.id,
            username: user.firstName ?? user.lastName ?? `User ${user.id}`,
            dailyPlayTime: daily,
          } as AllUserDailyPlayTime;
        })
      );

      const usersDaily: AllUserDailyPlayTime[] = results
        .filter(
          (r): r is PromiseFulfilledResult<AllUserDailyPlayTime> =>
            r.status === "fulfilled"
        )
        .map((r) => r.value);

      console.log("All users daily play time:", usersDaily);
      setAllUsersDailyPlayTime(usersDaily);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch all users daily play time"
      );
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchGameIds();
      await fetchAllUsers();
    };
    loadData();
  }, []);

  useEffect(() => {
    if (gameIds.length > 0) {
      fetchGames();
      fetchTopPlayers();
    }
  }, [gameIds]);

  useEffect(() => {
    if (selectedGameId !== null) {
      fetchDailyPlayTime(selectedGameId);

      fetchAllUsersDailyPlayTime(selectedGameId);
    }
  }, [selectedGameId, usersInfo]);

  useEffect(() => {
    if (selectedScatterGameId !== null) {
      fetchScatterWeeklyStats(selectedScatterGameId);
    }
  }, [selectedScatterGameId]);

  if (loading) {
    return <div className="p-6">Loading game statistics...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-pink-500">Game Statistics</h1>

      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md h-[340px] mb-6">
        <BarChart sessions={games} colors={chartColors} />
      </div>

      {/* Leaderboard */}
      <h2 className="text-2xl font-bold mb-4 text-pink-500">Leaderboard:</h2>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md mb-6">
        <TopPlayersTable topPlayers={topPlayers} />
      </div>
      {/*  Scatter Chart Section */}
      <h2 className="text-2xl font-bold mb-4 text-pink-500">
        Weekly Session Statistics:
      </h2>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md mb-6">
        {/* Dropdown */}
        <div className="flex justify-end mb-4">
          <select
            value={selectedScatterGameId ?? ""}
            onChange={(e) => setSelectedScatterGameId(Number(e.target.value))}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="">Select a Game</option>
            {gameOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {/* Scatter Chart */}
        {selectedScatterGameId ? (
          <ScatterChart weeklyStats={scatterWeeklyStats} />
        ) : (
          <div className="text-gray-500 text-center py-10">
            Please select a game
          </div>
        )}
      </div>

      {/* Line Chart */}
      {/* Daily Play Time */}
      <h2 className="text-2xl font-bold mb-4 text-pink-500">
        Daily Play Time:
      </h2>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md mb-6">
        {/*Dropdown to select game */}
        <div className="flex justify-end mb-4">
          <select
            value={selectedGameId ?? ""}
            onChange={(e) => setSelectedGameId(Number(e.target.value))}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="">Select a Game</option>
            {gameOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>

        {selectedGameId === null ? (
          <div className="text-gray-500 text-center py-10">
            Please select a game
          </div>
        ) : !Array.isArray(dailyPlayTime) || dailyPlayTime.length === 0 ? (
          <div className="text-gray-500 text-center py-10">
            This game is not played yet!
          </div>
        ) : (
          <LineChart
            dailyPlayTime={dailyPlayTime}
            usersDailyPlayTime={allUsersDailyPlayTime}
            colors={chartColors}
            currentUserId={numericUserId}
          />
        )}
      </div>
    </div>
  );
}
