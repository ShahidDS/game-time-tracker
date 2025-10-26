import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Sidebar() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useUser();

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/users');
  };

  // Unified styles for all NavLinks
  const linkClass = (isActive: boolean) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg font-medium hover:bg-sky-100 dark:hover:bg-sky-500 ${
      isActive
        ? 'bg-sky-400 dark:bg-sky-500 text-white'
        : 'text-gray-800 dark:text-gray-200'
    }`;

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen p-4 hidden md:flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-pink-400 mb-6">Dashboard</h2>

        <nav className="flex flex-col gap-4">
          {/* Always visible links */}
          <NavLink to="/" className={({ isActive }) => linkClass(isActive)}>
            🏠 Home
          </NavLink>

          <NavLink
            to="/users"
            className={({ isActive }) => linkClass(isActive)}
          >
            👥 Users
          </NavLink>

          {/* Links for logged-in user */}
          {currentUser && (
            <>
              <NavLink
                to={`/games/${currentUser.id}`}
                className={({ isActive }) => linkClass(isActive)}
              >
                🎮 Games
              </NavLink>

              <NavLink
                to={`/profile/${currentUser.id}`}
                className={({ isActive }) => linkClass(isActive)}
              >
                {currentUser.profileImage ? (
                  <img
                    src={currentUser.profileImage}
                    alt={currentUser.firstName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="w-8 h-8 flex items-center justify-center rounded-full font-bold">
                    {currentUser.firstName[0].toUpperCase()}
                  </span>
                )}
                <span>
                  {currentUser.firstName} {currentUser.lastName}
                </span>
              </NavLink>
            </>
          )}
        </nav>
      </div>

      {/* Logout button */}
      {currentUser && (
        <button
          type="button"
          onClick={handleLogout}
          className="mt-6 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 w-full"
        >
          🌸 Logout
        </button>
      )}
    </aside>
  );
}
