import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Handle GitHub OAuth callback
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');

    if (code) {
      // In a real application, you would exchange this code for an access token
      // using your backend server to keep the client secret secure
      console.log('GitHub auth code:', code);
      setToken(code);
      setIsAuthenticated(true);
      
      // Clean up URL
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  const handleLogin = (accessToken: string) => {
    setToken(accessToken);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <Dashboard />;
}

export default App;