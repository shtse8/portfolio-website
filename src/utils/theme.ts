// Functions for managing theme state
export const getThemePreference = (): 'dark' | 'light' | 'system' => {
  // Check if we're on the client side
  if (typeof window === 'undefined') return 'system';
  
  // Check for saved preference
  const savedPreference = localStorage.getItem('themePreference') as 'dark' | 'light' | 'system' | null;
  
  if (savedPreference && ['dark', 'light', 'system'].includes(savedPreference)) {
    return savedPreference;
  }
  
  return 'system';
};

export const applyTheme = (theme: 'dark' | 'light' | 'system'): void => {
  // Save the preference
  if (typeof window !== 'undefined') {
    localStorage.setItem('themePreference', theme);
  }
  
  // Apply the theme
  if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

// Initialize theme
export const initTheme = (): void => {
  const preference = getThemePreference();
  applyTheme(preference);
  
  // Add listener for system theme changes if using system preference
  if (preference === 'system' && typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent): void => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
  }
}; 