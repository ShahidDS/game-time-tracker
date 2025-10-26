import { NavLink, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Sidebar() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useUser();

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/users');
  };

  // Helper to apply active styles
  const linkClass = (isActive: boolean) =>
    `px-4 py-2 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-500 ${
      isActive
        ? 'bg-blue-200 dark:bg-blue-400 text-white'
        : 'text-gray-800 dark:text-gray-200'
    }`;

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen p-4 hidden md:flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-pinkyDark mb-6">Dashboard</h2>

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

          {/* Conditional links for logged-in user */}
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
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded-lg hover:bg-pink-100 dark:hover:bg-gray-700 ${
                    isActive
                      ? 'bg-sky-500 dark:bg-sky -600 text-white'
                      : 'text-gray-800 dark:text-gray-200'
                  }`
                }
              >
                {currentUser.profileImage ? (
                  <img
                    src={currentUser.profileImage}
                    alt={currentUser.firstName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-pinkyDark text-white font-bold">
                    {currentUser.firstName[0].toUpperCase()}
                  </span>
                )}
                <span className="text-gray-800 dark:text-gray-200">
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
