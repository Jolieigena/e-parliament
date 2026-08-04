import { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { applyTheme, getStoredTheme } from '../../mock/theme';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(getStoredTheme());

  const choose = (next) => {
    if (next === theme) return;
    setTheme(next);
    applyTheme(next);
  };

  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      <button
        type="button"
        className={theme === 'dark' ? 'active' : ''}
        aria-pressed={theme === 'dark'}
        aria-label="Dark mode"
        onClick={() => choose('dark')}
      >
        <Moon size={14} />
      </button>
      <button
        type="button"
        className={theme === 'light' ? 'active' : ''}
        aria-pressed={theme === 'light'}
        aria-label="Light mode"
        onClick={() => choose('light')}
      >
        <Sun size={14} />
      </button>
    </div>
  );
};

export default ThemeToggle;
