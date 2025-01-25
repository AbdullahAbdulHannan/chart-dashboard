import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { ComparisonPlatform } from '../types';

interface ComparisonMetricsProps {
  data: ComparisonPlatform;
  selectedPlatforms: string[];
  selectedCharts: string[];
}

const ComparisonMetrics = ({ data, selectedPlatforms, selectedCharts }: ComparisonMetricsProps) => {
  // Filter data based on selected platforms
  const filteredDonutData = data.donutDataPlatform.filter(item => 
    selectedPlatforms.includes(item.name.toLowerCase())
  );

  const filterBarData = data.barDataPlatform.map(item => {
    const filtered: any = { name: item.name };
    selectedPlatforms.forEach(platform => {
      filtered[platform] = item[platform as keyof typeof item];
    });
    return filtered;
  });

  const filterLineData = data.lineDataPlatform.map(item => {
    const filtered: any = { name: item.name };
    selectedPlatforms.forEach(platform => {
      filtered[platform] = item[platform as keyof typeof item];
    });
    return filtered;
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-8">
        {selectedCharts.includes('audience') && (
          <div>
            <h4 className="text-md text-gray-500 mb-4">Audience Growth</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Legend />
                  <Tooltip />
                  <Pie
                    data={filteredDonutData}
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={1}
                    dataKey="value"
                  >
                    {filteredDonutData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedCharts.includes('followers') && (
          <div>
            <h4 className="text-md text-gray-500 mb-4">Platform Followers</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filterBarData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <Tooltip />
                  <Legend />
                  {selectedPlatforms.map((platform, index) => (
                    <Bar
                      key={platform}
                      dataKey={platform}
                      fill={['#8884d8', 'blue', 'orange'][index]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {selectedCharts.includes('actions') && (
        <div className="w-full mt-8">
          <h4 className="text-md text-gray-500 mb-4">Actions On Post</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filterLineData}>
                <CartesianGrid stroke="#faf5f5" strokeDasharray="5 5" />
                <Tooltip />
                <Legend />
                {selectedPlatforms.map((platform, index) => (
                  <Line
                    key={platform}
                    type="monotone"
                    dataKey={platform}
                    stroke={['skyblue', 'red', 'blue'][index]}
                    strokeWidth={1}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparisonMetrics;