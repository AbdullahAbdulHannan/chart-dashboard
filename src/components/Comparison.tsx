import React from 'react';
import { ComparisonFilters } from './ComparisonFilters';
import ComparisonMetrics from './ComparisonMetrics';
import { DisplayOptions, ComparisonPlatform } from '../types';

interface ComparisonProps {
  displayOptions: DisplayOptions;
  setDisplayOptions: (options: DisplayOptions) => void;
  availablePlatforms: { id: string; name: string; }[];
  comparePlatform: ComparisonPlatform[];
}

export const Comparison: React.FC<ComparisonProps> = ({
  displayOptions,
  setDisplayOptions,
  availablePlatforms,
  comparePlatform
}) => {
  return (
    <div className="flex-1">
      <ComparisonFilters
        selectedPlatforms={displayOptions.comparisonPlatforms}
        setSelectedPlatforms={(platforms) =>
          setDisplayOptions(prev => ({ ...prev, comparisonPlatforms: platforms }))
        }
        selectedCharts={displayOptions.comparisonCharts}
        setSelectedCharts={(charts) =>
          setDisplayOptions(prev => ({ ...prev, comparisonCharts: charts }))
        }
        availablePlatforms={availablePlatforms}
      />
      {comparePlatform.map((platform, i) => (
        <ComparisonMetrics
          key={i}
          data={platform}
          selectedPlatforms={displayOptions.comparisonPlatforms}
          selectedCharts={displayOptions.comparisonCharts}
        />
      ))}
    </div>
  );
};