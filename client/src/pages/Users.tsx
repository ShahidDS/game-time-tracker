import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import api from '../api/axios';
import { type User } from '../types';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setCurrentUser } = useUser();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Navigate to Games page with user
  const handlePlayGame = (user: User) => {
    setCurrentUser(user);
    navigate(`/games/${user.id}`);
  };

  return (
    <div className="p-6 min-h-[calc(100vh-128px)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold ">Users</h2>
        <button
          onClick={() => navigate('/')} 
          className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 cursor-pointer"
        >
          Add New User
        </button>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div
              key={user.email}
              className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-pinkyDark font-bold">
                    {(user.firstName?.[0] ?? '').toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex flex-row items-center gap-4">
                <p className="font-semibold text-gray-800 dark:text-gray-200 text-center">
                  {user.firstName} {user.lastName}
                </p>
                <button
                  onClick={() => navigate(`/profile/${user.id}`)}
                  className="text-pink-400 font-bold hover:underline cursor-pointer"
                >
                  View
                </button>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                {user.email}
              </p>
              <button
                onClick={() => handlePlayGame(user)}
                className="mt-2 bg-pink-400 text-white px-4 py-2 rounded-lg hover:bg-pink-500 cursor-pointer"
              >
                Log In & Play
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
