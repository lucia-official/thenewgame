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

      {/* === Main Game Component === */}
      <NewIdolGame />
    </div>
  );
}

export default App;
