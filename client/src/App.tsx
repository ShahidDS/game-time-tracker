import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Signup";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import Games from "./pages/Games";
import GameSession from "./pages/GameSession";
import GameStatistics from "./pages/GameStatistics";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />

      <div className="flex flex-1 ">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 p-6 min-h-[calc(100vh-128px)]">
          <Toaster position="top-right" reverseOrder={false} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/games/:userId" element={<Games />} />
            <Route
              path="/games/session/:gameId/:userId"
              element={<GameSession />}
            />
            <Route path="/statistics/:userId" element={<GameStatistics />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
