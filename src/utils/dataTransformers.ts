import { ChartDataPoint } from '../types';

export const generateChartData = (postsByDate: any, reelsByDate: any, postMetricsByDate: any): ChartDataPoint[] => {
  const chartData = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getUTCMonth()];
    const day = date.getUTCDate().toString().padStart(2, '0');
    const dateString = `${month}-${day}`;

    chartData.push({
      name: dateString,
      posts: postsByDate[dateString] || 0,
      reels: reelsByDate[dateString] || 0,
      likes: postMetricsByDate[dateString]?.likes || 0,
      comments: postMetricsByDate[dateString]?.comments || 0,
      share: postMetricsByDate[dateString]?.shares || 0,
    });
  }
  return chartData;
};

export const generateLineDataPlatform = (fb_postMetricsByDate: any, ig_postMetricsByDate: any,in_postMetricsByDate:any) => {
  const lineDataPlatform = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getUTCMonth()];
    const day = date.getUTCDate().toString().padStart(2, '0');
    const dateString = `${month}-${day}`;

    lineDataPlatform.push({
      name: dateString,
      linkedin: in_postMetricsByDate[dateString]?.total || 0,
      facebook: fb_postMetricsByDate[dateString]?.total || 0,
      instagram: ig_postMetricsByDate[dateString]?.total || 0,
    });
  }

  return lineDataPlatform;
};