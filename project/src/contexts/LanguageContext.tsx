import React, { createContext, useContext, useState } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'login': 'Login',
    
    // Hero Section
    'hero.title': 'Optimize your prices with',
    'hero.subtitle': 'Market Intelligence',
    'hero.description': 'Make decisions based on real-time data. Monitor prices, analyze competitors, and maximize your profits with ApexBuy.',
    'hero.start': 'Start Now',
    'hero.demo': 'View Demo',
    
    // Features Section
    'features.title': 'Everything you need for success',
    'features.subtitle': 'A complete platform for price analysis and management',
    'features.realtime.title': 'Real-Time Analysis',
    'features.realtime.description': 'Monitor price changes and market trends instantly.',
    'features.competitive.title': 'Competitive Analysis',
    'features.competitive.description': 'Compare your prices with competitors and stay competitive.',
    'features.alerts.title': 'Smart Alerts',
    'features.alerts.description': 'Receive notifications about important market changes.',
    
    // Preview Section
    'preview.title': 'An experience designed for you',
    'preview.subtitle': 'Discover all the tools we have for your business',
    'preview.search.title': 'Advanced Search',
    'preview.search.description': 'Quickly find the products you need to analyze with smart filters.',
    'preview.trends.title': 'Market Trends',
    'preview.trends.description': 'Visualize price trends and make informed decisions.',
    'preview.reports.title': 'Detailed Reports',
    'preview.reports.description': 'Generate comprehensive reports on your products performance.',
    
    // CTA Section
    'cta.title': 'Ready to optimize your prices?',
    'cta.subtitle': 'Join hundreds of companies already using ApexBuy',
    
    // Footer
    'footer.rights': '© 2024 ApexBuy. All rights reserved.',
  },
  es: {
    // Navigation
    'login': 'Iniciar Sesión',
    
    // Hero Section
    'hero.title': 'Optimiza tus precios con',
    'hero.subtitle': 'Inteligencia de Mercado',
    'hero.description': 'Toma decisiones basadas en datos en tiempo real. Monitorea precios, analiza competidores y maximiza tus ganancias con ApexBuy.',
    'hero.start': 'Comenzar Ahora',
    'hero.demo': 'Ver Demo',
    
    // Features Section
    'features.title': 'Todo lo que necesitas para el éxito',
    'features.subtitle': 'Una plataforma completa para el análisis y gestión de precios',
    'features.realtime.title': 'Análisis en Tiempo Real',
    'features.realtime.description': 'Monitorea cambios de precios y tendencias del mercado al instante.',
    'features.competitive.title': 'Análisis Competitivo',
    'features.competitive.description': 'Compara tus precios con la competencia y mantente siempre competitivo.',
    'features.alerts.title': 'Alertas Inteligentes',
    'features.alerts.description': 'Recibe notificaciones sobre cambios importantes en el mercado.',
    
    // Preview Section
    'preview.title': 'Una experiencia diseñada para ti',
    'preview.subtitle': 'Descubre todas las herramientas que tenemos para tu negocio',
    'preview.search.title': 'Búsqueda Avanzada',
    'preview.search.description': 'Encuentra rápidamente los productos que necesitas analizar con filtros inteligentes.',
    'preview.trends.title': 'Tendencias de Mercado',
    'preview.trends.description': 'Visualiza las tendencias de precios y toma decisiones informadas.',
    'preview.reports.title': 'Reportes Detallados',
    'preview.reports.description': 'Genera informes completos sobre el rendimiento de tus productos.',
    
    // CTA Section
    'cta.title': '¿Listo para optimizar tus precios?',
    'cta.subtitle': 'Únete a cientos de empresas que ya están usando ApexBuy',
    
    // Footer
    'footer.rights': '© 2024 ApexBuy. Todos los derechos reservados.',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}