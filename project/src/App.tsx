import React, { useState } from 'react';
import { BarChart3, Bell, Search, Package, DollarSign, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Tooltip } from './components/Tooltip';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ExportButton } from './components/ExportButton';
import { useDebounce } from './hooks/useDebounce';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  if (!showDashboard) {
    return <LandingPage onEnterDashboard={() => setShowDashboard(true)} />;
  }

  return <Dashboard />;
}

export default App;