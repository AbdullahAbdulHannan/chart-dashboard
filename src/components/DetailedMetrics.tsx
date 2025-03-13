import React from 'react';
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, Tooltip, Legend, XAxis } from 'recharts';
import { PlatformData } from '../types';

export const getCountsByDate = (filteredData: any, timeKey = "created_time", filterType?: string) => {
  const counts: Record<string, number> = {};

  filteredData?.data?.forEach((item: any) => {
    if (!item[timeKey]) return;

    const date = new Date(item[timeKey]);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getUTCMonth()];
    const day = date.getUTCDate().toString().padStart(2, '0');
    const dateString = `${month}-${day}`;

    if (filterType && item.media_type !== filterType) return;

    counts[dateString] = (counts[dateString] || 0) + 1;
  });

  return counts;
};
export const getLinkedInCountsByDate = (filteredData: any, timeKey = "publishedAt") => {
  const counts: Record<string, number> = {};

  filteredData?.elements?.forEach((item: any) => {
    if (!item[timeKey]) return;

    const date = new Date(item[timeKey]); // Convert from Unix timestamp (seconds) to milliseconds
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getUTCMonth()];
    const day = date.getUTCDate().toString().padStart(2, '0');
    const dateString = `${month}-${day}`; // e.g., "Feb-20"


    counts[dateString] = (counts[dateString] || 0) + 1;
  });

  return counts;
};
export const getNewFollowCountsByDate = (filteredData: any, timeKey = "created_time", filterType?: string) => {
  const counts: Record<string, number> = {};

  if (!filteredData?.length) return counts; // Ensure there's data

  filteredData.forEach((item: any) => { // Directly iterate as filteredData is an array
    if (!item[timeKey]) return;

    const date = new Date(item[timeKey]);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getUTCMonth()];
    const day = date.getUTCDate().toString().padStart(2, '0');
    const dateString = `${month}-${day}`;

    counts[dateString] = (counts[dateString] || 0) + (item.value || 0); // Sum values correctly
  });

  return counts;
};

export const getInPostMetricsByDate = (filteredData: any) => {
  const counts: Record<string, any> = {};
console.log('f',filteredData);

  filteredData.forEach((item: any) => {
    if (!item.date || !item.data || !item.data.elements) return;

    const date = new Date(item.date);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getUTCMonth()];
    const day = date.getUTCDate().toString().padStart(2, '0');
    const dateString = `${month}-${day}`;

    item.data.elements.forEach((element: any) => {
      const stats = element.totalShareStatistics;
      if (!stats) return;

      if (!counts[dateString]) {
        counts[dateString] = { likes: 0, comments: 0, shares: 0};
      }

      counts[dateString].likes += stats.likeCount || 0;
      counts[dateString].comments += stats.commentCount || 0;
      counts[dateString].shares += stats.shareCount || 0;
    });

    counts[dateString].total =
      counts[dateString].likes +
      counts[dateString].comments +
      counts[dateString].shares;
  });

  return counts;
};


export const getPostMetricsByDate = (filteredData: any, timeKey = "created_time") => {
  const counts: Record<string, any> = {};

  filteredData.data.forEach(item => {
    if (!item[timeKey]) return;

    const date = new Date(item[timeKey]);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getUTCMonth()]; // Get the 3-letter month name
    const day = date.getUTCDate().toString().padStart(2, '0'); // Day (01-31)
    const dateString = `${month}-${day}`; // Outputs "Feb-20"

    if (!counts[dateString]) {
      counts[dateString] = { likes: 0, comments: 0, shares: 0 };
    }

    counts[dateString].likes += item.reactions?.summary?.total_count || 0;
    counts[dateString].comments += item.comments?.summary?.total_count || 0;
    counts[dateString].shares += item.shares?.count || 0;
    counts[dateString].total = counts[dateString].likes + counts[dateString].comments + counts[dateString].shares;
  });

  return counts;
};
export const getIgPostMetricsByDate = (filteredData: any, timeKey = "timestamp") => {
  const counts: Record<string, any> = {};

  filteredData.data.forEach(item => {
    if (!item[timeKey]) return;

    const date = new Date(item[timeKey]);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getUTCMonth()]; // Get the 3-letter month name
    const day = date.getUTCDate().toString().padStart(2, '0'); // Day (01-31)
    const dateString = `${month}-${day}`; // Outputs "Feb-20"

    if (!counts[dateString]) {
      counts[dateString] = { likes: 0, comments: 0, shares: 0 };
    }

    counts[dateString].likes += item.like_count || 0;
    counts[dateString].comments += item.comments_count || 0;
    counts[dateString].shares += item.insights.data[0].values[0].value|| 0;
    counts[dateString].total = counts[dateString].likes + counts[dateString].comments + counts[dateString].shares;
  });

  return counts;
};

// Combine into a single dataset for the LineChart

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
    <XAxis dataKey="name"/>
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
      dataKey="reels"
      stroke="#7b68ee"
      strokeWidth={1}
      dot={false}
    />
    <Line
      type="monotone"
      dataKey="new_following"
      stroke="skyblue"
      strokeWidth={1}
      dot={false}
    />
  </LineChart>
</ResponsiveContainer>;
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
                    <XAxis dataKey="name"/>
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