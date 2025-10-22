import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      <div className="flex flex-1 ">
        {/* Sidebar */}
        <Sidebar />
      </div>
      {/* Main content */}
        <main className="flex-1 p-6 min-h-[calc(100vh-128px)]">
          {/* Your main content goes here */}
        </main>

    </div>
  );
};

export default App