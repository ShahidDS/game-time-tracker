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

  // Timer
  useEffect(() => {
    if (stopped) return;
    const interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [stopped]);

  // Handle stop
  const handleStop = async () => {
    setStopped(true);

    try {
      if (userId && gameId) {
        const now = new Date();

        // Calculate start and end time
        const startedAt = new Date(now.getTime() - seconds * 1000);
        const endedAt = new Date(startedAt.getTime() + seconds * 60000);

        // ✅ Store the API response
        const res = await api.post(`/sessions`, {
          userId: Number(userId),
          gameId: Number(gameId),
          startedAt,
          endedAt,
        });

        console.log('Play session saved successfully');

        // ✅ Navigate with recent session
        navigate(`/profile/${userId}`, {
          state: {
            recentSession: res.data.session,
          },
        });
      } else {
        navigate(`/profile/${userId}`);
      }
    } catch (err) {
      console.error('Failed to save session:', err);
      navigate(`/profile/${userId}`);
    }
  };

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
        <button
          onClick={handleStop}
          className="ml-4 bg-pinkyDark text-white px-4 py-2 rounded-lg hover:bg-pink-600"
        >
          Stop
        </button>
      </div>

      {/* User info */}
      {user && (
        <div className="fixed bottom-6 right-6 flex items-center gap-2 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-3">
          <img
            src={user.profileImage ?? ''}
            alt={user.firstName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <p className="font-semibold text-white">
            {user.firstName} {user.lastName}
          </p>
        </div>
      )}
    </div>
  );
}
