import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { type User } from '../types';
import BarChart from '../components/BarChart';
import DoughnutChart from '../components/DoughnutChart';
import 'chart.js/auto';
import { defaults } from 'chart.js/auto';

defaults.maintainAspectRatio = false;
defaults.responsive = true;

type PlaySession = {
  gameId: string;
  minutesPlayed: number;
  date: string;
  game?: {
    id: string;
    name: string;
  };
};

export default function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<PlaySession[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const chartColors = [
    '#f15bb5',
    '#00A6F4',
    '#8457F6',
    '#00bb72',
    '#fee440',
    '#ff6f59',
    '#4361ee',
    '#48cae4',
    '#ff9f1c',
    '#80ed99',
  ];

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${userId}`);
        setUser(res.data);
      } catch {
        setError('Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const fetchSessions = async () => {
      try {
        const res = await api.get(`/sessions/${userId}`);
        setSessions(res.data);
      } catch {
        setError('Failed to fetch sessions');
      }
    };
    fetchSessions();
  }, [userId]);

  if (loading)
    return <p className="text-center text-gray-500">Loading profile...</p>;
  if (!user) return <p className="text-center text-gray-500">User not found</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  const gameTotals = sessions.reduce<Record<string, number>>((acc, s) => {
    const gameName = s.game?.name || `Game ${s.gameId}`;
    acc[gameName] = (acc[gameName] || 0) + s.minutesPlayed;
    return acc;
  }, {});

  const combinedSessions = Object.entries(gameTotals).map(([game, total]) => ({
    game,
    totalMinutes: total,
  }));

  const totalMinutes = Object.values(gameTotals).reduce((a, b) => a + b, 0);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Info & BarChart */}
        <div className="flex flex-col items-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md">
          <img
            src={user.profileImage || '/default-avatar.png'}
            alt={user.firstName}
            className="w-24 h-24 rounded-full object-cover mb-3"
          />
          <h1 className="text-3xl font-bold text-center mb-1 text-pink-500">
            {user.firstName} {user.lastName}'s Profile
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md h-[300px]">
          {combinedSessions.length > 0 ? (
            <BarChart sessions={combinedSessions} colors={chartColors} />
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center mt-20">
              No sessions to display
            </p>
          )}
        </div>

        {/* DoughnutChart & Summary + Buttons */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md h-[400px] flex items-center justify-center">
          {combinedSessions.length > 0 ? (
            <DoughnutChart sessions={combinedSessions} colors={chartColors} />
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center">
              No data available for chart
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md flex flex-col items-center justify-center">
          {combinedSessions.length > 0 ? (
            <>
              <h2 className="text-pink-500 text-7xl mb-2">{totalMinutes}</h2>
              <p className="text-sm dark:text-gray-400 mb-6">
                Total minutes played 
              </p>
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              No play sessions recorded yet.
            </p>
          )}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/users')}
              className="bg-pink-400 text-white px-4 py-2 rounded-2xl hover:bg-pink-500"
            >
              View Users
            </button>
            <button
              onClick={() => navigate(`/games/${userId}`)}
              className="bg-violet-500 text-white px-4 py-2 rounded-2xl hover:bg-violet-600"
            >
              Go to Games
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
