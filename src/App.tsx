import { useEffect, useState } from 'react';
import NewIdolGame from './newidolgame';

function App() {
  const [isDark, setIsDark] = useState(false);

  // Load saved theme on first render
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  // Toggle theme manually
  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
    setIsDark(!isDark);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* === Theme Toggle Button === */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="px-3 py-2 rounded-lg bg-blue-500 text-white dark:bg-yellow-400 dark:text-gray-900 font-semibold shadow hover:opacity-90 transition"
        >
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {/* === Main Game Component === */}
      <NewIdolGame />
    </div>
  );
}

export default App;
