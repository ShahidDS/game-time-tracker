import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '🏠 Home' },
    { path: '/users', label: '👥 Users' },

  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen p-4 hidden md:block m-0">
      {/* Sidebar Title */}
      <h2 className="text-2xl font-bold text-pinkyDark mb-6">Dashboard</h2>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg font-medium hover:bg-blue-100 dark:hover:bg-blue-500 ${
                isActive
                  ? 'bg-blue-200 dark:bg-blue-400 text-white'
                  : 'text-gray-800 dark:text-gray-200'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
