export interface PlatformData {
  id: string;
  name: string;
  icon: string;
  followers: number;
  new_following: number;
  growth: number;
  chartData: {
    name: string;
    posts: number;
    stories: number;
    new_following: number;
    likes: number;
    share: number;
    comments: number;
  }[];
  donutData: {
    name: string;
    value: number;
    color: string;
  }[];
}

export interface ComparisonPlatform {
  donutDataPlatform: {
    name: string;
    value: number;
    color: string;
  }[];
  barDataPlatform: {
    name: string;
    facebook: number;
    linkedin: number;
    twitter: number;
  }[];
  lineDataPlatform: {
    name: string;
    facebook: number;
    linkedin: number;
    twitter: number;
  }[];
}

export interface DisplayOptions {
  platforms: string[];
  showGraphs: boolean;
  showNumbers: boolean;
  showTable:boolean;
  selectedPlatform: string;
  showAudienceEngagement: boolean;
  showPostPerformance: boolean;
  showActionsOnPost: boolean;
  comparisonPlatforms?: string[];
  comparisonCharts?: string[];
}