
export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen p-4 hidden md:block m-0">
      {/* Sidebar Title */}
      <h2 className="text-2xl font-bold text-pinkyDark mb-6">Dashboard</h2>

      {/* Navigation */}
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">🏠 Home</h3>


      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">👥 Users</h3>

      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">🎮 Games</h3>
      
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">📊 Game Statistics</h3>
    </aside>
  );
}
