import React from 'react';
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Tooltip, Legend } from 'recharts';
import { PlatformData } from '../types';

interface DetailedMetricsProps {
  data: PlatformData;
  showGraphs: boolean;
  options: {
    showAudienceEngagement: boolean;
    showPostPerformance: boolean;
    showActionsOnPost: boolean;
  };
}

export function DetailedMetrics({ data, showGraphs, options }: DetailedMetricsProps) {
  if (!showGraphs) return null;

  // Count how many charts are visible to adjust the grid
  const visibleCharts = [
    options.showAudienceEngagement,
    options.showPostPerformance,
    options.showActionsOnPost
  ].filter(Boolean).length;

  // Determine grid columns based on visible charts
  const gridCols = visibleCharts === 1 ? 'grid-cols-1' : 'grid-cols-2';

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg p-6 mt-10">
        <div className="flex items-center gap-2 mb-6">
          <img src={data.icon} alt={data.name} className="w-6 h-6" />
          <h3 className="text-lg font-semibold">{data.name}</h3>
        </div>

        <div className={`grid ${gridCols} gap-8`}>
          {options.showAudienceEngagement && (
            <div className="min-w-[300px]">
              <h4 className="text-md text-gray-500 mb-4">Audience Engagement</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Legend/>
                    <Tooltip/>
                    <Pie
                      data={data.donutData}
                      innerRadius={60}
                      outerRadius={110}
                      paddingAngle={1}
                      dataKey="value"
                    >
                      {data.donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {options.showPostPerformance && (
            <div className="min-w-[300px]">
              <h4 className="text-md text-gray-500 mb-4">Monthly Post Performance</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.chartData}>
                    <CartesianGrid stroke="#faf5f5" strokeDasharray="5 5"/>
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="posts"
                      stroke="#c8a2c8"
                      strokeWidth={1}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="stories"
                      stroke="skyblue"
                      strokeWidth={1}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="new_following"
                      stroke="#7b68ee"
                      strokeWidth={1}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {options.showActionsOnPost && (
            <div className={`min-w-[300px] ${visibleCharts === 3 ? 'col-span-2' : ''}`}>
              <h4 className="text-md text-gray-500 mb-4">Actions On Post</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.chartData}>
                    <CartesianGrid stroke="#faf5f5" strokeDasharray="5 5"/>
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="likes"
                      stroke="skyblue"
                      strokeWidth={1}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="share"
                      stroke="blue"
                      strokeWidth={1}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="comments"
                      stroke="red"
                      strokeWidth={1}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}