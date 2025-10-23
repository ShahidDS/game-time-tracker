import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { type User } from '../types';

export default function Profile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user info
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);


  if (loading)
    return <p className="text-center text-gray-500">Loading profile...</p>;
  if (!user) return <p className="text-center text-gray-500">User not found</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;


  return (
    <div className="p-6">
      {/* User Info */}
      <div className="flex flex-col items-center mb-6">
        <img
          src={user.profileImage || '/default-avatar.png'}
          alt={user.firstName}
          className="w-24 h-24 rounded-full object-cover mb-3"
        />
        <h1 className="text-3xl font-bold text-center mb-1 text-blue-400">
          {user.firstName} {user.lastName}'s Profile
        </h1>
      </div>

      
          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-6">
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
  );
}
