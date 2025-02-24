export interface PlatformData {
  id: string;
  name: string;
  icon: string;
  followers: number;
  new_following: number;
  views: number;
  chartData: ChartDataPoint[];
  donutData: DonutDataPoint[];
}

export interface ChartDataPoint {
  name: string;
  posts: number;
  reels: number;
  likes: number;
  comments: number;
  share: number;
}

export interface DonutDataPoint {
  name: string;
  value: number;
  color: string;
}

export interface DisplayOptions {
  platforms: string[];
  showGraphs: boolean;
  showNumbers: boolean;
  showTable: boolean;
  selectedPlatform: string;
  showAudienceEngagement: boolean;
  showPostPerformance: boolean;
  showActionsOnPost: boolean;
  comparisonPlatforms: string[];
  comparisonCharts: string[];
}

export interface ComparisonPlatform {
  donutDataPlatform: DonutDataPoint[];
  lineDataPlatform: LineDataPoint[];
  barDataPlatform: BarDataPoint[];
}

export interface LineDataPoint {
  name: string;
  linkedin: number;
  facebook: number;
  instagram: number;
}

export interface BarDataPoint {
  name: string;
  linkedin: number;
  facebook: number;
  instagram: number;
}

export interface PostData {
  title: string;
  engagementScore: number;
  datePosted: string;
}