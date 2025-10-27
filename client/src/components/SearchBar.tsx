import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

type UserPreview = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImage?: string | null;
};

interface Props {
  placeholder?: string;
  onSelect?: (user: UserPreview) => void;
}

export default function SearchBar({
  placeholder = "Search users...",
  onSelect,
}: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserPreview[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 1) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    timeoutRef.current = window.setTimeout(async () => {
      try {
        const res = await api.get(`/users?search=${encodeURIComponent(query)}`);
        setResults(res.data || []);
        setOpen(true);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [query]);

  const handleSelect = (user: UserPreview) => {
    setQuery("");
    setOpen(false);
    if (onSelect) {
      onSelect(user);
    } else {
      navigate(`/profile/${user.id}`);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <div className="relative">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length) setOpen(true);
          }}
          placeholder={placeholder}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 w-full"
        />

        {/* search icon on the right */}
        <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
          {loading ? (
            <div className="w-5 h-5 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              className="w-5 h-5 text-pinkyDark"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 110-15 7.5 7.5 0 010 15z"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-blue-300 rounded-lg shadow-lg overflow-hidden">
          <ul className="divide-y">
            {results.map((u) => (
              <li
                key={u.id}
                onClick={() => handleSelect(u)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-pinky/30 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {u.profileImage ? (
                    <img
                      src={u.profileImage}
                      alt={`${u.firstName} ${u.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm text-pinky-600 font-semibold">
                      {((u.firstName || "")[0] ?? "").toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-blue-400 truncate">
                    {u.firstName || ""} {u.lastName || ""}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {u.email}
                  </div>
                </div>
                <div className="text-xs text-pink-400">View</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No results dropdown */}
      {open && !loading && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm text-gray-600">
          No users found
        </div>
      )}
    </div>
  );
}
