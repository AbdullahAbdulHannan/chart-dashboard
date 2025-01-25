import React, { useState } from 'react';
import { Filters } from './components/Filters';
import { PlatformMetrics } from './components/PlatformMetrics';
import { DetailedMetrics } from './components/DetailedMetrics';
import { PlatformData, DisplayOptions, ComparisonPlatform } from './types';
import { TrendingUp, Info } from 'lucide-react';
import ComparisonMetrics from './components/ComparisonMetrics';
import { ComparisonFilters } from './components/ComparisonFilters';
import { PostTable } from './components/Table';

const exampleData: PlatformData[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png',
    followers: 12345,
    new_following: 567,
    growth: 89012,
    chartData: Array.from({ length: 12 }, (_, i) => ({
      name: `Month ${i + 1}`,
      posts: Math.sin(i * 0.5) * 500 + 1000,
      stories: Math.cos(i * 0.5) * 400 + 800,
      new_following: Math.sin((i + 2) * 0.5) * 300 + 600,
      likes: Math.sin(i * 0.5) * 500 + 1000,
      share: Math.cos(i * 0.5) * 400 + 800,
      comments: Math.sin((i + 2) * 0.5) * 300 + 600
    })),
    donutData: [
      { name: 'Posts', value: 35, color: '#FF5733' },
      { name: 'Stories', value: 45, color: '#3c71e5' },
      { name: 'Reels', value: 20, color: '#5D3FD3' }
    ]
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/512px-Logo_of_Twitter.svg.png',
    followers: 12345,
    new_following: 567,
    growth: 89012,
    chartData: Array.from({ length: 12 }, (_, i) => ({
      name: `Month ${i + 1}`,
      posts: Math.cos(i * 0.5) * 400 + 900,
      stories: Math.sin(i * 0.5) * 300 + 700,
      new_following: Math.cos((i + 2) * 0.5) * 200 + 500,
      likes: Math.sin(i * 0.5) * 500 + 1000,
      share: Math.cos(i * 0.5) * 400 + 800,
      comments: Math.sin((i + 2) * 0.5) * 300 + 600
    })),
    donutData: [
      { name: 'Posts', value: 35, color: '#FF5733' },
      { name: 'Stories', value: 45, color: '#3c71e5' },
      { name: 'Reels', value: 20, color: '#5D3FD3' }
    ]
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/640px-LinkedIn_logo_initials.png',
    followers: 12345,
    new_following: 567,
    growth: 89012,
    chartData: Array.from({ length: 12 }, (_, i) => ({
      name: `Month ${i + 1}`,
      posts: Math.sin(i * 0.5) * 600 + 1100,
      stories: Math.cos(i * 0.5) * 500 + 900,
      new_following: Math.sin((i + 2) * 0.5) * 400 + 700,
      likes: Math.sin(i * 0.5) * 500 + 1000,
      share: Math.cos(i * 0.5) * 400 + 800,
      comments: Math.sin((i + 2) * 0.5) * 300 + 600
    })),
    donutData: [
      { name: 'Posts', value: 35, color: '#FF5733' },
      { name: 'Stories', value: 45, color: '#3c71e5' },
      { name: 'Reels', value: 20, color: '#5D3FD3' }
    ]
  }
];
const sampleData = [
  {
    title: "Summer Vacation Photos",
    engagementScore: 4.5,
    datePosted: "2023-06-15",
    author: "Alice Johnson",
  },
  {
    title: "New Product Launch",
    engagementScore: 4.0,
    datePosted: "2023-07-01",
    author: "Bob Smith",
  },
  {
    title: "Weekly Updates",
    engagementScore: 5.0,
    datePosted: "2023-07-10",
    author: "Charlie Brown",
  },
];
const comparePlatform: ComparisonPlatform[] = [
  {
    donutDataPlatform: [
      { name: 'Facebook', value: 35, color: '#FF5733' },
      { name: 'Linkedin', value: 45, color: 'skyblue' },
      { name: 'Twitter', value: 20, color: '#5D3FD3' }
    ],
    lineDataPlatform: Array.from({ length: 12 }, (_, i) => ({
      name: "Platforms",
      linkedin: Math.sin(i * 0.5) * 600 + 1100,
      facebook: Math.cos(i * 0.5) * 500 + 900,
      twitter: Math.sin((i + 2) * 0.5) * 400 + 700,
    })),
    barDataPlatform: [
      { name: "January", linkedin: 100, facebook: 90, twitter: 70 },
      { name: "February", linkedin: 120, facebook: 110, twitter: 80 },
      { name: "March", linkedin: 140, facebook: 130, twitter: 90 },
    ]
  }
];

