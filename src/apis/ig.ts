import axios from 'axios';

const accessToken = 'EAASbD3SBqFoBO7CgUP9vZCj4Ut3vBl5DkNQXRam2by8kH5TXOFdmyqSLO0EEhKIA6RkbNJzkZBqJZAjVyUwZAMoeYZAeXFTedvlBF04p8a7AhdTdeaOPLblXKt1Dtgoqqcp1YQIDtacnZCNENOmZCP5JyA40bwITn3kO5feSD2kuyEpldqaxXlqurtWrSys5JULs2Q8SgfmXzgDAnEZD';
const instagramId = '17841459272541177';

// Helper function to get Unix timestamps
const getTimeRanges = () => {
  const now:any = Math.floor(Date.now() / 1000);
  const thirtyDaysAgo = now - (30 * 24 * 60 * 60);
  
 



  const ninetyDaysAgo = now - (90 * 24 * 60 * 60);
  const pageCreationDate = new Date('2024-01-01').getTime() / 1000;
  // Replace with your page creation date in Unix timestamp
  const startOfToday = Math.floor(new Date().setHours(0, 0, 0, 0) / 1000); // Start of today
  const currentTime = Math.floor(Date.now() / 1000); // Current time
  return {
    now,
    thirtyDaysAgo,
    ninetyDaysAgo,
    pageCreationDate,
    startOfToday,
    currentTime,
  };
};

// API URLs builder
const buildApiUrls = () => {
  const times = getTimeRanges();

  return {
    followers: `https://graph.facebook.com/v22.0/${instagramId}?fields=followers_count&access_token=${accessToken}`,
    views: `https://graph.facebook.com/v22.0/${instagramId}/insights?metric=views&metric_type=total_value&since=${times.startOfToday}&until=${times.currentTime}&period=day&access_token=${accessToken}`,
    newFollowers: `https://graph.facebook.com/v22.0/${instagramId}/insights?metric=follows_and_unfollows&metric_type=total_value&period=day&access_token=${accessToken}`,
    // newFollowers: `https://graph.facebook.com/v19.0/${instagramId}/insights?metric=follower_count&period=day&since=${times.startOfToday}&until=${times.currentTime}&access_token=${accessToken}`,

    posts: `https://graph.facebook.com/v22.0/${instagramId}/media?fields=id,media_type,caption,timestamp,comments_count,like_count&access_token=${accessToken}`,
    filteredPosts: `https://graph.facebook.com/v22.0/${instagramId}/media?fields=id,media_type,caption,timestamp,comments_count,like_count,insights.metric(saved)&since=${times.thirtyDaysAgo}&until=${times.now}&access_token=${accessToken}`,
    interactions: `https://graph.facebook.com/v22.0/${instagramId}/insights?metric=comments,likes,shares&since=${times.thirtyDaysAgo}&until=${times.now}&metric_type=total_value&period=day&access_token=${accessToken}`,
    // total_interactions: `https://graph.facebook.com/v22.0/${instagramId}/insights?metric=comments,likes,shares&since=${times.pageCreationDate}&until=${times.now}&metric_type=total_value&period=day&access_token=${accessToken}`,
    // bar_interactions: `https://graph.facebook.com/v22.0/${instagramId}/insights?metric=comments,likes,shares&since=${times.ninetyDaysAgo}&until=${times.now}&metric_type=total_value&period=day&access_token=${accessToken}`
  }as const;
};

// Types for the Instagram data
export interface InstagramData {
  followers: any;
  views: any;
  newFollowers: any;
  posts: any;
  filteredPosts: any;
  interactions: any;
  total_interactions: any;
  bar_interactions: any;
  followersCurrentMonth: any;
  followersPreviousMonth: any;
  followersSecondPreviousMonth: any;
}

// Main fetch function
export const fetchInstagramData = async (): Promise<InstagramData> => {
  try {
    const urls = buildApiUrls() ;
    const requests = (Object.keys(urls) as Array<keyof typeof urls>).map(key =>
        axios.get(urls[key]).then(response => ({ [key]: response.data }))
      );
    
    const results = await Promise.all(requests);
    const data = results.reduce((acc, result) => ({ ...acc, ...result }), {}) as InstagramData;
    
    // Store the data in our singleton
    // InstagramDataStore.getInstance().setData(data);
    
    return data;
  } catch (error) {
    console.error('Error fetching Instagram data:', error);
    throw error;
  }
};