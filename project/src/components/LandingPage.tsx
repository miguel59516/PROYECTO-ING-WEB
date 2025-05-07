import React from 'react';
import { BarChart3, ArrowRight, LineChart, Users, Bell, Search, Package, DollarSign, Shield, Zap, TrendingUp, BarChart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface LandingPageProps {
  onEnterDashboard: () => void;
}

export function LandingPage({ onEnterDashboard }: LandingPageProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <nav className="bg-white border-b border-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-secondary-dark">ApexBuy</span>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <button
                onClick={onEnterDashboard}
                className="px-4 py-2 text-primary hover:text-primary-dark transition-colors"
              >
                {t('login')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center lg:text-left lg:flex lg:items-center lg:gap-12">
            <div className="lg:flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold text-secondary-dark leading-tight mb-6">
                {t('hero.title')}
                <span className="text-primary block">{t('hero.subtitle')}</span>
              </h1>
              <p className="text-xl text-secondary mb-8 max-w-2xl">
                {t('hero.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={onEnterDashboard}
                  className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors"
                >
                  {t('hero.start')}
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={onEnterDashboard}
                  className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-medium rounded-lg text-secondary-dark border border-secondary/20 hover:bg-white transition-colors"
                >
                  {t('hero.demo')}
                </button>
              </div>
            </div>
            <div className="hidden lg:block lg:flex-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
                <img
                  src="https://images.pexels.com/photos/7681091/pexels-photo-7681091.jpeg"
                  alt="Dashboard Preview"
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-dark mb-4">{t('features.title')}</h2>
            <p className="text-xl text-secondary">{t('features.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-background rounded-xl p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <LineChart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-dark mb-2">{t('features.realtime.title')}</h3>
              <p className="text-secondary">{t('features.realtime.description')}</p>
            </div>

            <div className="bg-background rounded-xl p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-dark mb-2">{t('features.competitive.title')}</h3>
              <p className="text-secondary">{t('features.competitive.description')}</p>
            </div>

            <div className="bg-background rounded-xl p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-dark mb-2">{t('features.alerts.title')}</h3>
              <p className="text-secondary">{t('features.alerts.description')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary-dark mb-4">{t('preview.title')}</h2>
            <p className="text-xl text-secondary">{t('preview.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Search className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-secondary-dark mb-2">{t('preview.search.title')}</h3>
                    <p className="text-secondary">{t('preview.search.description')}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-secondary-dark mb-2">{t('preview.trends.title')}</h3>
                    <p className="text-secondary">{t('preview.trends.description')}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-secondary-dark mb-2">{t('preview.reports.title')}</h3>
                    <p className="text-secondary">{t('preview.reports.description')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="bg-white p-6 rounded-xl shadow-xl">
                <div className="aspect-w-16 aspect-h-9 bg-background rounded-lg overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/7681101/pexels-photo-7681101.jpeg"
                    alt="Dashboard Features"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">{t('cta.title')}</h2>
            <p className="text-xl text-white/80 mb-8">{t('cta.subtitle')}</p>
            <button
              onClick={onEnterDashboard}
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-medium rounded-lg text-primary bg-white hover:bg-white/90 transition-colors"
            >
              {t('hero.start')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-secondary-dark">ApexBuy</span>
            </div>
            <p className="text-secondary">{t('footer.rights')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}