import React, { useState } from 'react';
import { Tooltip } from './Tooltip';
import { Star, AlertTriangle, ChevronDown, ChevronUp, Download, Filter } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface Competitor {
  id: string;
  name: string;
  price: number;
  change: string;
  metrics: {
    price: number;
    stock: number;
    variety: number;
    delivery: number;
    rating: number;
    market: number;
    promotion: number;
  };
  history?: Array<{ date: string; score: number }>;
}

interface CompetitorsHeatMapProps {
  competitors: Competitor[];
}

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
};

const generateHistory = () => {
  return Array.from({ length: 28 }, (_, i) => ({
    date: new Date(Date.now() - (27 - i) * 24 * 60 * 60 * 1000).toISOString(),
    score: Math.random() * 40 + 60
  }));
};

const getGlobalScore = (metrics: Competitor['metrics']) => {
  return Object.values(metrics).reduce((acc, val) => acc + val, 0) / Object.keys(metrics).length;
};

export function CompetitorsHeatMap({ competitors: initialCompetitors }: CompetitorsHeatMapProps) {
  const competitors = initialCompetitors.map(comp => ({
    ...comp,
    history: generateHistory()
  }));

  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: 'asc' });
  const [scoreFilter, setScoreFilter] = useState(0);
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<'none' | 'tier' | 'price'>('none');

  const metrics = [
    { key: 'price', label: 'Precio' },
    { key: 'stock', label: 'Stock' },
    { key: 'variety', label: 'Variedad' },
    { key: 'delivery', label: 'Entrega' },
    { key: 'rating', label: 'Calificación' },
    { key: 'market', label: 'Mercado' },
    { key: 'promotion', label: 'Promociones' }
  ];

  const getHeatMapColor = (value: number) => {
    if (value >= 80) return 'bg-green-100 text-green-800';
    if (value >= 60) return 'bg-lime-100 text-lime-800';
    if (value >= 40) return 'bg-yellow-100 text-yellow-800';
    if (value >= 20) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedCompetitors = [...competitors]
    .filter(comp => getGlobalScore(comp.metrics) >= scoreFilter)
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      const aValue = sortConfig.key === 'global' 
        ? getGlobalScore(a.metrics)
        : a.metrics[sortConfig.key];
      const bValue = sortConfig.key === 'global'
        ? getGlobalScore(b.metrics)
        : b.metrics[sortConfig.key];

      return sortConfig.direction === 'asc' 
        ? aValue - bValue 
        : bValue - aValue;
    });

  const groupedCompetitors = () => {
    if (groupBy === 'tier') {
      return sortedCompetitors.reduce((acc, comp) => {
        const score = getGlobalScore(comp.metrics);
        const tier = score >= 80 ? 'Top' : score >= 60 ? 'Mid' : 'Bottom';
        return { ...acc, [tier]: [...(acc[tier] || []), comp] };
      }, {} as Record<string, Competitor[]>);
    }
    if (groupBy === 'price') {
      return sortedCompetitors.reduce((acc, comp) => {
        const range = comp.price >= 90 ? 'Premium' : comp.price >= 70 ? 'Standard' : 'Economic';
        return { ...acc, [range]: [...(acc[range] || []), comp] };
      }, {} as Record<string, Competitor[]>);
    }
    return { 'Todos': sortedCompetitors };
  };

  const getBestAndWorst = (metricKey: string) => {
    const sorted = [...competitors].sort((a, b) => b.metrics[metricKey] - a.metrics[metricKey]);
    return {
      best: sorted[0].id,
      worst: sorted[sorted.length - 1].id
    };
  };

  const insights = competitors.map(comp => {
    const score = getGlobalScore(comp.metrics);
    const worstMetric = Object.entries(comp.metrics)
      .reduce((acc, [key, val]) => val < acc.value ? { key, value: val } : acc, { key: '', value: 100 });
    const bestMetric = Object.entries(comp.metrics)
      .reduce((acc, [key, val]) => val > acc.value ? { key, value: val } : acc, { key: '', value: 0 });
    
    return {
      competitor: comp.name,
      score,
      insights: [
        `${score.toFixed(1)}% de score global`,
        `Mejor en ${metrics.find(m => m.key === bestMetric.key)?.label.toLowerCase()} (${bestMetric.value}%)`,
        `Peor en ${metrics.find(m => m.key === worstMetric.key)?.label.toLowerCase()} (${worstMetric.value}%)`
      ]
    };
  });

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as 'none' | 'tier' | 'price')}
            className="border border-secondary/20 rounded-lg px-3 py-2 text-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="none">Sin agrupar</option>
            <option value="tier">Agrupar por Tier</option>
            <option value="price">Agrupar por Precio</option>
          </select>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-secondary" />
            <input
              type="range"
              min="0"
              max="100"
              value={scoreFilter}
              onChange={(e) => setScoreFilter(Number(e.target.value))}
              className="w-32"
            />
            <span className="text-sm text-secondary">
              Score ≥ {scoreFilter}%
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            const csv = [
              ['Competidor', ...metrics.map(m => m.label), 'Score Global'].join(','),
              ...competitors.map(comp => [
                comp.name,
                ...metrics.map(m => comp.metrics[m.key]),
                getGlobalScore(comp.metrics).toFixed(1)
              ].join(','))
            ].join('\n');

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'competitors-analysis.csv';
            a.click();
          }}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-secondary/20 rounded-lg hover:bg-background"
        >
          <Download className="w-5 h-5" />
          Exportar
        </button>
      </div>

      {/* Legend */}
      <div className="bg-white p-4 rounded-lg border border-secondary/10">
        <h3 className="font-medium mb-2">Leyenda</h3>
        <div className="flex gap-4">
          {[
            { range: '80-100%', color: 'bg-green-100' },
            { range: '60-79%', color: 'bg-lime-100' },
            { range: '40-59%', color: 'bg-yellow-100' },
            { range: '20-39%', color: 'bg-orange-100' },
            { range: '0-19%', color: 'bg-red-100' }
          ].map(item => (
            <div key={item.range} className="flex items-center gap-2">
              <div className={`w-4 h-4 ${item.color} rounded`} />
              <span className="text-sm text-secondary">{item.range}</span>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-secondary">Mejor valor</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-secondary">Peor valor</span>
          </div>
        </div>
      </div>

      {/* Heat Map */}
      <div className="overflow-x-auto">
        {Object.entries(groupedCompetitors()).map(([group, comps]) => (
          <div key={group} className="mb-6">
            {group !== 'Todos' && (
              <h3 className="font-medium text-lg mb-4">{group}</h3>
            )}
            <table className="w-full">
              <thead>
                <tr className="bg-background">
                  <th className="px-4 py-2 text-left">Competidor</th>
                  {metrics.map((metric) => (
                    <th 
                      key={metric.key} 
                      className="px-4 py-2 text-center cursor-pointer hover:bg-secondary/5"
                      onClick={() => handleSort(metric.key)}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {metric.label}
                        {sortConfig.key === metric.key && (
                          sortConfig.direction === 'asc' ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </th>
                  ))}
                  <th 
                    className="px-4 py-2 text-center cursor-pointer hover:bg-secondary/5"
                    onClick={() => handleSort('global')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Score Global
                      {sortConfig.key === 'global' && (
                        sortConfig.direction === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comps.map((competitor) => {
                  const globalScore = getGlobalScore(competitor.metrics);
                  return (
                    <React.Fragment key={competitor.id}>
                      <tr 
                        className="border-t border-secondary/10 hover:bg-background/50 cursor-pointer"
                        onClick={() => setSelectedCompetitor(
                          selectedCompetitor === competitor.id ? null : competitor.id
                        )}
                      >
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-secondary/10">
                              <span className="text-sm font-medium text-secondary-dark">
                                {competitor.id}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-secondary-dark">{competitor.name}</p>
                              <div className="h-8 w-20">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={competitor.history}>
                                    <Line
                                      type="monotone"
                                      dataKey="score"
                                      stroke="#9CA3AF"
                                      strokeWidth={1}
                                      dot={false}
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            </div>
                          </div>
                        </td>
                        {metrics.map((metric) => {
                          const value = competitor.metrics[metric.key];
                          const { best, worst } = getBestAndWorst(metric.key);
                          return (
                            <td key={metric.key} className="px-4 py-2">
                              <Tooltip 
                                label={`${value}% - ${metric.label}`}
                              >
                                <div className={`relative mx-auto w-12 h-12 rounded-lg flex items-center justify-center ${getHeatMapColor(value)}`}>
                                  {value}
                                  {competitor.id === best && (
                                    <Star className="absolute -top-2 -right-2 w-4 h-4 text-yellow-500" />
                                  )}
                                  {competitor.id === worst && (
                                    <AlertTriangle className="absolute -bottom-2 -right-2 w-4 h-4 text-red-500" />
                                  )}
                                </div>
                              </Tooltip>
                            </td>
                          );
                        })}
                        <td className="px-4 py-2">
                          <div className={`mx-auto w-16 h-16 rounded-lg flex items-center justify-center ${getHeatMapColor(globalScore)}`}>
                            {globalScore.toFixed(1)}%
                          </div>
                        </td>
                      </tr>
                      {selectedCompetitor === competitor.id && (
                        <tr className="bg-background/50">
                          <td colSpan={metrics.length + 2} className="px-4 py-4">
                            <div className="space-y-4">
                              <h4 className="font-medium">Detalles de {competitor.name}</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {metrics.map((metric) => (
                                  <div 
                                    key={metric.key}
                                    className="bg-white p-4 rounded-lg border border-secondary/10"
                                  >
                                    <h5 className="text-sm text-secondary mb-2">{metric.label}</h5>
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium text-secondary-dark">
                                        {competitor.metrics[metric.key]}%
                                      </span>
                                      <div className="w-32 h-4 bg-background rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-primary"
                                          style={{ width: `${competitor.metrics[metric.key]}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="bg-white p-4 rounded-lg border border-secondary/10">
        <h3 className="font-medium mb-4">Insights</h3>
        <div className="space-y-4">
          {insights.map((item) => (
            <div key={item.competitor} className="flex items-start gap-4">
              <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
              <div>
                <p className="font-medium text-secondary-dark">{item.competitor}</p>
                <ul className="text-sm text-secondary list-disc list-inside">
                  {item.insights.map((insight, i) => (
                    <li key={i}>{insight}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}