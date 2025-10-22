import { useState, useEffect } from 'react';

export default function Weather() {
  const [city, setCity] = useState('Stockholm');
  const [weather, setWeather] = useState('Loading...');

  const fetchWeather = async (city: string) => {
    try {
      const res = await fetch(`https://wttr.in/${city}?format=3`);
      const text = await res.text();
      setWeather(`📍 ${text}`);
    } catch {
      setWeather('⚠️ Weather unavailable');
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const handleSearch = () => {
    const trimmedCity = city.trim();
    if (!trimmedCity) return alert('Please enter a city!');
    fetchWeather(trimmedCity);
  };

  return (
    <div className="p-4 bg-black rounded shadow mb-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2 text-blue-300 text-center">
        Weather in {city}
      </h2>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-400 text-white px-4 rounded hover:bg-blue-400"
        >
          Get Weather
        </button>
      </div>
      <p className="text-center font-medium">{weather}</p>
    </div>
  );
}
