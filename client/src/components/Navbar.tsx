import WeatherWidget from './WeatherWidgit';
import SearchBar from './SearchBar';

export default function Navbar() {
  return (
    <nav className="w-full bg-black  shadow-lg py-4 px-6 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Weather Widget */}
      <div className="order-2 md:order-1 w-full md:w-auto flex justify-center md:justify-start">
        <WeatherWidget />
      </div>

      {/* App Title */}
      <h1 className="order-1 md:order-2 text-4xl font-bold text-pinkyDark text-white font-[Doto] text-center w-full md:w-auto">
        🎮 Game Tracker
      </h1>

      {/* Search Bar */}
      <div className="order-3 w-full md:w-auto flex justify-center md:justify-end">
        <SearchBar />
      </div>
    </nav>
  );
}
