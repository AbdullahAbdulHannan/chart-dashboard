import React from 'react';
import { Filters } from './Filters';
import { PlatformMetrics } from './PlatformMetrics';
import { DetailedMetrics } from './DetailedMetrics';
import { PostTable } from './Table';
import { DisplayOptions, PlatformData, PostData } from '../types';

interface OverviewProps {
  displayOptions: DisplayOptions;
  setDisplayOptions: (options: DisplayOptions) => void;
  availablePlatforms: { id: string; name: string; }[];
  filteredData: PlatformData[];
  sampleData: Record<string, PostData[]>;
}

export const Overview: React.FC<OverviewProps> = ({
  displayOptions,
  setDisplayOptions,
  availablePlatforms,
  filteredData,
  sampleData
}) => {
  return (
    <>
      <Filters
        options={displayOptions}
        setOptions={setDisplayOptions}
        availablePlatforms={availablePlatforms}
      />

      <div className="mb-12">
        {filteredData.map(platform => (
          <PlatformMetrics
            key={platform.id}
            data={platform}
            showGraphs={displayOptions.showGraphs}
            showNumbers={displayOptions.showNumbers}
          />
        ))}
      </div>

      {displayOptions.showGraphs && filteredData.map(platform => (
        <DetailedMetrics
          key={platform.id}
          data={platform}
          showGraphs={displayOptions.showGraphs}
          options={{
            showAudienceEngagement: displayOptions.showAudienceEngagement,
            showPostPerformance: displayOptions.showPostPerformance,
            showActionsOnPost: displayOptions.showActionsOnPost
          }}
        />
      ))}

      <div className="flex-1">
        {displayOptions.showTable && <h2 className='text-2xl font-semibold my-10'>Performance Metrics</h2>}
        <div className="mb-12">
          {displayOptions.showTable && filteredData.map((platform) => (
            <div key={platform.id} className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <img src={platform.icon} alt={platform.name} className="w-6 h-6" />
                <h3 className="text-lg font-semibold">{platform.name}</h3>
              </div>
              <PostTable data={sampleData[platform.id]} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};