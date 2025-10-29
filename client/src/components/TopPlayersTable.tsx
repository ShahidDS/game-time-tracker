interface TopPlayersTableProps {
  topPlayers: {
    gameName: string;
    topPlayerName: string;
    totalMinutesPlayed: number;
  }[];
}

export default function TopPlayersTable({ topPlayers }: TopPlayersTableProps) {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    let timeString = "";

    if (hours > 0) {
      timeString += `${hours} hour${hours !== 1 ? "s" : ""} `;
    }
    if (minutes > 0) {
      timeString += `${minutes} minute${minutes !== 1 ? "s" : ""} `;
    }
    if (remainingSeconds > 0) {
      timeString += `${remainingSeconds} second${
        remainingSeconds !== 1 ? "s" : ""
      }`;
    }

    return timeString.trim() || "0 seconds";
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Game
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Time Played
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
          {topPlayers.map((player, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {player.topPlayerName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {player.gameName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {formatTime(player.totalMinutesPlayed)}{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
