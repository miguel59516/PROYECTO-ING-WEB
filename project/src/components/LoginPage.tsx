import { useState } from 'react';
import { BarChart3, AlertCircle, Github } from 'lucide-react';

interface LoginPageProps {
  onLogin: (token: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI;
    const scope = 'read:user user:email';
    
    const githubUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
    
    window.location.href = githubUrl;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="flex items-center justify-center gap-3 mb-8">
          <BarChart3 className="w-10 h-10 text-primary" />
          <h1 className="text-2xl font-bold text-secondary-dark">ApexBuy</h1>
        </div>
        
        <div className="text-center mb-8">
          <p className="text-secondary mb-2">
            Accede a tu dashboard para analizar precios y competidores
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleGitHubLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-[#24292e] text-white rounded-lg px-4 py-3 hover:bg-[#1b1f23] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Github className="w-5 h-5" />
          {isLoading ? 'Cargando...' : 'Iniciar sesión con GitHub'}
        </button>

        <p className="mt-4 text-xs text-secondary text-center">
          Al iniciar sesión, aceptas nuestros términos y condiciones
        </p>
      </div>
    </div>
  );
}