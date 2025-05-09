import { useGoogleLogin } from '@react-oauth/google';
import { BarChart3, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface LoginPageProps {
  onLogin: (token: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = async (accessToken: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener información del usuario');
      }

      const data = await response.json();
      
      // Aquí puedes ajustar el dominio según tus necesidades
      const allowedDomains = ['ceser.com.co', 'gmail.com']; // Añade los dominios permitidos
      const emailDomain = data.email.split('@')[1];

      if (allowedDomains.includes(emailDomain)) {
        onLogin(accessToken);
      } else {
        setError('Correo electrónico no autorizado');
      }
    } catch (err) {
      setError('Error al validar el correo electrónico');
    } finally {
      setIsLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: response => validateEmail(response.access_token),
    onError: () => setError('Error al iniciar sesión con Google'),
    flow: 'implicit'
  });

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
          onClick={() => login()}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-secondary/20 text-secondary-dark rounded-lg px-4 py-3 hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!isLoading && <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />}
          {isLoading ? 'Cargando...' : 'Iniciar sesión con Google'}
        </button>

        <p className="mt-4 text-xs text-secondary text-center">
          Al iniciar sesión, aceptas nuestros términos y condiciones
        </p>
      </div>
    </div>
  );
}