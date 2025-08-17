import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import ComponentDemo from './pages/ComponentDemo';
import './index.css'; // Make sure your Tailwind CSS is imported

function App() {
  return (
    <ThemeProvider>
      <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <ComponentDemo />
      </div>
    </ThemeProvider>
  );
}

export default App;