const availablePlatforms = exampleData.map(({ id, name }) => ({ id, name }));

function App() {
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    platforms: exampleData.map(p => p.id),
    showGraphs: true,
    showNumbers: true,
    showTable: true,
    selectedPlatform: 'facebook',
    showAudienceEngagement: true,
    showPostPerformance: true,
    showActionsOnPost: true,
    comparisonPlatforms: ['facebook', 'linkedin', 'twitter'],
    comparisonCharts: ['audience', 'followers', 'actions']
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'comparison'>('overview');

  const filteredData = exampleData.filter(platform =>
    displayOptions.platforms.includes(platform.id)
  );

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-48">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Dashboard</h2>
              <ul className="space-y-2">
                <li
                  className={`flex items-center gap-2 font-medium px-4 py-2 cursor-pointer rounded ${activeTab === 'overview'
                      ? 'bg-purple-100 text-purple-600'
                      : 'text-gray-500'
                    }`}
                  onClick={() => setActiveTab('overview')}
                >
                  <Info />

                  Overview
                </li>
                <li
                  className={`flex items-center gap-2 font-medium px-4 py-2 cursor-pointer rounded ${activeTab === 'comparison'
                      ? 'bg-purple-100 text-purple-600'
                      : 'text-gray-500'
                    }`}
                  onClick={() => setActiveTab('comparison')}
                >
                  <TrendingUp />
                  Comparison
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' ? (
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
                  {displayOptions.showTable ?< h2 className='text-2xl font-semibold my-10'>Performance Metrics</h2>:''}
                <div className="mb-12">
                  {displayOptions.showTable && filteredData.map((platform) => (
                    <div key={platform.id} className="mb-8">
                      <div className="flex items-center gap-2 mb-6">
                        <img src={platform.icon} alt={platform.name} className="w-6 h-6" />
                        <h3 className="text-lg font-semibold">{platform.name}</h3>
                      </div>
                      <PostTable data={sampleData} />
                    </div>
                  ))}
                </div>
              </div>
          </>
          ) : (
          <div className="flex-1">
            <ComparisonFilters
              selectedPlatforms={displayOptions.comparisonPlatforms || ['facebook', 'linkedin', 'twitter']}
              setSelectedPlatforms={(platforms) =>
                setDisplayOptions(prev => ({ ...prev, comparisonPlatforms: platforms }))
              }
              selectedCharts={displayOptions.comparisonCharts || ['audience', 'followers', 'actions']}
              setSelectedCharts={(charts) =>
                setDisplayOptions(prev => ({ ...prev, comparisonCharts: charts }))
              }
              availablePlatforms={availablePlatforms}
            />
            {comparePlatform.map((platform, i) => (
              <ComparisonMetrics
                key={i}
                data={platform}
                selectedPlatforms={displayOptions.comparisonPlatforms || ['facebook', 'linkedin', 'twitter']}
                selectedCharts={displayOptions.comparisonCharts || ['audience', 'followers', 'actions']}
              />
            ))}
          </div>
            )}
        </div>
      </div>
    </div>
    </div >
  );
}

export default App;