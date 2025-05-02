import { useGoogleLogin } from '@react-oauth/google';
import { BarChart3, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface LoginPageProps {
  onLogin: (token: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [error, setError] = useState<string | null>(null);

  const validateEmail = async (accessToken: string) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      const data = await response.json();
      
      if (data.email?.endsWith('@ceser.com.co')) {
        onLogin(accessToken);
      } else {
        setError('Solo se permite el acceso con correo corporativo @ceser.com.co');
      }
    } catch (err) {
      setError('Error al validar el correo electrónico');
    }
  };

  const login = useGoogleLogin({
    onSuccess: response => validateEmail(response.access_token),
    onError: () => setError('Error al iniciar sesión con Google'),
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="flex items-center justify-center gap-3 mb-8">
          <BarChart3 className="w-10 h-10 text-primary" />
          <h1 className="text-2xl font-bold text-secondary-dark">ApexBuy Análisis</h1>
        </div>
        
        <div className="text-center mb-8">
          <p className="text-secondary mb-2">
            Accede a tu dashboard para analizar precios y competidores en tiempo real
          </p>
          <p className="text-xs text-primary">
            *Solo para usuarios con correo @ceser.com.co
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={() => {
            setError(null);
            login();
          }}
          className="w-full flex items-center justify-center gap-3 bg-white border border-secondary/20 text-secondary-dark rounded-lg px-4 py-3 hover:bg-background transition-colors"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Iniciar sesión con Google
        </button>

        <p className="mt-4 text-xs text-secondary text-center">
          Al iniciar sesión, aceptas nuestros términos y condiciones de uso
        </p>
      </div>
    </div>
  );
}