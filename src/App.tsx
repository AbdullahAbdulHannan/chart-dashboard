import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Overview } from './components/Overview';
import { Comparison } from './components/Comparison';
import { usePlatformData } from './utils/usePlatformData';
import { DisplayOptions } from './types';
import { Post } from './components/Post';

function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison' |'post'>('overview');
  const platformData = usePlatformData();
  
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    platforms: ['facebook', 'instagram', 'linkedin'],
    showGraphs: true,
    showNumbers: true,
    showTable: true,
    selectedPlatform: 'facebook',
    showAudienceEngagement: true,
    showPostPerformance: true,
    showActionsOnPost: true,
    comparisonPlatforms: ['facebook', 'linkedin', 'instagram'],
    comparisonCharts: ['audience', 'followers', 'actions']
  });

  if (!platformData) {
    return <div>Loading...</div>;
  }

  const { exampleData, comparePlatform, sampleData } = platformData;
  const availablePlatforms = exampleData.map(({ id, name }) => ({ id, name }));
  const filteredData = exampleData.filter(platform =>
    displayOptions.platforms.includes(platform.id)
  );

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'overview' ? (
        <Overview
          displayOptions={displayOptions}
          setDisplayOptions={setDisplayOptions}
          availablePlatforms={availablePlatforms}
          filteredData={filteredData}
          sampleData={sampleData}
        />
      ) :activeTab=='comparison'? (
        <Comparison
          displayOptions={displayOptions}
          setDisplayOptions={setDisplayOptions}
          availablePlatforms={availablePlatforms}
          comparePlatform={comparePlatform}
        />
      ):<Post/>}
    </Layout>
  );
}

export default App;