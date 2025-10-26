import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

type Game = {
  id: string;
  name: string;
};

export default function Games() {
  const { userId } = useParams<{ userId: string }>();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await api.get('/games');
        setGames(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch games');
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const handleSelectGame = (gameId: string, gameName: string) => {
    navigate(`/games/session/${gameId}/${userId}`, { state: { gameName } });
  };

  if (loading) return <p>Loading games...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-pinkyDark mb-6">Select Game 🎯</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => handleSelectGame(game.id, game.name)}
            className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 text-center hover:bg-pink-100 dark:hover:bg-gray-700 transition"
          >
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {game.name}
            </h3>
          </button>
        ))}
      </div>
    </div>
  );
}
