import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { type User } from '../types';

export default function GameSession() {
  const { userId, gameId } = useParams<{ userId: string; gameId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [started, setStarted] = useState(false);
  const [sessionStart, setSessionStart] = useState<Date | null>(null);
  const gameName = location.state?.gameName || '';

  // Fetch user info
  useEffect(() => {
    if (!userId) return;
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
    fetchUser();
  }, [userId]);

  // Timer effect
  useEffect(() => {
    if (!started || stopped) return;
    const interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [started, stopped]);

  // Start button handler
  const handleStart = () => {
    setStarted(true);
    setSessionStart(new Date());
    setSeconds(0);
  };

  // Stop button handler
  const handleStop = async () => {
    setStopped(true);

    try {
      if (userId && gameId && sessionStart) {
        const startedAt = sessionStart;
        const endedAt = new Date();

        // Calculate total seconds elapsed
        const totalSeconds = Math.floor(
          (endedAt.getTime() - startedAt.getTime()) / 1000
        );

        // Convert to minutes for backend (round down)
        const minutesPlayed = Math.max(Math.floor(totalSeconds / 60), 0);

        // Post session to backend
        const res = await api.post(`/sessions`, {
          userId: Number(userId),
          gameId: Number(gameId),
          startedAt,
          endedAt,
        });

        console.log('✅ Play session saved successfully:', res.data);

        navigate(`/profile/${userId}`, {
          state: {
            recentSession: res.data.session,
            minutesPlayed,
          },
        });
      } else {
        navigate(`/profile/${userId}`);
      }
    } catch (err) {
      console.error('❌ Failed to save session:', err);
      navigate(`/profile/${userId}`);
    }
  };

  // Format time display
  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min.toString().padStart(2, '0')}:${sec
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="p-6 relative min-h-[calc(100vh-128px)] flex flex-col items-center">
      {/* Game Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 mb-6 flex items-center gap-4 w-full max-w-md">
        <h2 className="text-3xl font-bold text-pinkyDark">{gameName}</h2>
        <p className="text-2xl font-mono ml-auto">{formatTime(seconds)}</p>

        {started ? (
          <button
            onClick={handleStop}
            className="ml-4 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition cursor-pointer"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="ml-4 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition cursor-pointer"
          >
            Start
          </button>
        )}
      </div>

      {/* User Info */}
      {user && (
        <div className="fixed bottom-6 right-6 flex items-center gap-3 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-3">
          <img
            src={user.profileImage ?? ''}
            alt={user.firstName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <p className="font-semibold text-gray-900 dark:text-white">
            {user.firstName} {user.lastName}
          </p>
        </div>
      )}
    </div>
  );
}
